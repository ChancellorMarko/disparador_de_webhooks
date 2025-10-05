const axios = require("axios");
const crypto = require("crypto");
const { WebhookRepository, SoftwareHouseRepository } = require("../repositories");
const { ValidationError, NotFoundError } = require("../utils/errors");
const retryWebhook = require("./retryWebhook"); // Importa o serviço de retry

class sendWebhook {
  async sendHttpRequest(url, data, secret = null) {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "TecnoSpeed-Webhook/1.0",
    };

    if (secret) {
      const signature = crypto.createHmac("sha256", secret).update(JSON.stringify(data)).digest("hex");
      headers["X-Webhook-Signature"] = signature;
    }

    return await axios.post(url, data, {
      headers,
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 300,
    });
  }

  async execute(softwareHouseId, payload, evento) {
    const validEventos = ["protocolo_criado", "protocolo_concluido", "protocolo_erro", "protocolo_cancelado"];
    if (!validEventos.includes(evento)) {
      throw new ValidationError(`Evento inválido. Valores permitidos: ${validEventos.join(", ")}`);
    }

    const softwareHouse = await SoftwareHouseRepository.findById(softwareHouseId);
    if (!softwareHouse) {
      throw new NotFoundError("Software House não encontrada");
    }

    if (!softwareHouse.webhook_url) {
      throw new ValidationError("Software House não possui webhook configurado");
    }

    if (!softwareHouse.webhook_ativo) {
      throw new ValidationError("Webhook da Software House está desativado");
    }

    const webhookData = {
      evento,
      timestamp: new Date().toISOString(),
      software_house_id: softwareHouseId,
      dados: payload,
    };

    const webhook = await WebhookRepository.create({
      software_house_id: softwareHouseId,
      evento,
      payload: webhookData,
      url: softwareHouse.webhook_url,
      status: "pendente",
      tentativas: 0,
    });

    try {
      const response = await this.sendHttpRequest(softwareHouse.webhook_url, webhookData, softwareHouse.webhook_secret);

      await WebhookRepository.update(webhook.id, {
        status: "enviado",
        status_code: response.status,
        resposta: response.data,
        enviado_em: new Date(),
      });

      return { success: true, webhook_id: webhook.id, status_code: response.status };
    } catch (error) {
      await WebhookRepository.update(webhook.id, {
        status: "erro",
        status_code: error.response?.status || 0,
        erro: error.message,
        tentativas: 1,
      });

      await retryWebhook.execute(webhook.id);

      return { success: false, webhook_id: webhook.id, error: error.message };
    }
  }
}

module.exports = new sendWebhook();