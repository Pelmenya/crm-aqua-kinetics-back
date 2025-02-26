import { User } from '../user/user.entity'; // Подкорректируйте путь до вашей сущности User

declare module 'express' {
    export interface Request {
        user?: User;
    }
}