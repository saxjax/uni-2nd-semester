/* Run test command:
 *    nodemon tests/backend/Database/test.ParseSQL.js | .\node_modules\.bin\tap-spec
 */
/* eslint no-console: off */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const test = testDecorater(tape);
const { ParseSql } = require(`../../../node/Database/ParseSQL`);
const p = new ParseSql();
let actual = true;
let expected = true;

test(`Test af ParseSQL i node/Database`, (assert) => {
  console.log(`Test af parseArrayOfObjects() metoden`);
  // Tests a første if-statement
  reset();
  expected = { data: `data` };
  actual = p.parseArrayOfObjects({ data: `data` });
  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere arbitrært input, 
     som ikke er et array, uden at ændre i det og logge en warning i processen`);

  reset();
  expected = 1;
  actual = p.parseArrayOfObjects(1);
  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere arbitrært input, 
     som ikke er et array, uden at ændre i det og logge en warning i processen`);

  reset();
  expected = true;
  actual = p.parseArrayOfObjects(true);
  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere arbitrært input, 
     som ikke er et array, uden at ændre i det og logge en warning i processen`);

  reset();
  expected = false;
  actual = p.parseArrayOfObjects(false);
  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere arbitrært input, 
     som ikke er et array, uden at ændre i det og logge en warning i processen`);

  reset();
  expected = `hejsa dejsa`;
  actual = p.parseArrayOfObjects(`hejsa dejsa`);
  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere arbitrært input, 
     som ikke er et array, uden at ændre i det og logge en warning i processen`);

  // Tests af ukendt elementtype
  reset();
  expected = [{
    elementtype: `lmao`,
    data: `data`,
  }];
  actual = p.parseArrayOfObjects([{
    elementtype: `lmao`,
    data: `data`,
  }]);
  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere input af typen array, 
     med ukendt elementtype i det indre objekt, uden at ændre i det og logge en warning i processen`);

  console.log(`Test af parseSection() metoden`);
  // Test uden teaser
  expected = {
    elementtype: `section`,
    idDocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idSection: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    sectionNumber: 9.9,
    title: `fiktiv viden`,
    content: `lidt tekst 3`,
    teaser: `lidt tekst 3`,
    keywords: undefined,
  };
  actual = p.parseSection({
    iddocument_section: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    iddocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    section_number: 9.9,
    section_title: `fiktiv viden`,
    section_teaser: null,
    section_content: `lidt tekst 3`,
    elementtype: `section`,
  });
  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af inputtet med en selvkonstrueret teaser`);

  // Test med teaser
  expected = {
    elementtype: `section`,
    idDocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idSection: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    sectionNumber: 9.9,
    title: `fiktiv viden`,
    content: `lidt tekst 3`,
    teaser: `En lille tisser`,
    keywords: undefined,
  };
  actual = p.parseSection({
    iddocument_section: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    iddocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    section_number: 9.9,
    section_title: `fiktiv viden`,
    section_teaser: `En lille tisser`,
    section_content: `lidt tekst 3`,
    elementtype: `section`,
  });

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af inputtet med den vedlagte teaser`);

  assert.end();
});

function reset() {
  p.parsedData = [];
}
