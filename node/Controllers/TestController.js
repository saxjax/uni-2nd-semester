// const path = require(`path`);
// const { Document } = require(`../Document/Document`);
// const { Section } = require(`../Section/Section`);
// const { Quiz } = require(`../Evaluation/Quiz`);
// const { Flashcard } = require(`../Evaluation/Flashcard`);
// const { Group } = require(`../Models/Group`);
// const { User } = require(`../User/User`);

/* Indsæt gerne test URLs her, husk at oprette dem i Server!
 * Dette kan bruges til at lave nogle prototyper på serveren, inden de implementeres formelt.
 */

class TestController {
  constructor() {
    this.name = `ViewController`;
    this.root = __dirname.slice(0, -(`node/Controllers`.length));
    this.ejs = ``;
  }

  async test(req, res) {
    req.session.groupId = `34701dd1-7c29-11ea-86e2-2c4d54532c7a`;
    const G = new Group(req);
    const data = {
      document: await G.getAll(`document`),
    };
    res.send(`Yes its a test! the documents are ${data}`);
  }

  async test2(req, res) {
    res.send(`Something`);
  }

  async test3(req, res) {
    const test1 = (typeof req.params.queryId       !== `undefined` ? req.params.queryId      : undefined);
    console.log(test1);
    console.log(`test2 = ${test2}`);
    res.send(`Se i log`);
  }

  async whatever(req, res) {
    res.redirect(503, `/dbdown`);
  }
}

module.exports = {
  TestController,
};
