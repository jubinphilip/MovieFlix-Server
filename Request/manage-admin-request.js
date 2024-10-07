import Joi from 'joi';

const movieValidationSchema = Joi.object({
  // Validation for title
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.base': 'Title should be a type of text',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title should have at least 1 character',
      'string.max': 'Title should have at most 100 characters',
      'any.required': 'Title is required'
    }),

  // Validation for description
  description: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.base': 'Description should be a type of text',
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description should have at least 5 characters',
      'string.max': 'Description should have at most 500 characters',
      'any.required': 'Description is required'
    }),

  // Validation for language (only letters and spaces)
  language: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/) 
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Language should be a type of text',
      'string.empty': 'Language cannot be empty',
      'string.min': 'Language should have at least 2 characters',
      'string.max': 'Language should have at most 50 characters',
      'string.pattern.base': 'Language can only contain letters and spaces',
      'any.required': 'Language is required'
    }),

  // Validation for genre
  genre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Genre should be a type of text',
      'string.empty': 'Genre cannot be empty',
      'string.min': 'Genre should have at least 2 characters',
      'string.max': 'Genre should have at most 50 characters',
      'any.required': 'Genre is required'
    }),

  // Validation for rating (must be a number between 0 and 10)
  rating: Joi.number()
    .min(0)
    .max(10)
    .required()
    .messages({
      'number.base': 'Rating should be a number',
      'number.min': 'Rating cannot be lower than 0',
      'number.max': 'Rating cannot be higher than 10',
      'any.required': 'Rating is required'
    }),

  // Validation for summary
  summary: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.base': 'Summary should be a type of text',
      'string.empty': 'Summary cannot be empty',
      'string.min': 'Summary should have at least 5 characters',
      'string.max': 'Summary should have at most 500 characters',
      'any.required': 'Summary is required'
    }),

  // Validation for actor (optional but must be a string)
  actor: Joi.string()
    .pattern(/^[a-zA-Z\s]*$/) 
    .messages({
      'string.pattern.base': 'Actor name must contain only letters and spaces',
      'string.empty': 'Actor name cannot be empty'
    }),

  // Validation for actress (optional but must be a string)
  actress: Joi.string()
    .pattern(/^[a-zA-Z\s]*$/) 
    .messages({
      'string.pattern.base': 'Actress name must contain only letters and spaces',
      'string.empty': 'Actress name cannot be empty'
    }),

  // Validation for director (optional but must be a string)
  director: Joi.string()
    .pattern(/^[a-zA-Z\s]*$/) 
    .messages({
      'string.pattern.base': 'Director name must contain only letters and spaces',
      'string.empty': 'Director name cannot be empty'
    }),

  // Validation for production (optional but must be a string)
  production: Joi.string()
    .pattern(/^[a-zA-Z\s]*$/) 
    .messages({
      'string.pattern.base': 'Production company name must contain only letters and spaces',
      'string.empty': 'Production company name cannot be empty'
    }),
});



// Define the Joi schema
const theatreSchema = Joi.object({
  theatrename: Joi.string()
    .pattern(/^[a-zA-Z]+$/) // Only letters a-z (case-insensitive)
    .required()
    .messages({
      'string.empty': 'Theatre name is required',
      'string.pattern.base': 'Theatre name must contain only letters (a-z)',
    }),
  
  theatreloc: Joi.string()
    .pattern(/^[a-zA-Z]+$/) // Only letters a-z (case-insensitive)
    .required()
    .messages({
      'string.empty': 'Theatre location is required',
      'string.pattern.base': 'Theatre location must contain only letters (a-z)',
    }),
  
  seats: Joi.number()
    .integer()
    .min(1) // Minimum of 1 seat
    .required()
    .messages({
      'number.base': 'Number of seats must be an integer',
      'number.integer': 'Number of seats must be an integer',
      'number.min': 'Number of seats must be at least 1',
      'any.required': 'Number of seats is required',
    }),
  
  ticketprice: Joi.string().required().messages({
    'string.empty': 'Ticket price is required'
  }),
});
export  {movieValidationSchema,theatreSchema};
