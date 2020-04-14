/* eslint no-console: off */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const test = testDecorater(tape);
const { ParseSql } = require(`../../../node/Models/AbstractClasses/ParseSQL.js`);
const p = new ParseSql();
let actual = true;
let expected = true;

test(`Test af parseSection i node/Database`, (assert) => {
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
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af inputtet`);

  assert.end();
});
