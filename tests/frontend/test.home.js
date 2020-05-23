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

  /* 1.1 */
  expected = ` GroupHub `;
  actual = document.getElementsByTagName(`title`)[0].innerHTML;

  assert.equal(actual, expected,
    `(1.1) {Forventet: ${expected} Reel: ${actual}} Dokumentet skal have titlen ' GroupHub '`);

  /* 1.2 */
  actual = document.getElementsByClassName(`footer`)[0].innerHTML;
  expected = `\n      &lt;%- include(`../../meta/footer`) %&gt;\n    `; // Footeren bliver ikke renderet
  assert.equal(actual, expected,
    `(1.2) Dokumentet skal have en footer.`);

  assert.end();
});
