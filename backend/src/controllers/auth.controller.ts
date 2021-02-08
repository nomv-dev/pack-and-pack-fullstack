import { findOneByEmail } from '../repositories/user.repository';
import { IArrayStringString } from '../utils/simple.interfaces';
import { IUser } from '../models/user';
import { quickCatch } from '../utils/http';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt';
import Validation from '../utils/validation';
import validator from 'validator';

/**
 * Metodo de login del usuario
 *
 * @param req
 * @param res
 */
export const autenticar = async (req: Request, res: Response) => {
    try {
        let user: IUser|null = null;

        // Informacion obtenida
        const data: IArrayStringString = {
            email    : req.body.email || '',
            password : req.body.password || ''
        };

        //Validacion de datos
        const validation = new Validation();

        // Obligatorios
        validation.requiredData(data, [ 'email', 'password' ]);

        // Particulares
        if (!validation.getError('email')) {
            if (!validator.isEmail(data.email)) {
                validation.setError('email', 'El correo electrónico no es valido.');
            } else {
                user = await findOneByEmail(data.email)
                    .then(user => {
                        if (!user) validation.setError('email', 'El usuario no se encuentra registrado.');

                        return user;
                    });
            }
        }

        // Respuesta con errores de validacion
        if (validation.existsErrors()) {
            return validation.genericValidationResponse(res);
        }

        // En caso de que los datos sean correctos se comparan las credenciales del usuario
        if (await user?.checkPassword(data.password)) {
            // Generacion de respuesta exitosa incluyendo datos de usuario el token de acceso
            return res.status(201).json({
                message : 'Autenticación exitosa.',
                data    : {
                    // Datos del usuario (expuestos)
                    user  : {
                        name  : user?.name,
                        email : user?.email
                    },
                    // Token de autenticacion
                    token : jwt.sign(
                        {
                            id    : user?.id,
                            name  : user?.name,
                            email : user?.email
                        },
                        jwtConfig.secretOrPrivateKey,
                        {
                            expiresIn : jwtConfig.expiresIn
                        }
                    )
                }
            });
        }

        // Si las credenciales no son validas
        return res.status(406).json({ message : 'El correo electrónico y/o la contraseña son incorrectos.' });
    }
    catch (err) {
        return quickCatch(res, err);
    }
};