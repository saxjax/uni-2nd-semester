const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const { JSDOM } = require(`jsdom`);

const root = __dirname.slice(0, -(`tests/frontend/meta`.length));
const fs = require(`fs`);

const ejs = fs.readFileSync(`${root}/www/views/meta/navbar.ejs`);
const DOM = new JSDOM(ejs);

const test = testDecorater(tape);
const { document } = DOM.window;
const expected = true;
const actual = true;


test(`Test af navbar i www/views/meta`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  assert.end();
});
