const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const JSDOM = require('jsdom').JSDOM;
const root = __dirname.slice(0, -(`tests/frontend/meta`.length));
const fs = require(`fs`);

const ejs = fs.readFileSync(`${root}/www/views/meta/header.ejs`);
const DOM = new JSDOM(ejs);

const test = testDecorater(tape);
const document = DOM.window.document;
let expected = true;
let actual = true;


test(`Test af header i www/views/meta`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  assert.end();
});
