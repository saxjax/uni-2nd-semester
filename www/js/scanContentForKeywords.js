/* scanContentForKeywods er pt. implementeret som en funktion der automatisk kører
 * Når man stopper med at skrive i "content" formen, så vil den automatisk kalde "scanContentForKeywords" algoritmen.
 * Til at opnå dette opstilles de understående eventListeners.
 */

const input = document.getElementById(`content`); // Denne bruges til at scanne det brugeren taster samt hvornår brugeren stopper med at taste
let timeout = null;                               // Denne styrer "pausen" mellem man stopper med at taste, og algoritmen aktivere

input.addEventListener(`keyup`, () => {
  clearTimeout(timeout);            // "Cleare" den forrigt satte timeout, så brugeren ikke får 1 scan pr. tryk på en knap

  timeout = setTimeout(() => {      // Sikrer at funktionen ikke aktivere ved hver enkelt tryk på knappen som brugeren laver
    scanContentForKeywords(input);  // aktivere scanContentForKeywords funktionen
  }, 1000);                         // Bestemmer hvor lang tid brugeren skal vente
});

/* Formål: Scanner content så der bliver fremstillet nøgleord som brugeren kan sortere i.
 *         Funktionen er opbygget så den kan kobles op på flere forskellige algoritmer.
 * Input : @content medsendes fra den forrige eventListener
 * Output: En række kommaseparerede keywords, som outputtes til formen i keyword "value" feltet.
 */
function scanContentForKeywords(content) {
  const keywords = document.getElementById(`keywords`);
  let wordsInContent = content.value;

  wordsInContent = wordsInContent.replace(/,/g, ``);  // fjerner alle kommaer
  wordsInContent = wordsInContent.replace(/\./g, ``); // fjerner alle punktummer
  wordsInContent = wordsInContent.split(` `);         // omdanner strengen til et array

  keywords.value = longWordAlgorithm(wordsInContent);
}

/* ALLE ALGORITMER! */
/* Formål: Alle funktioner herunder er algoritmer der kan "plugges" ind i scanContentForKeywords.
 * Input : @arrayOfWords. alle algoritmer tager et arrayOfWords ind som parameter der scannes på.
 * Output: @keywords. Alle algoritmer outputter en streng af kommaseparerede keywords.
 */

/* Formål: En simpel algoritme der returnere alle ord over en hvis længde, som antages som nøgleord
 *         Er primært en algoritme til at vise funktionaliteten.
 */
function longWordAlgorithm(arrayOfWords) {
  const DEF_OF_LONG_WORD = 8; // Angiver definition af hvad "et langt ord" betyder

  const keywords = [];
  for (let i = 0; i < arrayOfWords.length; i++) {
    if (arrayOfWords[i].length >= DEF_OF_LONG_WORD) {
      keywords.push(arrayOfWords[i]);
    }
  }

  return keywords.join(`, `);
}
