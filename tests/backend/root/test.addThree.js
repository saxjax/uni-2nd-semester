const basicTest = require(`tape`);
const { addThree } = require(`../../../node/calculation.js`);

basicTest(`Funktionen addThree i node/calculation.js`, (assert) => {
  const expected = 6;
  const actual = addThree(3);

  assert.equal(actual, expected,
    `Skulle gerne kunne lægge tre til et vilkårligt tal`);

  assert.end();
});

basicTest(`Funktionen addThree i node/calculation.js`, (assert) => {
  const expected = 6;
  const actual = addThree(`3`);

  assert.equal(actual, expected,
    `Skulle gerne kunne lægge tre til, selvom tallet er en streng`);

  assert.end();
});
