const basicTest = require(`tape`);

basicTest(`Blot for at teste om det er sandt.`, (assert) => {
  const actual = true;

  assert.true(actual);

  assert.end();
});
