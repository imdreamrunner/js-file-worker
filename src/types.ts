export interface FileWorkerOnDataHandler extends Function {
    (data: ArrayBuffer) : void;
}

export interface FileWorkerReader {
    read(length:number):void;
    readAll():void;
    onData: FileWorkerOnDataHandler;
    onFinished: Function;
}

export interface FileWorkerWriter {
    write(data:any):void;
    writeOnce(data:any):void;
    finish():void;
}

export interface FileWorkerProcessor extends Function {
    (reader: FileWorkerReader, writer: FileWorkerWriter) : void;
}

export interface FileWorkerConfig {

}
