const Joi = require("joi");
const moment = require("moment");

const listagemProtocolosSchema = Joi.object({
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().required(),
  product: Joi.string().valid("boleto", "pagamento", "pix").optional(),
  id: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
  kind: Joi.string().valid("webhook").optional(),
  type: Joi.string().valid("disponivel", "cancelado", "pago").optional(),
});

const validateListagemProtocolos = (req, res, next) => {
  const { error } = listagemProtocolosSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }

  const startDate = moment(req.query.start_date);
  const endDate = moment(req.query.end_date);
  if (endDate.isBefore(startDate)) {
    return res.status(400).json({ success: false, error: "A data final não pode ser menor que a data inicial." });
  }
  if (endDate.diff(startDate, 'days') > 31) {
    return res.status(400).json({ success: false, error: "O intervalo entre as datas não pode exceder 31 dias." });
  }

  next();
};

module.exports = { validateListagemProtocolos };