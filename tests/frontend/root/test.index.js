const basicTest = require(`tape`);

basicTest(`Stuben www/js/index.js`, (assert) => {
  const actual = true;

  assert.true(actual, `Returnere altid sandt`);

  assert.end();
});
