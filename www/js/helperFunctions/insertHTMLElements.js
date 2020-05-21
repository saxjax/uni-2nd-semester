/* eslint no-unused-vars: 0 */

/* Formål: Indsætter et DOM-element før insBeforeThisElem
 * Input:  @tagName           skal være en tekststreng som specificerer hvilken type tag skal oprettes
 *         @insBeforeThisElem skal være en DOM-node, som indikerer, hvor den nye DOM-node skal være i DOM-træet
 *         @text              skal være en tekststreng, som indeholder det som skal stå som innerHTML i den nye DOM-node
 *         @selectors         skal være et array af objects som siger noget om elementets selectors f.eks: [{id: foo}, {class: bar}]
 * Output: Den nyoprettede node
 */
function insertDomNode(tagName, insBeforeThisElem, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  insBeforeThisElem.parentNode.insertBefore(node, insBeforeThisElem);
  return node;
}

/* Formål: Indsætter et DOM-element, som en child til den givne parent
 * Input:  @tagName   skal være en tekststreng som specificerer hvilken type tag skal oprettes
 *         @parent    skal være en DOM-node, som indikerer, hvor den nye DOM-node skal være i DOM-træet
 *         @text      skal være en tekststreng, som indeholder det som skal stå som innerHTML i den nye DOM-node
 *         @selectors skal være et array af objects som siger noget om elementets selectors f.eks: [{id: foo}, {class: bar}]
 * Output: Den nyoprettede node
 */
function appendDomNode(tagName, parent, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  parent.appendChild(node);
  return node;
}

/* Formål: Opretter et DOM-element og returnerer den
 * Indput: @tagNameParam skal være en tekststreng som specificerer hvilken type tag skal oprettes
           @text         skal være en tekststreng, som indeholder det som skal stå som innerHTML i den nye DOM-node
           @selectors    skal være et array af objects som siger noget om elementets selectors f.eks: [{id: foo}, {class: bar}]
 * Output: Den nyoprettede node
 */
function createDomNode(tagNameParam, text, selectors) {
  const tagName = tagNameParam.toUpperCase();
  const node = document.createElement(tagName);
  // Apply text
  if (text) {
    switch (tagName) {
      case `P`:
        node.appendChild(document.createTextNode(text)); break;
      case `BUTTON`: case `LABEL`: case `DIV`:
        node.innerHTML = text;                           break;
      case `INPUT`:
        node.placeholder = text;                         break;
      default:
        console.warn(`tagName Warning: ${tagName} is not defined in switch. Text was not applied.`);
        break;
    }
  }
  // Apply css
  if (selectors) {
    for (let i = 0; i < selectors.length; i++) {
      const selectorType = Object.getOwnPropertyNames(selectors[i])[0]; // Enten "id" eller "class"
      switch (selectorType.toLowerCase()) {
        case    `id`: node.id = selectors[i].id;              break;
        case `class`: node.classList.add(selectors[i].class); break;
        default: console.warn(`selectorType Warning: ${selectorType} is not a valid selector type. Only "class" and "id" are available.`); break;
      }
    }
  }
  return node;
}
