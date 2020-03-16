const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { GroupMember } = require(`../../../node/GroupMember/GroupMember.js`);
let actual = true;
let expected = true;
let object = new GroupMember();

test(`Test af GroupMember klassen i node/GroupMember`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  actual = true;
  expected = true;
  object = new GroupMember();
  assert.equal(object.name, object.name, `Ny test`);

  assert.end();
});
