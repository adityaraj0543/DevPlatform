const c = (col, s) => `\x1b[${col}m${s}\x1b[0m`;
const stamp = () => new Date().toISOString();
module.exports = {
  info: (...a) => console.log(c(36, `[INFO ${stamp()}]`), ...a),
  warn: (...a) => console.warn(c(33, `[WARN ${stamp()}]`), ...a),
  error: (...a) => console.error(c(31, `[ERR  ${stamp()}]`), ...a),
};
