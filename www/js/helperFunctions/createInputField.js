/* For at scriptet virker kræves det at insertHTMLElements.js er loadet inden dennne fil */

/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

let fieldCount = 0;

/* Formål: At gøre det nemt at lave et input field med et tilhørende label, med en knap, som gør det muligt at slette det hele igen
 * Input:  @appendToThis      skal være en HTML DOM-node, som label, input og knap kan appendes til
 *         @type              skal være en tekststreng, som indikerer hvad der skal indsættes i input-feltet
 *         @minimumFieldCount skal være et heltalt, som indikerer hvor mange af disse felter der skal være som minimum
 * Output: En div (container), som indeholder den label, det input-felt samt den knap, som er blevet lavet i funktionen
 */
function createInputField(appendToThis, type, minimumFieldCount) {
  const uniqueId = `${type.toLowerCase()}${++fieldCount}`;
  const container = appendDomNode(`DIV`, appendToThis, undefined, [{ class: `${type.toLowerCase()}Container` }]);
  const label = appendDomNode(`LABEL`, container, `${type}:`);
  label.htmlFor = uniqueId;
  appendDomNode(`INPUT`, container, `Indtast dit ${type.toLowerCase()} her`, [{ class: `${type.toLowerCase()}Input` }, { id: uniqueId }]);
  const removeFieldBtn = appendDomNode(`BUTTON`, container, `X`, [{ class: `remove${type}Btn` }, { class: `btn` }, { class: `btn-danger` }]);
  removeFieldBtn.addEventListener(`click`, () => {
    const amountOfInputFields = appendToThis.getElementsByClassName(`${type.toLowerCase()}Container`).length;
    if (amountOfInputFields > parseInt(minimumFieldCount)) {
      container.remove();
    }
    else {
      displayErrorMessage(appendToThis, `Du skal indtaste mindst ${parseInt(minimumFieldCount)} ${type.toLowerCase()}(s).`);
    }
  });
  return container;
}

/* Formål: At producere og vise en fejlmeddelelse til brugeren, som slettes efter 5 sekunder
 * Input:  @appendToThis skal være en HTML DOM-node, som fejlmeddelelsen skal appendes til
           @message      skal være en tekststreng som indeholder fejlmeddelelsen til brugeren
 */
function displayErrorMessage(appendToThis, message) {
  const alertNotif = appendDomNode(`DIV`, appendToThis, `Fejl! ${message}`, [{ class: `alert` }, { class: `alert-danger` }]);

  setTimeout(() => {
    alertNotif.remove();
  }, 5000);
}
