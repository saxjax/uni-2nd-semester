const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { User } = require(`../../../node/User/User.js`);

let request = {'body':{username:"test",password:'1234'}};
let actual = true;
let expected = true;
let object = new User(request);

test(`Test af User klassen i node/User`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  let request = {'body':{username:"Test",password:'test'}};
  expected = `Test`;
  object = new User(request);
  actual = object.get(`username`,`username = ?`,request.body.username);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal have navn efter sin egen klasse`);

  assert.end();
});
