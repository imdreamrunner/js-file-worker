import {FileWorkerProcessor, FileWorkerConfig} from "./types";
import * as WebWorkerHelper from "./WebWorkerHelper";

export class FileWorker {
    static async readFile(file : File, processor : FileWorkerProcessor) : Promise<any> {
        console.log(file);
        const result : Promise<any> = new Promise<any>((resolve, reject) => {
            const worker : Worker = WebWorkerHelper.createWebWorker(processor);
            worker.postMessage(file);
            worker.onmessage = function (e : MessageEvent) {
                resolve(e.data);
            }
        });
        return result;
    }
}
