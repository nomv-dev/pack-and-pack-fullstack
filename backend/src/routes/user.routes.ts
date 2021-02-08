import { register, search, erase, getMaleOver18LastThreeDays } from '../controllers/user.controller';
import { Router } from 'express';
import passport from 'passport';

// Contenedor de configuracion de rutas
const router = Router();

// Rutas (Publicas)
router.post('/register', register);

// IMPORTANTE Se asigna el middleware para verificar que se cuenta con un token valido
router.use(passport.authenticate('jwt', { session : false }));

// Rutas (Protegidas)
router.post('/search', search);
router.post('/delete', erase);
router.post('/male-over-18-last-three-days', getMaleOver18LastThreeDays);

// Configuracion obtenida
export default router;