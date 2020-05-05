/* HEAD */

// Indsætter et DOM-element før insBeforeThisElem
function insertDomNode(tagName, insBeforeThisElem, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  insBeforeThisElem.parentNode.insertBefore(node, insBeforeThisElem);
  return node;
}

// Indsætter et DOM-element, som en child til den givne parent
function appendDomNode(tagName, parent, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  parent.appendChild(node);
  return node;
}

function createDomNode(tagNameParam, text, selectors) {
  const tagName = tagNameParam.toUpperCase();
  const elem = document.createElement(tagName);
  // Apply text
  switch (tagName) {
    case `P`:
      elem.appendChild(document.createTextNode(text)); break;
    case `BUTTON`: case `LABEL`:
      elem.innerHTML = text;                           break;
    default:                                                break; // "default" sker når tagName ikke skal have et text
  }
  // Apply css
  if (selectors) {
    for (let i = 0; i < selectors.length; i++) {
      const selectorType = Object.getOwnPropertyNames(selectors[i])[0]; // Enten "id" eller "class"
      switch (selectorType) {
        case    `id`: elem.id = selectors[i].id;              break;
        case `class`: elem.classList.add(selectors[i].class); break;
        default: throw new Error(`That's not a valid selector type. Only "class" and "id" are available.`);
      }
    }
  }
  return elem;
}
