import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import { request } from 'http';
import path from 'path';
import Health from 'interfaces/health.interface';

const getUptime = require("../uptime").getUptime

class IndexController implements Controller {
    public path = '/*';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/api/health`, this.sendHealthStatus);
        this.router.get(this.path, this.serveIndex);
    }

    private serveIndex = async (request: Request, response: Response) => {
        response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }

    private sendHealthStatus = async (request: Request, response: Response) => {
        let body: Health
        const uptime = getUptime()
        switch(process.env.AVAILABILITY) {
            case "online":
                body = {status: "OK", uptime: uptime };
                response.status(200).send(body);
                break;
            case "maintenance":
                body = {status: "Server is currently in maintenance mode.", errorDesc: "Come back later when we done all maintenance tasks. Scheduled time of getting back of service: 17:15", uptime: uptime };
                response.status(503).send(body);
                break;
            case "error":
                body = {status: "Server error", errorDesc: "An error has occurred. For now data will not be parsed.", uptime: uptime };
                response.status(500).send(body);
                break;
            default:
                body = {status: "Unknown", errorDesc: "Server is in unknown state", uptime: uptime };
                response.status(500).send(body)
        }
    }
}

export default IndexController;
