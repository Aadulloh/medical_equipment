const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be an empty field`,
    "string.max": `"name" should have a maximum length of 100`,
    "any.required": `"name" is a required field`,
  }),

  ownerId: Joi.required(),
  categoryId: Joi.required(),

  description: Joi.string().allow(null, "").messages({
    "string.base": `"description" should be a type of 'text'`,
  }),
});

const statusSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be an empty field`,
    "string.max": `"name" should have a maximum length of 100`,
    "any.required": `"name" is a required field`,
  }),
});

const paymentSchema = Joi.object({
  emount: Joi.number().integer().positive().required().messages({
    "number.base": `"emount" must be a number`,
    "number.positive": `"emount" must be a positive number`,
    "any.required": `"emount" is a required field`,
  }),

  payment_date: Joi.date().iso().required().messages({
    "date.base": `"payment_date" must be a valid date`,
    "any.required": `"payment_date" is a required field`,
  }),

  payment_method: Joi.string()
    .valid("cash", "card", "transfer")
    .required()
    .messages({
      "any.only": `"payment_method" must be one of 'cash', 'card', or 'transfer'`,
      "any.required": `"payment_method" is a required field`,
    }),
  contractId: Joi.required(),
});

const ownerSchema = Joi.object({
  full_name: Joi.string().max(100).required().messages({
    "string.base": `"full_name" should be a type of 'text'`,
    "string.empty": `"full_name" cannot be an empty field`,
    "string.max": `"full_name" should have a maximum length of 100`,
    "any.required": `"full_name" is a required field`,
  }),

  phone: Joi.string()
    .pattern(/^\+998\d{9}$/)
    .required()
    .messages({
      "string.base": `"phone" should be a type of 'text'`,
      "string.empty": `"phone" cannot be empty`,
      "string.pattern.base": `"phone" must be a valid Uzbek number (e.g., +998901234567)`,
      "any.required": `"phone" is a required field`,
    }),

  address: Joi.string().max(255).required().messages({
    "string.base": `"address" should be a type of 'text'`,
    "string.max": `"address" should have a maximum length of 255`,
    "any.required": `"address" is a required field`,
  }),

  is_active: Joi.boolean().default(false),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(30)
    .required()
    .messages({
      "string.base": `"email" should be a type of 'text'`,
      "string.email": `"email" must be a valid email address (e.g., user@example.com)`,
      "string.empty": `"email" cannot be empty`,
      "string.max": `"email" should have a maximum length of 30 characters`,
      "any.required": `"email" is required`,
    }),

  password: Joi.string().min(6).max(50).required().messages({
    "string.min": `"password" should have a minimum length of 6`,
    "string.max": `"password" should have a maximum length of 50`,
    "any.required": `"password" is a required field`,
  }),
});

const contractSchema = Joi.object({
  start_date: Joi.date().iso().required().messages({
    "date.base": `"start_date" must be a valid date`,
    "any.required": `"start_date" is a required field`,
  }),

  end_date: Joi.date().iso().min(Joi.ref("start_date")).required().messages({
    "date.base": `"end_date" must be a valid date`,
    "date.min": `"end_date" must be later than or equal to "start_date"`,
    "any.required": `"end_date" is a required field`,
  }),

  demage_report: Joi.string().max(255).allow(null, "").messages({
    "string.base": `"demage_report" should be a string`,
    "string.max": `"demage_report" should have a maximum length of 255`,
  }),

  clientId: Joi.number().integer().positive().required().messages({
    "number.base": `"clientId" must be a number`,
    "any.required": `"clientId" is required`,
  }),

  productId: Joi.number().integer().positive().required().messages({
    "number.base": `"productId" must be a number`,
    "any.required": `"productId" is required`,
  }),

  statusId: Joi.number().integer().positive().required().messages({
    "number.base": `"statusId" must be a number`,
    "any.required": `"statusId" is required`,
  }),
});

const clientSchema = Joi.object({
  full_name: Joi.string().max(100).required().messages({
    "string.base": `"full_name" should be a type of 'text'`,
    "string.empty": `"full_name" cannot be empty`,
    "string.max": `"full_name" should have a maximum length of 100`,
    "any.required": `"full_name" is required`,
  }),

  phone: Joi.string()
    .pattern(/^\+998\d{9}$/)
    .required()
    .messages({
      "string.base": `"phone" should be a type of 'text'`,
      "string.empty": `"phone" cannot be empty`,
      "string.pattern.base": `"phone" must be a valid Uzbek number (e.g., +998901234567)`,
      "any.required": `"phone" is a required field`,
    }),

  address: Joi.string().max(255).required().messages({
    "string.base": `"address" should be a type of 'text'`,
    "string.max": `"address" should have a maximum length of 255`,
    "any.required": `"address" is required`,
  }),

  is_active: Joi.boolean().default(false),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(30)
    .required()
    .messages({
      "string.base": `"email" should be a type of 'text'`,
      "string.email": `"email" must be a valid email address (e.g., user@example.com)`,
      "string.empty": `"email" cannot be empty`,
      "string.max": `"email" should have a maximum length of 30 characters`,
      "any.required": `"email" is required`,
    }),

  passport: Joi.string()
    .pattern(/^[A-Z]{2}[0-9]{7}$/)
    .required()
    .messages({
      "string.pattern.base": `"passport" must start with 2 uppercase letters followed by 7 digits (e.g., AB1234567)`,
      "string.empty": `"passport" cannot be empty`,
      "any.required": `"passport" is required`,
    }),
});

const categorySchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be empty`,
    "string.max": `"name" should have a maximum length of 100`,
    "any.required": `"name" is a required field`,
  }),

  description: Joi.string().allow(null, "").messages({
    "string.base": `"description" should be a type of 'text'`,
  }),
});

const adminSchema = Joi.object({
  full_name: Joi.string().max(100).required().messages({
    "string.base": `"full_name" should be a type of 'text'`,
    "string.empty": `"full_name" cannot be empty`,
    "string.max": `"full_name" should have a maximum length of 100`,
    "any.required": `"full_name" is required`,
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(30)
    .required()
    .messages({
      "string.base": `"email" should be a type of 'text'`,
      "string.email": `"email" must be a valid email address (e.g., user@example.com)`,
      "string.empty": `"email" cannot be empty`,
      "string.max": `"email" should have a maximum length of 30 characters`,
      "any.required": `"email" is required`,
    }),

  is_active: Joi.boolean().default(false),

  password: Joi.string().min(6).max(50).required().messages({
    "string.base": `"password" should be a type of 'text'`,
    "string.empty": `"password" cannot be empty`,
    "string.min": `"password" must be at least 6 characters long`,
    "string.max": `"password" should have a maximum length of 50 characters`,
    "any.required": `"password" is required`,
  }),
});

module.exports = {
  productSchema,
  statusSchema,
  paymentSchema,
  ownerSchema,
  contractSchema,
  clientSchema,
  categorySchema,
  adminSchema,
};
