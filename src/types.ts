export interface FileWorkerOnDataHandler extends Function {
    (data: ArrayBuffer) : void;
}

export interface FileWorkerReader {
    readAll():void;
    onData: FileWorkerOnDataHandler;
}

export interface FileWorkerWriter {
    write(data:any):void;
}

export interface FileWorkerProcessor extends Function {
    (reader: FileWorkerReader, writer: FileWorkerWriter) : void;
}

export interface FileWorkerConfig {

}
