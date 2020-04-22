/* Formål: "Padder" en streng til en længde, så læsbarheden øges.
 * Input: Param paddingLength can both be positive or negative
 *        Hvis længden er positiv justere den til venstre.
 *        Er længden derimod negativ, justere den til højre.
 * Output: Returnere den "paddede" streng
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
    newStr = newStrLen > 0 ? str + padding : padding + str;
  }
  return newStr;
}

module.exports = pad;
