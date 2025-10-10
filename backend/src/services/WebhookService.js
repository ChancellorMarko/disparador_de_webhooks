const axios = require("axios");
const crypto = require("crypto");
const { WebhookRepository, SoftwareHouseRepository } = require("../repositories");
const { ValidationError, NotFoundError } = require("../utils/errors");

class WebhookService {
  async send(softwareHouseId, payload, evento) {
    const softwareHouse = await SoftwareHouseRepository.findById(softwareHouseId);
    if (!softwareHouse || !softwareHouse.webhook_url || !softwareHouse.webhook_ativo) {
      throw new ValidationError("Webhook da Software House não está configurado ou está inativo.");
    }

    const webhookData = { evento, timestamp: new Date().toISOString(), dados: payload };
    const webhook = await WebhookRepository.create({
        software_house_id: softwareHouseId, evento, payload: webhookData,
        url: softwareHouse.webhook_url, status: "pendente",
    });

    try {
      const response = await this.sendHttpRequest(softwareHouse.webhook_url, webhookData, softwareHouse.webhook_secret);
      await WebhookRepository.update(webhook.id, { status: "enviado", status_code: response.status });
      return { success: true, webhook_id: webhook.id };
    } catch (error) {
      await WebhookRepository.update(webhook.id, { status: "erro", erro: error.message, tentativas: 1 });
      this.retry(webhook.id); // Inicia o processo de retry em background
      return { success: false, webhook_id: webhook.id, error: error.message };
    }
  }

  async sendHttpRequest(url, data, secret = null) {
    const headers = { "Content-Type": "application/json" };
    if (secret) {
      const signature = crypto.createHmac("sha256", secret).update(JSON.stringify(data)).digest("hex");
      headers["X-Webhook-Signature"] = signature;
    }
    return await axios.post(url, data, { headers, timeout: 10000 });
  }

  async retry(webhookId) {
    const webhook = await WebhookRepository.findById(webhookId);
    if (!webhook || webhook.status !== 'erro' || webhook.tentativas >= 3) {
      if(webhook && webhook.tentativas >= 3) {
        await SoftwareHouseRepository.update(webhook.software_house_id, { webhook_ativo: false });
      }
      return;
    }

    const delay = Math.pow(2, webhook.tentativas) * 1000; // Backoff exponencial
    setTimeout(async () => {
        try {
            const softwareHouse = await SoftwareHouseRepository.findById(webhook.software_house_id);
            await this.sendHttpRequest(webhook.url, webhook.payload, softwareHouse.webhook_secret);
            await WebhookRepository.update(webhookId, { status: "enviado" });
        } catch (error) {
            const novasTentativas = webhook.tentativas + 1;
            await WebhookRepository.update(webhookId, { erro: error.message, tentativas: novasTentativas });
            this.retry(webhookId); // Agenda o próximo retry se necessário
        }
    }, delay);
  }
}

module.exports = new WebhookService();