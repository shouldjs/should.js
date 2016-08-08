
import config from './config';

export function format(value, opts) {
  return config.getFormatter(opts).format(value);
}

export function formatProp(value) {
  return config.getFormatter().formatPropertyName(String(value));
}
