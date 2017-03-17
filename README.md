JavaScript File Worker
======================

![JavaScript File Worker](misc/banner.png)

***Process files asynchronously by Web Worker in browsers.***

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

[![Build Status](https://travis-ci.org/imdreamrunner/js-file-worker.svg?branch=master)](https://travis-ci.org/imdreamrunner/js-file-worker)

## Usage

**Step 1: Import the file**

You can [download the latest release](https://github.com/imdreamrunner/js-file-worker/releases)
for browser and import it in HTML.

```html
<script src="FileWorker.js"></script>
```

Or using NPM if you use webpack or TypeScript. This package
is available on NPM called [file-worker](https://www.npmjs.com/package/file-worker)
as well.

```bash
npm install file-worker --save-dev
```

To use this package in JavaScript, you can require it

```javascript
var FileWorker = require("file-worker");
```

or import it.

```javascript
import FileWorker from "file-worker";
```

Because this library is written in TypeScript, if you are using
an editor like WebStorm, you shall be able to get the handy
auto-completion.

**Step 2: Write file processor**

Assuming you want to compute the MD5 of your file, you can write
a processor like this. However there is an existing library
[md5-webworker](https://github.com/imdreamrunner/md5-webworker)
that does exactly the same thing.

```javascript
function md5Processor(reader, writer) {
    reader.onData = function (bytes) {
        writer.writeOnce(computeMD5(bytes));
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

**Step 3: Get processed content**

Assuming you get a File object from the browser's FileAPI. You can
pass it to file worker, together with a type processor.

`FileWorker.readFile` is an `async` function, i.e. it is non-blocking and
will return a promise. You can either use `.then` and callback to get the result.

If you use it in browser or prefer traditional `.then`:

```javascript
FileWorker.readFile(file, md5Processor)
.then(function(result) {
    console.log(result);
});
```

Or call it with await.

```javascript
const getMD5(file) = async () => { await FileWorker.readFile(file, md5Processor); }
```

## License

**ISC License**
    
    Copyright (c) 2017, FileWorker Authors
    
    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.
    
    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
    OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
