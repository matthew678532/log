const colors = {
  blue: '\033[34m',
  yellow: '\033[33m',
  red: '\033[31m',
  reset: '\033[0m'
};
const { blue, yellow, red, reset } = colors;

const levels = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error'
};
const { debug, info, warn, error } = levels;

let defaultConfig = {
  isProduction: false,    // Strip logs
  color: false,           // Adds color to log levels
  logLevel: 4,            // All levels, decrementing by 1 will first drop debug, then info, then warn, etc
  filters: [],            // Filter out logs by keywords
  enabled: true,          // Flag for enabling / disabling logs
  withCaller: false,      // Include caller in logging
  withTime: false,        // Include time in logging
  maxStored: -1           // Cap on how many logs are stored, returned via getLogs
};
let config = defaultConfig;
let logs = [];

const storeLog = log => {
  const { maxStored } = config;
  const hasMax = maxStored !== -1;

  if (hasMax && logs.length === maxStored) {
    logs.shift();
    logs.push(log);

    return;
  }

  logs.push(log);
};

const getCaller = () => {
  const stack = (new Error).stack;
  const caller = stack.split('\n')[4];
  const line = caller.substring(
    caller.lastIndexOf('/') + 1,
    caller.lastIndexOf(')')
  );

  return line;
};

const getLevelColor = (method) => {
  const { color } = config;

  if (!color) {
    return reset;
  }

  switch (method) {
    case info:
      return blue;
    case warn:
      return yellow;
    case error:
      return red;
    default:
      return reset;
  }
}

const acceptedLevel = (logLevel, method) => {
  let levels;

  switch (logLevel) {
    case 1:
      levels = [error];
      break;
    case 2:
      levels = [warn, error];
      break;
    case 3:
      levels = [info, warn, error];
      break;
    default:
      levels = [debug, info, warn, error];
      break;
  }

  return levels.includes(method);
};

const acceptedFilter = (filters, args) => {
  const hasFilters = filters?.length;
  return !hasFilters || filters.some(filter => args.some(arg => arg.includes(filter)));
};

const isValid = (method, args) => {
  const { logLevel, filters } = config;

  return acceptedLevel(logLevel, method) && acceptedFilter(filters, args);
};

const proxy = (method, args) => {
  const {
    enabled,
    isProduction,
    withCaller,
    withTime
  } = config;

  if (enabled && !isProduction && isValid(method, args)) {
    const finalArgs = [];
    finalArgs.push(getLevelColor(method));

    const isoString = new Date().toISOString();
    withTime && finalArgs.push(`[${isoString}]`);

    const caller = getCaller();
    withCaller && finalArgs.push(`[${caller}]`);

    finalArgs.push(...args);

    console[method](...finalArgs);
    storeLog({
      method,
      args,
      caller,
      timestamp: isoString
    });
  }
};

const log = {
  debug: (...args) => proxy(debug, args),
  info: (...args) => proxy(info, args),
  warn: (...args) => proxy(warn, args),
  error: (...args) => proxy(error, args),

  setConfig: localConfig => {
    config = {
      ...defaultConfig,
      ...localConfig
    };
  },
  getConfig: () => config,

  getLogs: () => logs,
  clearLogs: () => { 
    logs = [];
  },

  _colors: colors,
  _levels: levels,
  _defaultConfig: defaultConfig
};

module.exports = log;
