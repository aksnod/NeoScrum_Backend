const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required().max(30),
  email: Joi.string().required().email(),
  avater: Joi.optional(),
});
module.exports = schema;
