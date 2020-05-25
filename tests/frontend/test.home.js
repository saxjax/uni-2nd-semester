const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const { JSDOM } = require(`jsdom`);

const root = __dirname.slice(0, -(`tests/frontend`.length));
const fs = require(`fs`);

const ejs = fs.readFileSync(`${root}/www/views/home/home.ejs`);
const DOM = new JSDOM(ejs);

const test = testDecorater(tape);
const { document } = DOM.window;
let expected = true;
let actual = true;

test(`Test af home.ejs i www/views`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  /* 1.1 */
  expected = ` GroupHub `;
  actual = document.getElementsByTagName(`title`)[0].innerHTML;

  assert.equal(actual, expected,
    `(1.1) {Forventet: ${expected} Reel: ${actual}} Dokumentet skal have titlen ' GroupHub '`);

  assert.end();
});
