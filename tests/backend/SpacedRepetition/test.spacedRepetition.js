/* Test af Funktioner */
const { SpacedRepetition } = require(`./node/Models/spacedRepetition.js  `);

test(`Kopier det nedenunder ind i Start Templaten`, async (assert) => {
  const SP = new SpacedRepetition();
  expected = `forventet output`;
  actual = Navn(`vars`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne X`);
});
