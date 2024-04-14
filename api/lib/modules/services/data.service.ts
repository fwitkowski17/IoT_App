import DataModel from "../schemas/data.schema";
import { IData, Query } from "../models/data.model";
import { config } from "../../config";

export default class DataService {
  public async createData(dataParams: IData) {
    try {
      const dataModel = new DataModel(dataParams);
      await dataModel.save();
    } catch (error) {
      console.error("Wystąpił błąd podczas tworzenia danych:", error);
      throw new Error("Wystąpił błąd podczas tworzenia danych");
    }
  }

  public async query(deviceID: string) {
    try {
      const data = await DataModel.find(
        { deviceId: deviceID },
        { __v: 0, _id: 0 }
      );
      return data;
    } catch (error) {
      throw new Error(`Query failed: ${error}`);
    }
  }

  public async get(deviceId: string) {
    try {
      const data = await DataModel.find(
        { deviceId: deviceId },
        { __v: 0, _id: 0 }
      )
        .limit(1)
        .sort({ $natural: -1 });
      return data;
    } catch (error) {
      throw new Error(`Query failed: ${error}`);
    }
  }

  public async getNewest(
    startId: any = 1,
    range: any = config.supportedDevicesNum
  ) {
    const latestData: Array<any> = [];
    const indexes = Array.from(
      { length: range },
      (_, i) => i + parseInt(startId)
    );
    await Promise.all(
      indexes.map(async (deviceId) => {
        try {
          const latestEntry = await DataModel.find(
            { deviceId },
            { __v: 0, _id: 0 }
          )
            .limit(1)
            .sort({ $natural: -1 });
          if (latestEntry.length) latestData.push(latestEntry[0]);
          else latestData.push({ deviceId: deviceId });
        } catch (error: any) {
          console.error(
            `Błąd podczas pobierania danych dla urządzenia ${deviceId}: ${error.message}`
          );
          latestData.push({});
        }
      })
    );
    return latestData.sort(
      (a, b) => parseInt(a.deviceId) - parseInt(b.deviceId)
    );
  }

  public async deleteData(id: any = {}): Promise<void> {
    try {
      await DataModel.deleteMany({ deviceId: id });
    } catch (error) {
      throw new Error(`Query failed: ${error}`);
    }
  }
}