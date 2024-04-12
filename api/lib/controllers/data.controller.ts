import { checkIdParam } from "../middlewares/deviceIdParam.middleware";
import Controller from "../interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from 'express';
import DataService from "../modules/services/data.service";

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    public dataService = new DataService;
 
    constructor() {
        this.initializeRoutes();
    }
 
    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getAll);
        this.router.get(`${this.path}/:id`,checkIdParam, this.getReading);
        this.router.get(`${this.path}/:id/latest`,checkIdParam, this.getLatestReadings);
        this.router.get(`${this.path}/:id/:num`, checkIdParam,  this.getReadingRange);
        this.router.post(`${this.path}/:id`,checkIdParam, this.addData);
        this.router.delete(`${this.path}/all`, this.cleanArray);
        this.router.delete(`${this.path}/:id`, checkIdParam, this.cleanSelected);
    }
    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json();
    }
    private getLatestReadings = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);
        response.status(200).json(allData);
     };
     
    private getReading = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        response.status(200).json();
    }
    private getReadingRange = async (request: Request, response: Response, next: NextFunction) => {
        const { id, num } = request.params;

        response.status(200).json();
    }
    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;
     
        const data = {
            temperature: air[0].value,
            pressure: air[1].value,
            humidity: air[2].value,
            deviceId: Number(id),
        }
       
        try {
            await this.dataService.createData(data);
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
     };
     
    private cleanArray = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json();
    };
    private cleanSelected = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        response.status(200).json();
    };
 }
 
 export default DataController;
 