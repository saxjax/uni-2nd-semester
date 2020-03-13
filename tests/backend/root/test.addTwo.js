const basicTest = require(`tape`);
const { addTwo } = require(`../../../node/calculation.js`);

basicTest(`Funktionen addTwo`, (assert) => {
  const expected = 5;
  const actual = addTwo(3);

  assert.equal(actual, expected,
    `Skulle gerne kunne lægge to til et vilkårligt tal`);

  assert.end();
});
