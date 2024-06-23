import {EntryModel} from "../models/entry.model.ts";

export function sortElemsByDeviceId(data: EntryModel[]) {
    return data.sort((a, b) => {
        return a.deviceId - b.deviceId;
    });
}
