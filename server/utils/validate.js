import Joi from "joi";
import { Types } from "mongoose";
const { ObjectId } = Types;

export const validateObjectId = (id) =>
    Joi.string()
        .custom((value, helpers) => {
            const isValidId = ObjectId.isValid(value);
            return isValidId ? value : helpers.error("any.invalid");
        }, "objectid")
        .required()
        .messages({
            "any.invalid": "ID provided is not valid. Provide a valid ID.",
            "any.required": "ID is required.",
        })
        .validate(id);

export const validateMemberObject = (dataObject, action = "CREATE") => {
    let schema = Joi.object({
        name: Joi.string().regex(new RegExp("^[a-zA-Z][a-zA-Z\\s]+$")).required().messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "any.required": "Name is required",
            "string.pattern.base": "Name must start with letter and contain only letters and white space.",
        }),
        email: Joi.string().email().required().messages({
            "string.base": "Provide a valid e-mail",
            "string.email": "Provide a valid e-mail",
            "string.empty": "E-Mail is required",
            "any.required": "E-Mail is required.",
        }),
        role: Joi.string().valid("Employee", "Freelancer").required().messages({
            "any.only": "The role assigned must be either Employee or Freelancer.",
            "any.required": "Role must be assigned.",
        }),
        number: Joi.string().regex(new RegExp("^[0-9]{10}$")).required().messages({
            "string.base": "Contact number must be a string of 10 digits.",
            "any.required": "Contact number is required.",
            "string.empty": "Contact number is required.",
            "string.pattern.base": "Contact number must contain 10 digits.",
        }),
        isActive: Joi.boolean().messages({
            "any.required": "Active status of the member is required.",
            "boolean.base": "Active status value must be either true or false.",
        }),
    });

    if (action === "UPDATE") {
        const makeRequired = (x) => x.required();
        schema = schema.fork(["isActive"], makeRequired);
    }

    return schema.options({ stripUnknown: true }).validate(dataObject);
};

export const validateTaskObject = (dataObject) => {
    return Joi.object({
        name: Joi.string().regex(new RegExp("^[a-zA-Z0-9][a-zA-Z0-9.-@\\s]+$")).required().messages({
            "string.base": "Task name must be a string",
            "string.empty": "Task name is required",
            "any.required": "Task name is required",
            "string.pattern.base": "Task name does not match the regex pattern.",
        }),
        description: Joi.string().required().messages({
            "string.base": "Task description must be a string",
            "string.empty": "Task description is required",
            "any.required": "Task description is required",
        }),
        deadline: Joi.date().required().messages({
            "date.base": "Provide a valid deadline date.",
            "any.required": "Task deadline date is required",
        }),
    })
        .options({ stripUnknown: true })
        .validate(dataObject);
};

export const validateLoginObject = (dataObject) =>
    Joi.object({
        email: Joi.string().email().required().messages({
            "string.base": "Provide a valid e-mail",
            "string.email": "Provide a valid e-mail",
            "string.empty": "E-Mail is required",
            "any.required": "E-Mail is required.",
        }),
        password: Joi.string().required().messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
            "any.required": "Password is required",
        }),
    })
        .options({ stripUnknown: true })
        .validate(dataObject);
