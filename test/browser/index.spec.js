describe('FileWorker', () => {

  it('should load FileWorker globally.', () => {
    expect(typeof FileWorker).toEqual('function');
  });

  describe('readFile', () => {
    it('should return a Promise.', () => {
      let response = FileWorker.readFile(null, function(){});
      expect(typeof response).toEqual('object');
      expect(response.constructor.name).toEqual('Promise');
    });
  });

  describe('Writer', () => {
    it('writes once should work.', (done) => {
      let string = 'abcdefg';
      let file = new Blob([string], {type: 'text/plain'});
      file.lastModifiedDate = new Date();
      file.name = 'dummy';


      function byteProcessor(reader, writer) {
        reader.onData = (data) => {
          writer.writeOnce(data.byteLength);
        };
        reader.readAll();
      }

      let response = FileWorker.readFile(file, byteProcessor);
      response.then((result) => {
        expect(result).toEqual(7);
        done();
      });

    });

    it('writes many times should work.', (done) => {
      let string = 'abcdefg';
      let file = new Blob([string], {type: 'text/plain'});
      file.lastModifiedDate = new Date();
      file.name = 'dummy';


      function byteProcessor(reader, writer) {
        reader.onData = (data) => {
          writer.write(data.byteLength);
          writer.write("hello world");
          writer.finish();
          writer.write("hello again.");
          writer.finish();
        };
        reader.readAll();
      }

      let response = FileWorker.readFile(file, byteProcessor);
      response.then((result) => {
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(7);
        expect(result[1]).toEqual("hello world");
        done();
      });

    });

  });



  describe('Reader', () => {
    it('read multiple times should work.', (done) => {
      let string = 'abcdefg';
      let file = new Blob([string], {type: 'text/plain'});
      file.lastModifiedDate = new Date();
      file.name = 'dummy';

      function byteProcessor(reader, writer) {
        reader.onData = (data) => {
          writer.write(data.byteLength);
          reader.read(2);
        };
        reader.onFinished = () => {
          writer.finish();
        };
        reader.read(2);
      }

      let response = FileWorker.readFile(file, byteProcessor);
      response.then((result) => {
        expect(result.length).toEqual(4);
        expect(result[0]).toEqual(2);
        expect(result[3]).toEqual(1);
        done();
      });

    });
  });

});
