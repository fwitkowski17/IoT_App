import DataModel from '../schemas/data.schema';
import {IData, Query} from "../models/data.model";

export default class DataService {

    public async createData(dataParams: IData) {
        try {
            const dataModel = new DataModel(dataParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(deviceID: string) {
        try {
            const data = await DataModel.find({deviceId: deviceID}, { __v: 0, _id: 0 });
            return data;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }


    public async get(deviceId: string, limit: number = 1) {
        try {
            const data = await DataModel.find({deviceId: deviceId}, { __v: 0, _id: 0 }).limit(limit).sort({$natural:-1})
            return data.reverse();
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getAllNewest() {
        const latestData:any = [];

        await Promise.all(
            Array.from({ length: 17 }, async (_, i) => {
                try {
                    const latestEntries = await DataModel.find({ deviceId: i  }, { __v: 0, _id: 0 }).limit(2).sort({$natural:-1});
                    if (latestEntries.length) {

                        latestData.push({deviceId: i, latestEntries: latestEntries});
                    } else {
                        latestData.push({deviceId: i, latestEntries: Array.of()});
                    }
                } catch (error) {
                    console.error(`Błąd podczas pobierania danych dla urządzenia ${i + 1}: ${error.message}`);
                    latestData.push({});
                }
            })
        );

        return latestData.sort((a: IData, b:IData) => a.deviceId - b.deviceId);
    }

    public async getHourReadings() {
        const cutoffDate = new Date(Date.now() - 3600000);
        return (await DataModel.find({ readingDate: {$gte: cutoffDate}}, { __v: 0, _id: 0 }).sort({$natural:-1})).reverse();
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await DataModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async deleteDataByTime({ deviceId, valueNum }: { deviceId: string, valueNum: number }) {
        try {
            let cutoffDate: Date | null = null;
    
            switch (valueNum) {
                case 10:
                    cutoffDate = new Date(Date.now() - 3600000); // ostatnia godzina
                    break;
                case 20:
                    cutoffDate = new Date(Date.now() - 86400000); // ostatni dzień
                    break;
                case 30:
                    cutoffDate = new Date(Date.now() - 604800000); // ostatni tydzień
                    break;
                default:
                    throw new Error('Niepoprawna wartość parametru time');
            }
    
            await DataModel.deleteMany({
                deviceId: deviceId,
                readingDate: { $gte: cutoffDate }
            });
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }
}
