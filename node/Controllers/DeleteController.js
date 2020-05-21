/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Group } = require(`../Models/Group`);
const { User } = require(`../Models/User`);
const { Document } = require(`../Models/Document`);
const { Section } = require(`../Models/Section`);
const { Evaluation } = require(`../Models/Evaluation`);
const { QuizQuestion } = require(`../Models/QuizQuestion`);
const { QuizResult } = require(`../Models/QuizResult`);
const { ErrorController } = require(`./AbstractControllers/ErrorController`);

/* UNDER CONSTRUCTION */

class DeleteController extends ErrorController {
  /* UNDER CONSTRUCTION */
  constructor(root) {
    super();
    this.name = `CreateController`;
    this.root = root;
  }

  async DeleteSection(req, res) {
    const Sec = new Section(req);
    await Sec.deleteFromDatabase();
    res.send({ response: `OK` });
  }
}

module.exports = {
  DeleteController,
};
