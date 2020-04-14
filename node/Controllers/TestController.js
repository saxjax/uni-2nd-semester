// const path = require(`path`);
// const { Document } = require(`../Document/Document`);
// const { Section } = require(`../Section/Section`);
// const { Quiz } = require(`../Evaluation/Quiz`);
// const { Flashcard } = require(`../Evaluation/Flashcard`);
const { Group } = require(`../Models/Group`);
// const { User } = require(`../User/User`);

/* UNDER CONSTRUCTION */

class TestController {
  /* UNDER CONSTRUCTION */
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
    res.send(req.session.groupId);
  }
}

module.exports = {
  TestController,
};
