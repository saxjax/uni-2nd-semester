const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);

test(`Stuben www/js/index.js`, (assert) => {
  const actual = true;

  assert.true(actual, `Returnere altid sandt`);

  assert.end();
});
