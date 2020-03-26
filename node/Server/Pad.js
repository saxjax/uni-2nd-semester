/* Pads a string to a certain length
 * Param paddingLength can both be positive or negative
 * - if length is positive adjust left
 * - if length is negative adjust right
 * Returns the padded string
 */
function pad(str, newStrLen, padChar) {
  let newStr = ``;
  const paddingLength = Math.abs(newStrLen) - str.length;
  if (paddingLength <= 0) {
    newStr = str;
  }
  else {
    const padding = Array(paddingLength + 1).join(padChar);
    if (newStrLen > 0) {
      newStr = str + padding;
    }
    else if (newStrLen < 0) {
      newStr = padding + str;
    }
    else {
      newStr = str;
    }
  }
  return newStr;
}

module.exports = pad;
