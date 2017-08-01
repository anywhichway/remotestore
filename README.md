# remotestore
RESTful wrapper for remote servers exposing the Web Storage API

# Usage

`npm install remotestore`

If you do not already have a RESTful server supporting the Web Storage API, i.e. `DELETE`, `GET`, `PUT`, and `POST` for `count`, `key` method calls then install `storageserver` with `npm install storageserver`.

If you use `storageserver` it can download `remotestore.js` to you, so your base html file will look something like this:

```
&lt;html&gt;
&lt;head&gt;
&lt;script src="http://localhost:3000/remotestore.js"&gt;&lt;/script&gt;
&lt;/head&gt;

&lt;script&gt;
const store = new RemoteStore("http://localhost:3000");

... your code ...
&lt;/script&gt;
&lt;/html&gt;
```

# API

`RemoteStore` supports the same API and Web Storage except that all methods return a Promise and the `length` property is not available, `count()` must be used instead.


# Release History (reverse chronological order)

v0.0.6 2017-08-01 ALPHA Removed dummy calls that are not part of Web Storage API, e.g. `open` and `close`.

v0.0.5 2017-07-30 ALPHA Fixed issue where `getItem` did not work if caching was off.

v0.0.4 2017-07-30 ALPHA Added error handling for fetch

v0.0.3 2017-07-30 ALPHA Adjusted caching so it could be turned off and on dynamically

v0.0.2 2017-07-30 ALPHA All functions basically working

v0.0.1 2017-07-29 ALPHA First public release