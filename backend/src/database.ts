import mongoose from 'mongoose';
import dbConfig from './config/database'

// Conexion mediante archivo de configuracion
mongoose.connect(`mongodb://${ dbConfig.host}:${ dbConfig.port }`, {
    dbName             : dbConfig.database,
    user               : dbConfig.username,
    pass               : dbConfig.password,
    useUnifiedTopology : true,
    useNewUrlParser    : true,
    useCreateIndex     : true
});

// Conexion activa
const conn = mongoose.connection;

// Al iniciar la conexion
conn.once('open', () => console.log(`Conectado a MongoDB ${ dbConfig.host }`));

// En caso de error al establecer conexion
conn.on('error', err => {
    console.log(err);
    process.exit(0);
});