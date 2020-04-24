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
}

module.exports = {
  TestController,
};
