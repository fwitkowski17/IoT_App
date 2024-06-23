import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import {auth} from '../middlewares/auth.middleware';
import {admin} from '../middlewares/admin.middleware';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { request } from 'http';

class UserController implements Controller {
    public path = '/api/user';
    public router = Router();
    private userService = new UserService();
    private passwordService = new PasswordService();
    private tokenService = new TokenService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, auth, this.getUserDetails);
        this.router.put(`${this.path}/update`, auth, this.updatePassword)
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.delete(`${this.path}/logout/:userId`, auth, this.removeHashSession);
        this.router.delete(`${this.path}/delete`, auth, this.deleteUser);
    }

    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
        const {login, password} = request.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                response.status(401).json({error: 'Unauthorized'});
                return;
            }

            const checkMyPass = await this.passwordService.comparePassword(user._id, password);
            if (!checkMyPass) {
                response.status(401).json({error: 'Unauthorized'});
                return;
            }
            const token = await this.tokenService.create(user);
            response.status(200).json(this.tokenService.getToken(token));
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
    };

    private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
        const userData = request.body;
        try {
            const user = await this.userService.createNewOrUpdate(userData);
            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password)
                await this.passwordService.createOrUpdate({
                    userId: user._id,
                    password: hashedPassword
                });
            }
            response.status(200).json(user);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }
    };

    private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
        const {userId} = request.params;

        try {
            const result = await this.tokenService.remove(userId);
            response.status(200).json(result);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
    };

    private deleteUser = async (request: Request, response: Response, next: NextFunction) => {
        const token = request.headers['x-auth-token'] || request.headers['authorization'];
        if (token && typeof token === 'string') {
            try {
                const data = jwt.verify(token, config.JwtSecret) as {userId: string};
                const userId = data.userId;
                const result = await this.userService.removeUser(userId);
                if(result.deletedCount === 0) {
                    response.status(404).json({error: "User not found"})
                    return
                }
                response.status(200).json({message: 'User deleted successfully'})
            } catch(error) {
                console.error('Error deleting user:', error);
                response.status(500).json({ message: 'Internal Server Error' })
            }
        } else response.status(401).json({message: 'Access Denied. No token provided.'})
    }

    private getUserDetails = async (request: Request, response: Response, next: NextFunction) => {
        const token = request.headers['x-auth-token'] || request.headers['authorization'];
        if (token && typeof token === 'string') {
            try {
                const data = jwt.verify(token, config.JwtSecret) as {name: string};
                const userLogin = data.name;
                const result = await this.userService.getByEmailOrName(userLogin);
                response.status(200).json(result);
            } catch(error) {
                console.error('Error getting data:', error);
                response.status(500).json({ message: 'Internal Server Error' })
            }
        } else response.status(401).json({message: 'Access Denied. No token provided.'})
    }

    private updatePassword = async (request: Request, response: Response, next: NextFunction) => {
        const token = request.headers['x-auth-token'] || request.headers['authorization'];
        const body = request.body;
        if (token && typeof token === 'string') {
            try {
                const data = jwt.verify(token, config.JwtSecret) as {name: string};
                const userLogin = data.name;
                const result = await this.userService.getByEmailOrName(userLogin);

                const checkMyPass = await this.passwordService.comparePassword(result._id, body.password);
                if (!checkMyPass) {
                    response.status(401).json({error: 'Unauthorized'});
                    return;
                }
                const hashedPassword = await this.passwordService.hashPassword(body.newPassword)
                const dataToUpdate = { userId: result._id, password: hashedPassword }
                await this.passwordService.createOrUpdate(dataToUpdate)
                response.status(200).json({message: 'Password updated successfully!'});
            } catch(error) {
                console.error('Error getting data:', error);
                response.status(500).json({ message: 'Internal Server Error' })
            }
        } else response.status(401).json({message: 'Access Denied. No token provided.'})
    }
}

export default UserController;
