import { Response } from 'express';

/**
 * Genera una respuesta rapida para un catch
 *
 * @param res
 * @param err
 */
export const quickCatch = (res: Response, err: any) => {
    console.error('ERROR (quickCatch):', err);

    return res.status(500).json({ message : 'Ocurrió un error al procesar su petición.' });
};