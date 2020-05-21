/* For at scriptet virker kræves det at insertHTMLElements.js er loadet inden dennne fil */

/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

let fieldCount = 0;

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
      displayErrorMessage(appendToThis, `Du skal indtaste mindst ${parseInt(minimumFieldCount)} ${type.toLowerCase()}.`);
    }
  });
  return container;
}

function displayErrorMessage(container, message) {
  const alertNotif = appendDomNode(`DIV`, container, `Fejl! ${message}`, [{ class: `alert` }, { class: `alert-danger` }]);

  setTimeout(() => {
    alertNotif.remove();
  }, 5000);
}
