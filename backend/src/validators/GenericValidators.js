const Joi = require("joi");

// --- SCHEMAS BASE ---

// Valida um ID numérico nos parâmetros da URL (ex: /cedentes/123)
const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

// Valida um UUID nos parâmetros da URL (ex: /protocolos/uuid-aqui)
const uuidParamSchema = Joi.object({
  uuid: Joi.string().uuid().required(),
});

// --- SCHEMAS DE ENTIDADES ---

// -- SOFTWARE HOUSE --
const softwareHouseCreateSchema = Joi.object({
  cnpj: Joi.string().length(14).pattern(/^[0-9]+$/).required().messages({
    'string.length': 'O CNPJ deve ter exatamente 14 dígitos.',
    'string.pattern.base': 'O CNPJ deve conter apenas números.',
  }),
  // Adicione outros campos obrigatórios na criação, se houver
});

const softwareHouseUpdateSchema = Joi.object({
  cnpj: Joi.string().length(14).pattern(/^[0-9]+$/).optional(),
  status: Joi.string().valid("ativo", "inativo", "bloqueado").optional(),
  // Adicione outros campos que podem ser atualizados
});


// -- CEDENTE --
const cedenteCreateSchema = Joi.object({
  cnpj: Joi.string().length(14).pattern(/^[0-9]+$/).required(),
  softwarehouse_id: Joi.number().integer().positive().required(),
  // Adicione outros campos obrigatórios aqui
});

const cedenteUpdateSchema = Joi.object({
  cnpj: Joi.string().length(14).pattern(/^[0-9]+$/).optional(),
  status: Joi.string().valid("ativo", "inativo", "bloqueado").optional(),
  configuracao_notificacao: Joi.object().optional(), // Validação básica para o objeto JSON
});


// -- CONTA --
const contaCreateSchema = Joi.object({
  produto: Joi.string().valid("boleto", "pagamento", "pix").required(),
  banco_codigo: Joi.string().required(),
  cedente_id: Joi.number().integer().positive().required(),
});

const contaUpdateSchema = Joi.object({
  produto: Joi.string().valid("boleto", "pagamento", "pix").optional(),
  banco_codigo: Joi.string().optional(),
  status: Joi.string().valid("ativo", "inativo", "bloqueado").optional(),
  configuracao_notificacao: Joi.object().optional(),
});


// -- CONVENIO --
const convenioCreateSchema = Joi.object({
  numero_convenio: Joi.string().required(),
  conta_id: Joi.number().integer().positive().required(),
});

const convenioUpdateSchema = Joi.object({
  numero_convenio: Joi.string().optional(),
});


// -- SERVICO --
const servicoCreateSchema = Joi.object({
  convenio_id: Joi.number().integer().positive().required(),
  status: Joi.string().valid("ativo", "inativo", "bloqueado").default("ativo"),
});

const servicoUpdateSchema = Joi.object({
  status: Joi.string().valid("ativo", "inativo", "bloqueado").optional(),
});


// --- MIDDLEWARE GENÉRICO ---
// Função que cria um middleware de validação para qualquer schema e propriedade (body, params, query)
const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      // Retorna erro 422 para dados inválidos
      return res.status(422).json({
        success: false,
        error: error.details[0].message,
      });
    }
    next();
  };
};

// --- EXPORTAÇÕES ---
module.exports = {
  validate,
  idParamSchema,
  uuidParamSchema,
  softwareHouseCreateSchema,
  softwareHouseUpdateSchema,
  cedenteCreateSchema,
  cedenteUpdateSchema,
  contaCreateSchema,
  contaUpdateSchema,
  convenioCreateSchema,
  convenioUpdateSchema,
  servicoCreateSchema,
  servicoUpdateSchema,
};