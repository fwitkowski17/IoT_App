import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { IUser } from "../modules/models/user.model";

const jwt = require("jsonwebtoken");

export const auth = (request: Request, response: Response, next: NextFunction) => {
    let token = request.headers['x-access-token'] || request.headers['authorization'];
    var jwt = require('jsonwebtoken');
   if (token && typeof token === 'string') {
       if (token.startsWith('Bearer ')) {
           token = token.slice(7, token.length);
       }
       try {
           jwt.verify(token, config.JwtSecret, (err: any, decoded: any) => {
               if (err) {
                   return response.status(400).send('Invalid token.');
               }
               const user: IUser = decoded as IUser;
               next();
               return;
           });
       } catch (ex) {
           return response.status(400).send('Invalid token.');
       }
    } else {
        return response.status(401).send('Access denied. No token provided.');
    }
 };
 