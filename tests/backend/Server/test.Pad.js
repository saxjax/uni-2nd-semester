const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const test = testDecorater(tape);
const pad = require(`../../../node/HelperFunctions/Pad`);
let actual = true;
let expected = true;

test(`Test af Pad-funktionen i node/Server`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  actual = pad(`String`, 7, ` `);
  expected = `String `;
  assert.equal(actual, expected, `{Forventet: "${expected}" Reel: "${actual}"} funktionen skulle gerne tilføje 1 space til HØJRE for strengen`);

  actual = pad(`String`, -7, ` `);
  expected = ` String`;
  assert.equal(actual, expected, `{Forventet: "${expected}" Reel: "${actual}"} funktionen skulle gerne tilføje 1 space til VENSTRE for strengen`);

  actual = pad(`String`, 50, ` `);
  expected = `String                                            `;
  assert.equal(actual, expected, `{Forventet: "${expected}" Reel: "${actual}"} funktionen skulle gerne tilføje 44 spaces til HØJRE for strengen`);

  actual = pad(`String`, -50, ` `);
  expected = `                                            String`;
  assert.equal(actual, expected, `{Forventet: "${expected}" Reel: "${actual}"} funktionen skulle gerne tilføje 44 spaces til VENSTRE for strengen`);

  actual = pad(`String`, 6, ` `);
  expected = `String`;
  assert.equal(actual, expected, `{Forventet: "${expected}" Reel: "${actual}"} funktionen skulle gerne returnere strengen selv`);

  actual = pad(`String`, -6, ` `);
  expected = `String`;
  assert.equal(actual, expected, `{Forventet: "${expected}" Reel: "${actual}"} funktionen skulle gerne returnere strengen selv`);

  actual = pad(`String`, 1, ` `);
  expected = `String`;
  assert.equal(actual, expected, `{Forventet: "${expected}" Reel: "${actual}"} funktionen skulle gerne returnere strengen selv`);

  actual = pad(`String`, -1, ` `);
  expected = `String`;
  assert.equal(actual, expected, `{Forventet: "${expected}" Reel: "${actual}"} funktionen skulle gerne returnere strengen selv`);

  actual = pad(`String`, 0, ` `);
  expected = `String`;
  assert.equal(actual, expected, `{Forventet: "${expected}" Reel: "${actual}"} funktionen skulle gerne returnere strengen selv`);

  assert.end();
});
