import { IArrayStringString, IArrayStringAny } from './simple.interfaces';
import { Response } from 'express';
import validator from 'validator';

export default class Validation {
    private errors: IArrayStringString  = {};

    public getErrors(): IArrayStringString {
        return this.errors;
    }

    public getError(key: string): string|null {
        return this.errors[key.trim()] || null;
    }

    public setError(key: string, message: string) {
        this.errors[key.trim()] = message.trim();
    }

    public existsErrors(): boolean {
        return Object.keys(this.errors).length > 0;
    }

    public requiredData(data: IArrayStringAny, requiredList: string[]): void {
        requiredList.forEach(key => {
            if (validator.isEmpty(data[key])) {
                this.errors[key] = `El campo es obligatorio.`;
            }
        });
    }

    public genericValidationResponse(res: Response): Response {
        return res.status(400).json({ message : 'Favor de revisar la información ingresada.', errors : this.errors });
    }
}