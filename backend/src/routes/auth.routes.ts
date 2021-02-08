import { Router } from 'express';
import { autenticar } from '../controllers/auth.controller';

// Contenedor de configuracion de rutas
const router = Router();

// Rutas (Publicas)
router.post('/sign-in', autenticar);

// Configuracion obtenida
export default router;