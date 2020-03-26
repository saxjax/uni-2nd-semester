const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const { JSDOM } = require(`jsdom`);
const fs = require(`fs`);

const root = __dirname.slice(0, -(`tests/frontend`.length));
const ejs = fs.readFileSync(`${root}/www/views/login.ejs`);
const DOM = new JSDOM(ejs);

const test = testDecorater(tape);
const { document } = DOM.window;
let expected = true;
let actual = true;

test(`Test af login i www/views`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  expected = `Angiv Navn`;
  actual = document.querySelectorAll(`title`)[0].innerHTML;
  assert.notEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Dokumentet skal have en titel`);

  expected = `login-form`;
  actual = document.querySelectorAll(`div`)[0].className;
  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Dokumentet skal have container som sit forste div element`);

  assert.end();
});
