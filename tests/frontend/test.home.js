const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const { JSDOM } = require(`jsdom`);

const root = __dirname.slice(0, -(`tests/frontend`.length));
const fs = require(`fs`);

const ejs = fs.readFileSync(`${root}/www/views/home.ejs`);
const DOM = new JSDOM(ejs);

const test = testDecorater(tape);
const { document } = DOM.window;
let expected = true;
let actual = true;

/* Dokumentation */
/* Home er hjemmesidens "hovedside" som skal give et overblik for brugeren.
   At "danne sig et overblik" for denne applikation, betyder...
   UDVID DOKUMENTATIONEN!!!
 */

/* Linkning til andre dele af siden:
   1.1: Det skal være muligt at komme til siden hvor man kan registrere sig
   1.2: Det skal være muligt at komme til siden hvor man kan logge ind
 */

test(`Test af home.ejs i www/views`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  expected = `Angiv Navn`;
  actual = document.querySelectorAll(`title`)[0].innerHTML;

  assert.notEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Dokumentet skal have en titel`);

  /* 1.1 */
  expected = `forventet klasse`;
  actual = document.querySelectorAll(`a`)[0].href;

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Dokumentet skal X`);

  assert.end();
});
