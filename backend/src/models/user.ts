import { model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Interfaz
export interface IUser extends Document {
    name: string,
    email: string,
    telephone: string,
    password: string,
    age: number,
    gender: string,
    hobby: string,
    checkPassword: (password: string) => Promise<boolean>
}

// Entidad
export default model<IUser>('User',
// Esquema
new Schema({
    name : {
        type     : String,
        required : true,
        trim     : true
    },
    email : {
        type      : String,
        required  : true,
        unique    : true,
        lowercase : true,
        trim      : true
    },
    telephone : {
        type     : String,
        required : true,
        trim     : true
    },
    password : {
        type     : String,
        required : true
    },
    age : {
        type     : Number,
        required : true
    },
    gender : {
        type     : String,
        required : true
    },
    hobby : {
        type     : String,
        required : true
    }
},
{
    timestamps : true
})
// HASH de contrasenia sobre el registro de informacion
.pre<IUser>('save', async function (next) {
    // Generacion de HASH mediante la cadena original de la contrasenia
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
    }

    // Continua el proceso
    next();
})
// Comprobacion de contrasenia correcta
.method('checkPassword', async function (password: string): Promise<boolean> {
    // Comparacion de contrasenia
    return await bcrypt.compare(password, this.get('password'));
}));