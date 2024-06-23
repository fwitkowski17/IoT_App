import {EntryModel} from "./entry.model.ts";

export interface DataModel {
    deviceId: number,
    latestEntries: EntryModel[]
}