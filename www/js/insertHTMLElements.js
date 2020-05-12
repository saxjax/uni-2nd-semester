/* HEAD */

// Formål: Indsætter et DOM-element før insBeforeThisElem
function insertDomNode(tagName, insBeforeThisElem, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  insBeforeThisElem.parentNode.insertBefore(node, insBeforeThisElem);
  return node;
}

// Formål: Indsætter et DOM-element, som en child til den givne parent
function appendDomNode(tagName, parent, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  parent.appendChild(node);
  return node;
}

/* Formål: Opretter et DOM-element og returnerer den
 * Indput: tagNameParam = Tekststreng som fortæller, hvilken slags DOM-element
           text         = Den tekst som skal stå i elementet
           selectors    = Et array af objects som siger noget om elementets selectors f.eks: [{id: foo}, {class: bar}]
 */
function createDomNode(tagNameParam, text, selectors) {
  const tagName = tagNameParam.toUpperCase();
  const elem = document.createElement(tagName);
  // Apply text
  if (text) {
    switch (tagName) {
      case `P`:
        elem.appendChild(document.createTextNode(text)); break;
      case `BUTTON`: case `LABEL`:
        elem.innerHTML = text;                           break;
      case `INPUT`:
        elem.placeholder = text;                         break;
      default:
        console.warn(`tagName Warning: ${tagName} is not defined in switch. Text was not applied.`);
        break;
    }
  }
  // Apply css
  if (selectors) {
    for (let i = 0; i < selectors.length; i++) {
      const selectorType = Object.getOwnPropertyNames(selectors[i])[0]; // Enten "id" eller "class"
      switch (selectorType) {
        case    `id`: elem.id = selectors[i].id;              break;
        case `class`: elem.classList.add(selectors[i].class); break;
        default: throw new Error(`selectorType Error: ${selectorType} is not a valid selector type. Only "class" and "id" are available.`);
      }
    }
  }
  return elem;
}
