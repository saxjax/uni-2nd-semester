const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const { JSDOM } = require(`jsdom`);

const root = __dirname.slice(0, -(`tests/frontend/meta`.length));
const fs = require(`fs`);

const ejs = fs.readFileSync(`${root}/www/views/meta/footer.ejs`);
const DOM = new JSDOM(ejs);

const test = testDecorater(tape);
const { document } = DOM.window;
let expected = true;
let actual = true;


test(`Test af footer i www/views/meta`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  expected = `container-fluid fixed-bottom footer bg-light`;
  actual = document.querySelectorAll(`div`)[0].className;

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Dokumentet skal have container-fluid som sit forste div element`);

  assert.end();
});
