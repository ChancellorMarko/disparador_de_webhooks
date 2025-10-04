const Joi = require("joi");

const reenviarSchema = Joi.object({
  product: Joi.string().valid("boleto", "pagamento", "pix").required(),
  id: Joi.array().items(Joi.string()).min(1).max(30).required(),
  kind: Joi.string().valid("webhook").required(),
  type: Joi.string().valid("disponivel", "cancelado", "pago").required(),
});

const validateReenvio = (req, res, next) => {
  const { error } = reenviarSchema.validate(req.body);
  if (error) {
    return res.status(422).json({
      success: false,
      error: error.details[0].message,
    });
  }
  next();
};

module.exports = { validateReenvio };