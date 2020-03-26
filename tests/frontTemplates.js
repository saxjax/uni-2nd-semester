/* Frontend Templates ********************************************** */
/* Start Template ************************************************** */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const { JSDOM } = require(`jsdom`);

const root = __dirname.slice(0, -(`tests/frontend`.length));
const fs = require(`fs`);

const ejs = fs.readFileSync(`${root}/www/views/mappe/til/filNavn.ejs`);
const DOM = new JSDOM(ejs);

const test = testDecorater(tape);
const { document } = DOM.window;
let expected = true;
let actual = true;


test(`Test af X i www/views`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  expected = `Angiv Navn`;
  actual = document.querySelectorAll(`title`)[0].innerHTML;

  assert.notEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Dokumentet skal have en titel`);

  /* Indsæt konstanter, variable og asserts her */

  assert.end();
});
/* Tag Testning (.className/.innerHTML/etc.) ********************* */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  expected = `forventet klasse`;
  actual = document.querySelectorAll(`HTML-tag`)[0].className;

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Dokumentet skal X`);
});
/* Event Handlers **************************************************** */

/* Kilder **************************************************************** */
// Tape:              https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4
// Tape-Promise:      https://github.com/jprichardson/tape-promise
// JSDOM Frontend1:   https://github.com/dwyl/learn-tape/blob/master/front-end-with-tape.md
// JSDOM Frontend2:   https://dustinpfister.github.io/2018/01/11/nodejs-jsdom/
