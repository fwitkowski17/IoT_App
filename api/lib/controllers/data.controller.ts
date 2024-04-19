import { checkIdParam } from "../middlewares/deviceIdParam.middleware";
import Controller from "../interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from 'express';
import DataService from "../modules/services/data.service";
import Joi from "joi";
import { IData } from "../modules/models/data.model";

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    public dataService = new DataService;
 
    constructor() {
        this.initializeRoutes();
    }
 
    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getAll);
        this.router.get(`${this.path}/:id`,checkIdParam, this.getAllDeviceData);
        this.router.get(`${this.path}/:id/latest`,checkIdParam, this.getLatestReadings);
        this.router.get(`${this.path}/:id/:num`, checkIdParam,  this.getReadingRange);
        this.router.post(`${this.path}/:id`,checkIdParam, this.addData);
        this.router.delete(`${this.path}/all`, this.deleteAll);
        this.router.delete(`${this.path}/:id`, checkIdParam, this.cleanSelected);
    }

    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        const allData = await this.dataService.getNewest();
        response.status(200).json(allData);
    }

    private getLatestReadings = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.get(id);
        response.status(200).json(allData);
    }
     
    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const data = await this.dataService.query(id);
        response.status(200).json(data);
    }

    private getReadingRange = async (request: Request, response: Response, next: NextFunction) => {
        const { id, num } = request.params;
        const data = await this.dataService.getNewest(id,num);
        response.status(200).json(data);
    }
    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;

        const schema = Joi.object({
            air: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number().integer().positive().required(),
                        value: Joi.number().positive().required()
                    })
                )
                .unique((a, b) => a.id === b.id),
            deviceId: Joi.number().integer().positive().valid(parseInt(id, 10)).required()
         });
       
        try {
            const validatedData = await schema.validateAsync({air, deviceId: parseInt(id, 10)});
            const readingData: IData = {
                temperature: validatedData.air[0].value,
                pressure: validatedData.air[1].value,
                humidity: validatedData.air[2].value,
                deviceId: validatedData.deviceId,
            }
            await this.dataService.createData(readingData);
            response.status(200).json(readingData);
        } catch (error: any) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    }
     
    private deleteAll = async (request: Request, response: Response, next: NextFunction) => {
        await this.dataService.deleteData();
        response.status(200).json();
    }

    private cleanSelected = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        await this.dataService.deleteData(id);
        response.status(200).json();
    }
}
 
 export default DataController;
 