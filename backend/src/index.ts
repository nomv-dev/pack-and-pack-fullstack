import './database';
import app from './app';

// Se habilita un listener por el puerto configurado
app.listen(app.get('port'));

console.log('Backend (Port)', app.get('port'));