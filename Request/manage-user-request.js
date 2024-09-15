import Joi from 'joi';

const userValidationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Username should be a type of text',
      'string.empty': 'Username cannot be empty',
      'string.min': 'Username should have at least 3 characters',
      'string.max': 'Username should have at most 30 characters',
      'any.required': 'Username is required'
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })  // `allow: false` to skip domain validation
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be exactly 10 digits',
      'string.empty': 'Phone number cannot be empty',
      'any.required': 'Phone number is required'
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password should have at least 8 characters',
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required'
    })
});

export default userValidationSchema;
