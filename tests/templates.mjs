/* Tests */

/* npm i --save-dev tape */
/* npm i --save-dev tape-promise */

/* JS Templates */
/* Stubs */
const stubTest = require(`tape`);

stubTest(`Stuben node_www/Mappe-Z/index.js`, (assert) => {
  const actual = true;

  assert.true(actual, `Returnere altid sandt`);

  assert.end();
});

/* `Normal` Functions ********************************************** */
const basicTest = require(`tape`);
const { theFunction } = require(`../../../node_Eller_www/mapper/til/dinFilDerSkalTestes.js`);

basicTest(`Funktionen Y i node_www/Mappe-Z/filNavn.js`, (assert) => {
  const expected = `Det forventede output`;
  const actual = theFunction(`x`);

  assert.equal(actual, expected,
    `Funktionen skal kunne X`);

  assert.end();
});

/* Promise Functions **************************************************** */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const promiseTest = testDecorater(tape);
const { promiseFunction } = require(`../../../node_Eller_www/mapper/til/dinFilDerSkalTestes.js`);

promiseTest(`Funktionen Y i node_www/Mappe-Z/filNavn.js`, (assert) => {
  const expected = `forventet ud fra testværdi`;

  return promiseFunction(`testværdi`).then((actual) => assert.equal(actual, expected,
    `Promiset skal kunne X`));
});

/* Class Methods ******************************************************** */
const methodTest = require(`tape`);
const { ObjectetsNavn } = require(`../../../node_Eller_www/mapper/til/dinFilDerSkalTestes.js`);

methodTest(`Metoden Y der tilhører objektet Z i node_www/Mappe-Z/filNavn.js`, (assert) => {
  const expected = `Det forventede output`;
  const object = new ObjectetsNavn(`Constructor Placeholder`, `Placeholder 2`);
  const actual = object.someMethod(`x`);

  assert.equal(actual, expected,
    `Metoden skal kunne X`);

  assert.end();
});

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
