# log

A lightweight log utility that can be used in nodejs projects for finer control over logging.

## Installation

Add this package as a dependency to your project via `npm i log`

## Usage

Simply put, this package abstracts console functionality to provide finer control over logs.

You can require the package via `const log = require('log');`.

### Configuration

At this point you'll likely want to configure the package depending on your projects preferences, here are the configuration options:

| Property | Default value  | Description  |
| ------- | --- | --- |
| isProduction | false | Strip logs |
| color | false | Add color: info (blue), warn (yellow), error (red) |
| logLevel | 4 | Reduce logs based on the level e.g. 3 = info, warn, error, 2 = warn, error, etc |
| filters | [] | Reduce logs based on filters e.g. ['debug'] would only show logs include the word 'debug' |
| enabled | true | Enable the package |
| withCaller | false | Adds additional information to each log, detailing where this was called from |
| withTime | false | Adds additional information to each log, detailing the date/time this was called |
| maxStored | -1 | Limits how many logs are stored in memory |

You can manipulate the configuration like so:

```
// This will use the default configuration, along with your passed values
log.setConfig({
  logLevel: 3,
  color: true
});

// This will return the active configuration
log.getConfig(); 

// You can set this as many times as you like
log.setConfig({ withCaller: true });
```

### Logging

From here you can log via the supported methods, these being:

```
log.debug('debug message');
log.info('info message');
log.warn('warn message');
log.error('error message');
```

### Stored logs

By default the package will capture all logs sent via the supported methods shown above, this will take the following shape:

```
[
  {
    method: 'debug',
    args: ['\033[0m', 'debug message'],
    caller: 'someFile.js:362:9',
    timestamp: '2011-10-05T14:48:00.000Z'
  },
  ...more logs
]
```

The idea behind this is that if you need to capture these logs for future reference (i.e. tracking) you can.

You can manipulate the stored logs like so:

```
// Fetches the stored logs at this point in time
log.getLogs();

// Removes the stored logs if no longer needed
log.clearLogs();
```

To limit the amount of logs the package stores, you can tweak the config like so: `log.setConfig({ maxStored: 50})`, this will follow FIFO principles, so that once we reach our max, we will remove the first stored log in favour of the latest.

If this feature isn't being used, it's recommended that `maxStored` is set to 0 to free up space in memory.

## Contributing

Contributions are welcome. For major changes please submit an issue request first so that we can discuss your ideas.

Otherwise, please follow these steps:

- Clone the repository
- Create your own branch off of main
- Make your changes, and ensure these are tested (ideally with coverage at 100%)
- Submit a PR for review

## License

MIT License

Copyright (c) 2021 Matthew Birch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

