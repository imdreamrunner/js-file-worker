import {FileWorkerWriter, FileWorkerProcessor, FileWorkerReader, FileWorkerOnDataHandler} from "./types";

declare const self : MessagePort;
declare const __PROCESSOR__ : any;
declare const FileReaderSync : any;
declare const window : any;
declare const BlobBuilder : any;

function workerScript() {
    const processor : FileWorkerProcessor = __PROCESSOR__;

    class FileWorkerReaderImplement implements FileWorkerReader {
        onFinished: Function;
        onData: FileWorkerOnDataHandler;
        private file : File;

        private currentReader : number;

        constructor(file: File) {
            this.file = file;
            this.currentReader = 0;
        }

        read(length:number) {
            const maxLength = Math.min(this.file.size, this.currentReader + length);
            if (this.currentReader == this.file.size) {
                this.onFinished();
            } else {
                const blob = this.file.slice(this.currentReader, maxLength);
                this.currentReader = maxLength;
                const fileReader = new FileReaderSync();
                const arrayBuffer = fileReader.readAsArrayBuffer(blob);
                this.onData(arrayBuffer);
                if (this.currentReader == this.file.size) {
                    this.onFinished();
                }
            }
        }

        readAll() {
            const fileReader = new FileReaderSync();
            const arrayBuffer = fileReader.readAsArrayBuffer(this.file);
            this.onData(arrayBuffer);
            this.onFinished();
        }
    }

    self.addEventListener('message', (e : MessageEvent) => {
        const file: File = <File>e.data;
        const writerBuffer : any[] = [];
        const reader : FileWorkerReader = <FileWorkerReader>new FileWorkerReaderImplement(file);
        const writer : FileWorkerWriter = <FileWorkerWriter>{
            write: (data: any) => {
                writerBuffer.push(data);
            },
            writeOnce: (data: any) => {
                self.postMessage(data);
            },
            finish: () => {
                self.postMessage(writerBuffer);
            }
        };
        try {
            processor(reader, writer);
        } catch (e) {
            self.postMessage({error: e.toString()});
        }
    });
}

export function createWebWorker(processor: Function) : Worker {
    let workerFunctionString: string = workerScript.toString();
    workerFunctionString = workerFunctionString.replace('__PROCESSOR__', processor.toString());
    workerFunctionString = `(${workerFunctionString})()`;
    // http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
    let blob;
    try {
        blob = new Blob([workerFunctionString], {type: 'application/javascript'});
    } catch (e) {
        // Backwards-compatibility
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
        blob = new BlobBuilder();
        blob.append(workerFunctionString);
        blob = blob.getBlob();
    }
    window.URL = window.URL || window.webkitURL;  // Backwards-compatibility

    const blobURL = URL.createObjectURL(blob);
    const worker = new Worker(blobURL);
    // Do not revoke object URL. otherwise IE and edge doesn't work.
    // URL.revokeObjectURL(blobURL);
    return worker;
}
