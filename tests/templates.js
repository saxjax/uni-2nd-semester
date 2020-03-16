/* Tests */
/* Start Template **************************************************** */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Navn } = require(`../../../node_www/mapper/til/dinFil.js`);
let actual = true;
let expected = true;
let object = new Navn();

test(`Test af X i node_www/objektNavn`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  /* Indsæt variable og asserts her */

  assert.end();
});

/* Functions ********************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  expected = `forventet output`;
  actual = Navn(`par/s`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Funktionen skal kunne X`);
});

/* Class Methods ******************************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  expected = `forventet output`;
  object = new Navn(`Atr/s`);
  actual = object.someMethod(`par/s`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne X`);
});

/* Async Functions **************************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, async (assert) => {
  expected = `forventet output`;
  try {
    actual = await Navn(`par/s`);
    assert.equal(actual, expected,
      `{Forventet: ${expected} Reel: ${actual}} Async Funktionen skal kunne X`);
  }
  catch (error) {
    assert.false(false, `Async Funktionen resolvede ikke, men catchede: ${error}`);
  }
});

/* Promise **************************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  expected = `forventet output`;

  return Navn(`par/s`)
    .then((actua) => assert.equal(actua, expected,
      `{Forventet: ${expected} Reel: ${actual}} Promiset skal kunne X`))
    .catch((error) => assert.false(false, `Promiset resolvede ikke, men catchede ${error}`));
});

/* React/JSDOM Test Requirements */

/* React Templates ********************************************** */
/* Rendering **************************************************** */
/*
const React = require(`react/addons`);
const shallowRender = React.addons.TestUtils.createRenderer();

shallowRender.render(React.createElement
  (MyComponent, { className: `MyComponent` }, `some child text`));

const component = shallowRender.getRenderOutput();

basicTest(``, (assert) => assert.equal(component.props.className, `MyComponent`));
*/
/* Event Handlers **************************************************** */

/* Kilder **************************************************************** */
// Tape:              https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4
// Tape-Promise:      https://github.com/jprichardson/tape-promise
// React Frontend:    https://simonsmith.io/unit-testing-react-components-without-a-dom
// JSDOM Fronted:     https://github.com/dwyl/learn-tape
