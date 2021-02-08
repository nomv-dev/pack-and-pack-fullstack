import { IArrayStringRegExp } from "../utils/simple.interfaces";
import User, { IUser } from "../models/user";

// Registro de usuario
export const create = async (item: IUser | object): Promise<IUser> => {
    const newUser: IUser = new User(item instanceof User ? item : new User(item));

    return await newUser.save();
};

// Eliminacion del usuario por ID
export const findByIdAndDelete = async (id: String): Promise<IUser | null> => await User.findByIdAndDelete(id);

// Consulta del primer registro por email
export const findOneByEmail = async (email: string): Promise<IUser | null> => User.findOne({ email });

// Consulta de registros por nombre y/o pasatiempo
export const findByNameAndHobby = async (reqBody: any): Promise<IUser[]> => {
    // Mapeado de filtros
    const data: IArrayStringRegExp = {};

    [ 'name', 'hobby' ].forEach(input => {
        if (reqBody[input]) {
            data[input] = new RegExp((reqBody[input] || '').toString(), 'i');
        }
    });

    // Consulta mediante filtros (Si estos existen)
    return await User.find(data).select('id name telephone age gender hobby createdAt').sort({ name : 'asc' });
};

// Consulta especifica de masculinos mayores a 18 anios en los ultimos 3 dias
export const findMaleOver18LastThreeDays = async (): Promise<IUser[]> => {
    // Definicion de rango de fechas
    const end: Date = new Date();

    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    const start: Date = new Date(end);

    start.setDate(start.getDate() - 3);

    // Consulta mediante filtros
    return await User.find({
            age : { $gt : 18 },
            gender : 'M',
            createdAt : { $gte : start.toJSON().slice(0, 10), $lte : end.toJSON().slice(0, 10) } }
        )
        .select('id name telephone hobby')
        .sort({ hobby : 'asc', name : 'asc' });
};