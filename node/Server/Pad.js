/* Formål: "Padder" en streng til en længde, så læsbarheden øges.
 * Input:  str:       Den tekststreng som skal paddes.
           newStrLen: Længden af den nye streng. Kan både være positiv og negativ
 *                        Hvis længden er positiv bliver strengen venstrejusteret.
 *                        Er længden derimod negativ, bliver strengen højrejusteret.
 *         padChar:   Den karakter, som de tomme pladser i den nye streng skal have.
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
