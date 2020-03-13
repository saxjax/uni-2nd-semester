const stubTest = require(`tape`);

stubTest(`Stuben node/test.app.js`, (assert) => {
  const actual = true;

  assert.true(actual, `Returnere altid sandt`);

  assert.end();
});
