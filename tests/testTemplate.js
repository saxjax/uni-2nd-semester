/* Dette dokument er en template for hvordan vi laver test. */

/* npm i --save-dev tape */
/* npm i --save-dev tape-promise */

/* Templates ******************************************************** */
/* Non-Async Functions ********************************************** */
const basicTest = require(`tape`);

basicTest(`Skriv kort hvad der testes`, (assert) => {
  const expected = `forventet ud fra testværdi`;
  const actual = testFunktion(`testværdi`);

  assert.equal(actual, expected,
    `Giv her en mere detaljeret beskrivelse af hvad der testes`);

  assert.end();
});

/* Promise Functions **************************************************** */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const promiseTest = testDecorater(tape);

promiseTest(`testPromise skal konvertere string input til numbers`, (assert) => {
  const expected = `forventet ud fra testværdi`;

  return testPromise(`testværdi`).then((actual) => assert.equal(actual, expected,
    `Giv her en mere detaljeret beskrivelse af hvad der testes`));
});


/* React Rendering **************************************************** */
// Se kilder i bunden. Mangler Template

/* Eksempler (der fejler) ********************************************* */
/* Funktionerne der skal testes *************************************** */
function testFunktion(inputValue) {
  return Number(inputValue) + 5;
}
function testPromise(inputValue) {
  return new Promise(((resolve) => {
    setTimeout(() => {
      resolve(Number(inputValue) + 5);
    }, 500);
  }));
}

/* Non-Async *********************************************************** */
basicTest(`testFunktion skal konvertere string input til numbers`, (assert) => {
  const expected = 6;
  const actual = testFunktion(`1`);

  assert.equal(actual, expected,
    `Funktionen skal give ${expected} og giver ${actual}\n`
        + `Giv her en mere detaljeret beskrivelse af hvad der testes, så der hurtigere kan findes fejlene\n`
        + `Desuden må man meget gerne gøre beskrivelserne længere hvis man har behov for det`);

  assert.end();
});

/* Promise **************************************************************** */
promiseTest(`testPromise skal konvertere string input til numbers`, (assert) => {
  const expected = 6;

  return testPromise(`1`).then((actual) => assert.equal(actual, expected,
    `Funktionen skal give ${expected} og giver ${actual}\n`
            + `Giv her en mere detaljeret beskrivelse af hvad der testes, så der hurtigere kan findes fejlene\n`
            + `Desuden må man meget gerne gøre beskrivelserne længere hvis man har behov for det`));
});

/* Kilder **************************************************************** */
// Tape:              https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4
// Tape-Promise:      https://github.com/jprichardson/tape-promise
// Shallow Rendering: https://simonsmith.io/unit-testing-react-components-without-a-dom
