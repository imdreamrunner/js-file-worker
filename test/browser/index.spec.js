describe('FileWorker', () => {

  it('should load FileWorker globally.', () => {
    expect(typeof FileWorker).toEqual('function');
  });

  describe('readFile', () => {
    it('should return a Promise.', () => {
      var response = FileWorker.readFile();
      expect(typeof response).toEqual('object');
      expect(response.constructor.name).toEqual('Promise');
    });
  });

});
