import Controller from "../interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from 'express';

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
 
    constructor() {
        this.initializeRoutes();
    }
 
    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getReading);
        this.router.get(`${this.path}/:id/latest`, this.getLatestReadings);
        this.router.get(`${this.path}/:id/:num`, this.getReadingRange);
        this.router.post(`${this.path}/:id`, this.addData);
        this.router.delete(`${this.path}/all`, this.cleanArray);
        this.router.delete(`${this.path}/:id`, this.cleanSelected);
    }
    private getLatestReadings = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        // takie rozwiązanie z powodu niedziałającej funkcji Math.max()
        let max = testArr[0];
        for(var i=1; i< testArr.length; i++) {
            if(max < testArr[i]) max = testArr[i];
        }
        response.status(200).json(max);
     };
     private getReading = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        response.status(200).json(testArr[Number(id)]);
     }
     private getReadingRange = async (request: Request, response: Response, next: NextFunction) => {
        const { id, num } = request.params;
        response.status(200).json(testArr.length);
     }
     private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { elem } = request.body;
        const { id } = request.params;
        const data = [3,4]
        data.push(elem);
        response.status(200).json(data);
     };
     private cleanArray = async (request: Request, response: Response, next: NextFunction) => {
        testArr = [];
        response.status(200).json(testArr);
     };
     private cleanSelected = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        testArr[Number(id)] = 0;
        response.status(200).json(testArr[Number(id)]);
     };
 }
 
 export default DataController;
 