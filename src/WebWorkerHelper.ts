import {FileWorkerWriter, FileWorkerProcessor, FileWorkerReader, FileWorkerOnDataHandler} from "./types";

declare const self : MessagePort;
declare const __PROCESSOR__ : any;
declare const FileReaderSync : any;

function workerScript() {
    const processor : FileWorkerProcessor = __PROCESSOR__;

    class FileWorkerReaderImplement implements FileWorkerReader {
        onData: FileWorkerOnDataHandler;
        private file : File;

        constructor(file: File) {
            this.file = file;
        }

        readAll() {
            const fileReader = new FileReaderSync();
            const arrayBuffer = fileReader.readAsArrayBuffer(this.file);
            this.onData(arrayBuffer);
        }
    }

    self.addEventListener('message', (e : MessageEvent) => {
        const file: File = <File>e.data;
        const reader : FileWorkerReader = <FileWorkerReader>new FileWorkerReaderImplement(file);
        const writer : FileWorkerWriter = <FileWorkerWriter>{
            write: (data: any) => {
                self.postMessage(data);
            }
        };
        try {
            processor(reader, writer);
        } catch (e) {
            self.postMessage(e);
        }
    });
}

export function createWebWorker(processor: Function) : Worker {
    var workerFunctionString: string = workerScript.toString();
    workerFunctionString = workerFunctionString.replace('__PROCESSOR__', processor.toString());
    const blobURL = URL.createObjectURL(new Blob([`(${workerFunctionString})()`], {type: 'application/javascript'}));
    const worker = new Worker(blobURL);
    URL.revokeObjectURL(blobURL);
    return worker;
}
