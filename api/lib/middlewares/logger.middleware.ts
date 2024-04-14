import { Request, Response, NextFunction } from 'express';

export function apiLogger(request: Request, response: Response, next: NextFunction) {
    const formattedDate = '(' + '\x1b[33m' + new Date().toLocaleTimeString() + '\x1b[0m' + ')';
    if(response.statusCode == 200) {
        const success = '[' + '\x1b[32mSUKCES\x1b[0m' + ']';
        console.log(success + formattedDate + " Żądanie GET wykonano poprawnie: \x1b[34m%s\x1b[0m", request.path);
    } else {
        const error = '[' + '\x1b[31m%s\x1b[0mBŁĄD\x1b[0m' + ']'
        console.log(error + formattedDate + "Żądanie nie zostało wykonane! \x1b[34m%s\x1b[0m", request.path);
    }
    next();
}