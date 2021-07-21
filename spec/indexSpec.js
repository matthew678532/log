const log = require('../index.js');

const {
  _colors: {
    blue,
    yellow,
    red,
    reset
  },
  _levels: {
    debug,
    info,
    warn,
    error
  },
  _defaultConfig
} = log;

const testLog = 'a simple test log';

afterEach(() => {
  log.clearLogs();
});

it('Should log with the default configuration', () => {
  spyOn(console, 'debug');
  log.debug(testLog);

  expect(console.debug).toHaveBeenCalledWith(reset, testLog);
  expect(log.getLogs()).toHaveSize(1);
});

it('Should be able to set the logging configuration', () => {
  const ourConfig = {
    color: true,
    logLevel: 2
  };
  log.setConfig(ourConfig);

  expect(log.getConfig()).toEqual({
    ..._defaultConfig,
    ...ourConfig
  });
});

it('Should not log if the config is set to exclude', () => {
  const configurations = [
    { isProduction: true },
    { enabled: false },
    { logLevel: 3 },
    { filters: ['[abc]'] }
  ];

  spyOn(console, 'debug');

  for (let config of configurations) {
    log.setConfig(config);
    log.debug(testLog);

    expect(console.debug).not.toHaveBeenCalled();
    expect(log.getLogs()).toHaveSize(0);
  }
});

it('Should prefix the log with additional informaton if the config is set to include', () => {
  const configurations = [
    { withCaller: true },
    { withTime: true }
  ];

  spyOn(console, 'debug');

  for (let config of configurations) {
    log.setConfig(config);
    log.debug(testLog);

    expect(console.debug).toHaveBeenCalledWith(reset, jasmine.any(String), testLog);

    const logs = log.getLogs();
    expect(logs).toHaveSize(1);

    log.clearLogs();
  }
});

it('Should not increment logs stored passed the max', () => {
  const ourConfig = {
    maxStored: 2
  };
  log.setConfig(ourConfig);

  spyOn(console, 'debug');
  log.debug('sample_1');
  log.debug('sample_2');
  log.debug('sample_3');

  expect(console.debug).toHaveBeenCalledTimes(3);

  const logs = log.getLogs();
  expect(logs).toHaveSize(2);
  expect(logs[0].args).toContain('sample_2');
  expect(logs[1].args).toContain('sample_3');
});

it('Should log using colors', () => {
  const ourConfig = {
    color: true
  };
  log.setConfig(ourConfig);

  const methods = [debug, info, warn, error];
  const colors = [reset, blue, yellow, red];

  for (let i = 0; i < methods.length; i++) {
    const method = methods[i];
    const color = colors[i];

    spyOn(console, method);

    log[method](testLog);
    expect(console[method]).toHaveBeenCalledWith(color, testLog);
  }
});
