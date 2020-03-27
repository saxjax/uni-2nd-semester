/* Pads a string to a certain length
 * Param paddingLength can both be positive or negative
 * - if length is positive adjust left
 * - if length is negative adjust right
 * Returns the padded string
 */
function pad(str, newStrLen, padChar) {
  let newStr = ``;
  const paddingLength = Math.abs(newStrLen) - str.length;
  // Error checking
  if (paddingLength <= 0 || newStrLen === 0) {
    newStr = str;
  }
  // This means that there's padding which has to be applied
  else {
    const padding = Array(paddingLength + 1).join(padChar);
    if (newStrLen > 0) {
      newStr = str + padding;
    }
    else {
      newStr = padding + str;
    }
  }
  return newStr;
}

module.exports = pad;
