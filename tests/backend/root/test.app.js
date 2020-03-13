const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);

test(`Stuben node/test.app.js`, (assert) => {
  const actual = true;

  assert.true(actual, `Returnere altid sandt`);

  assert.end();
});
