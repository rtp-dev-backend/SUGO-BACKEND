import { NextFunction, Request, Response } from "express";
import Joi from "joi";

type Prop = 'params' | 'query' | 'body' | 'files'
type SchemaJoi = Joi.ArraySchema<any[]> | Joi.ObjectSchema<any>

function validatorHandler(schema: SchemaJoi, property: Prop) {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req[property];
      const { error }  = schema.validate(data, { abortEarly: false });
      if (error) return res.status(400).send({ error: JSON.stringify(error.details, null, 5) });
      next();
    }
}

export default validatorHandler