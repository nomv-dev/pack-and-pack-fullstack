import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import jwtConfig from '../config/jwt';
import User, { IUser } from '../models/user';

const options: StrategyOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey    : jwtConfig.secretOrPrivateKey
};

export default new Strategy(options, async (payload: any, done: VerifiedCallback) => {
    try {
        const user: IUser|null = await User.findById(payload.id);

        if (user) {
            return done(null, user);
        }

        return done(null, false);
    }
    catch (err) {
        console.error(err);
    }
});