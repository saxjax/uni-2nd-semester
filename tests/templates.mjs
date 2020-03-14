/* Tests */
/* JS Test Requirements */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);

/* JS Templates */
/* Stubs */
test(`Stuben node_www/mapper/til/dinFil.js`, (assert) => {
  const actual = true;

  assert.true(actual, `Returnere altid sandt`);

  assert.end();
});

/* Functions ********************************************** */
const { theFunction } = require(`../../../node_www/mapper/til/dinFil.js`);

test(`Funktionen Y i node_www/mapper/til/dinFil.js`, (assert) => {
  const expected = `forventet output`;
  const actual = theFunction(`par/s`);

  assert.equal(actual, expected,
    `Funktionen skal kunne X`);

  assert.end();
});

/* Async Functions */
const { theAsyncFunction } = require(`../../../node_www/mapper/til/dinFil.js`);

test(`Async Funktionen Y i node_www/mapper/til/dinFil.js`, async (assert) => {
  const expected = `forventet output`;
  const actual = await theAsyncFunction(`par/s`);

  assert.equal(actual, expected,
    `Funktionen skal kunne X`);

  assert.end();
});

/* Promise **************************************************** */
const { promiseFunction } = require(`../../../node_www/mapper/til/dinFil.js`);

test(`Promised Y i node_www/mapper/til/dinFil.js`, (assert) => {
  const expected = `forventet output`;

  return promiseFunction(`par/s`)
    .then((actual) => assert.equal(actual, expected, `Promiset skal kunne X`))
    .catch((error) => assert.false(false, `Promiset resolvede ikke men catchede ${error}`));
});

/* Class Methods ******************************************************** */
const { ObjectetsNavn } = require(`../../../node_www/mapper/til/dinFil.js`);

test(`Metoden Y der tilhører objektet Z i node_www/mapper/til/dinFil.js`, (assert) => {
  const expected = `forventet output`;
  const object = new ObjectetsNavn(`Atr/s`);
  const actual = object.someMethod(`par/s`);

  assert.equal(actual, expected,
    `Metoden skal kunne X`);

  assert.end();
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
