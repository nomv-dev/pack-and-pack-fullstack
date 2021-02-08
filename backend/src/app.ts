import authRoutes from './routes/auth.routes';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import authMiddleware from './middlewares/auth.middleware';
import userRoutes from './routes/user.routes';

// Inicializacion
const app = express();

// Configuracion
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

passport.use(authMiddleware);

// Rutas
app.get('/', (req, res) => res.send(`BACKEND => http://localhost:${ app.get('port') }`));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Visibilidad de la configuracion de la aplicacion
export default app;