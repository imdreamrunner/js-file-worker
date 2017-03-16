JavaScript File Worker
======================

*Process file asynchronously at Web Worker at browser.*

Web Worker is a browser technology that allow some JavaScript code
to be executed in the background, and very likely in another thread.

For example, if you want to 
[compute the MD5 hash for a file at browser](https://github.com/imdreamrunner/md5-webworker),
the computation could take seconds depends on the size of the file,
but you don't want the user interface to be frozen.

In this kind of situations, you can consider create a web worker for 
the job.

This package (`file-worker`) allows you to write file processing code
easily that will be run in the background.

## Usage

*Step 1: Import the file*

You can do it in HTML.

```html
<script src="../../dist/browser/FileWorker.js"></script>
```

Or using NPM if you use webpack or TypeScript.

```bash
npm install file-worker --save-dev
```

*Step 2: Write file processor*

Assuming you want to compute the MD5 of your file, you can write
a processor like this. However there is an existing library
[md5-webworker](https://github.com/imdreamrunner/md5-webworker)
that does exactly the same thing.

```javascript
function md5Processor(reader, writer) {
    reader.onData = function (bytes) {
        writer.write(computeMD5(bytes));
    };
    reader.readAll();
}
```

Writing a processor is very straight forward. It's a function
that takes 2 parameters, one reader and one writer.
However, please take now that this function is to be executed at 
the web worker, so you cannot access any variables or libraries
directly inside the function. What you can do is to use
the very handy `importScripts` function to load the script asynchronously.

*Step 3: Get processed content*

Assuming you get a File object from the browser's FileAPI. You can
pass it to file worker, together with a type processor.

```
FileWorker.readFile(file, byteProcessor)
.then(function(result) {
    console.log(result);
});
```

`FileWorker.readFile` is an `async` function. You can either use `.then`
and callback to get the result.
