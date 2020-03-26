/* Pads a string to a certain length
 * Param paddingLength can both be positive or negative
 * - if length is positive adjust left
 * - if length is negative adjust right
 * Returns the padded string
 */
function pad(str, paddingLength) {
  const length = Math.abs(paddingLength) - str.length;
  if(length < 0) {
    return str;
  }
  const padding = Array(length).join(` `);
  if(paddingLength > 0) {
    return `${str}${padding}`;
  }
  else if(paddingLength < 0) {
    return `${padding}${str}`;
  }
  else {
    return str;
  }
}

module.exports = pad;