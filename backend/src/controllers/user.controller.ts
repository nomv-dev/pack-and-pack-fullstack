import { create, findByIdAndDelete, findByNameAndHobby, findMaleOver18LastThreeDays, findOneByEmail } from '../repositories/user.repository';
import { IArrayStringString, IArrayStringType } from '../utils/simple.interfaces';
import { quickCatch } from '../utils/http';
import { Request, Response } from 'express';
import Validation from '../utils/validation';
import validator from 'validator';
import { IUser } from '../models/user';

/**
 * Metodo de registro de usuario
 *
 * @param req
 * @param res
 */
export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Informacion obtenida
        const inputs: string[]         = [ 'name', 'email', 'telephone', 'password', 'age', 'gender', 'hobby' ];
        const data: IArrayStringString = {};

        inputs.forEach(input => data[input] = (req.body[input] || '').toString());

        //Validacion de datos
        const validation = new Validation();

        // Obligatorios
        validation.requiredData(data, inputs);

        // Particulares
        if (await findOneByEmail(data.email)) {
            validation.setError('email', 'El correo electrónico ha sido registrado anteriormente.');
        }

        if (!validation.getError('name') && !validator.isLength(data.name, { min : 10, max : 150 })) {
            validation.setError('name', 'El nombre debe contener mínimo 10 caracteres.');
        }

        if (!validation.getError('email') && !validator.isEmail(data.email)) {
            validation.setError('email', 'El correo electrónico no es valido.');
        }

        if (!validation.getError('telephone') && (!validator.isMobilePhone(data.telephone) || !validator.isLength(data.telephone, { min : 10, max : 15 }))) {
            validation.setError('telephone', 'El telefono no es valido.');
        }

        if (!validation.getError('password') && !validator.isStrongPassword(data.password)) {
            validation.setError('password', 'La contraseña debe contener mínimo 8 caracteres '
                + '(Al menos un carácter en mayúsculas, un carácter en minúscula, un número y un caracteres especial).');
        }

        if (!validation.getError('age') && !validator.isInt(data.age, { gt : 0 })) {
            validation.setError('age', 'El usuario debe haber nacido para registrarse.');
        }

        if (!validation.getError('gender') && !validator.isIn(data.gender, ['M', 'F'])) {
            validation.setError('gender', 'El genero no es valido (M ó F).');
        }

        if (!validation.getError('hobby') && !validator.isLength(data.hobby, { min : 4, max : 350 })) {
            validation.setError('hobby', 'El pasatiempo debe contener mínimo 4 caracteres.');
        }

        // Respuesta con errores de validacion
        if (validation.existsErrors()) {
            return validation.genericValidationResponse(res);
        }

        // Alta del usuario
        return await create(data)
            .then(user => res.status(201).json({ message : 'Usuario creado exitosamente.', data : user }))
            .catch(err => quickCatch(res, err));
    }
    catch (err) {
        return quickCatch(res, err);
    }
};

/**
 * Consulta por filtrado
 *
 * @param req
 * @param res
 */
export const search = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Consulta por filtrado
        return await findByNameAndHobby(req.body)
            .then(users => res.status(200).json({ message : 'Consulta exitosa.', data : users }))
            .catch(err => quickCatch(res, err));
    }
    catch (err) {
        return quickCatch(res, err);
    }
};

/**
 * Eliminacion de usuario
 *
 * @param req
 * @param res
 */
export const erase = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = (req.body.id || '').toString().trim();

        //Validacion de datos
        const validation = new Validation();

        // Obligatorios
        validation.requiredData({ id  }, [ 'id' ]);

        // Particulares
        const userSession: any = req.user;

        if (userSession.id === id) {
            return res.status(400).json({ message : 'El usuario autenticado no puede borrar su propio registro.' });
        }

        if (!validation.getError('id') && !validator.isByteLength(id, { min: 12 })) {
            validation.setError('id', 'El ID no es valido.');
        } else {
            // Consulta y eliminacion de usuario
            await findByIdAndDelete(id)
                .then(user => {
                    if (!user) {
                        validation.setError('id', 'No fue posible localizar el registro del usuario.');
                    }
                })
                .catch(err => { throw new Error(err); });
        }

        // Respuesta con errores de validacion
        if (validation.existsErrors()) {
            return res.status(400).json({ message : 'No fue posible localizar el registro del usuario.' });
        }

        // Respuesta de exito
        return res.status(200).json({ message : 'Usuario borrado exitosamente.' });
    }
    catch (err) {
        return quickCatch(res, err);
    }
};

/**
 * Consulta especifica para obtener masculinos mayores a 18 anios en los ultimos tres dias.
 *
 * @param req
 * @param res
 */
export const getMaleOver18LastThreeDays = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Consulta especifica
        return await findMaleOver18LastThreeDays()
            .then(users => {
                const data: IArrayStringType<IUser[]> = {};

                // Agrupacion por pasatiempo
                users.map(user => {
                    if (!(user.hobby in data)) data[user.hobby] = [];

                    data[user.hobby].push(user);
                });

                return res.status(200).json({ message : 'Consulta exitosa.', data });
            })
            .catch(err => quickCatch(res, err));
    }
    catch (err) {
        return quickCatch(res, err);
    }
};