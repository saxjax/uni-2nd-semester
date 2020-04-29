/* eslint-disable guard-for-in */
/* eslint no-console: off */
const { Group } = require(`../Models/Group`);
const { User } = require(`../Models/User`);
const { Section } = require(`../Models/Section`);
const { Quiz } = require(`../Models/Quiz`);

/* UNDER CONSTRUCTION */

class CreateController {
  /* UNDER CONSTRUCTION */
  constructor() {
    this.name = `CreateController`;
    this.root = __dirname.slice(0, -(`node/Controllers`.length));
  }

  /* UNDER CONSTRUCTION */
  async createGroup(req, res) {
    const G = new Group(req);
    try {
      await G.insertToDatabase();
      res.redirect(`/groups`);
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }

  /* UNDER CONSTRUCTION */
  async createUser(req, res) {
    const U = new User(req);
    try {
      await U.insertToDatabase();
      res.redirect(`/login`);
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }

  /* UNDER CONSTRUCTION */
  async createSection(req, res) {
    const S = new Section(req);
    try {
      await S.insertToDatabase();
      res.redirect(`/view/sections/recipient`);
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }

  /* FIXME: UNDER CONSTRUCTION */
  async createQuiz(req, res) {
    const Q = new Quiz(req);
    try {
      await Q.insertToDatabase();
      res.redirect(`/post/questions`);
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }

  /* FIXME: UNDER CONSTRUCTION */
  async createQuestions(req, res) {
    const Q = new Quiz(req);
    try {
      await Q.insertToDatabase();
      res.redirect(`/post/questions`);
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }
}

module.exports = {
  CreateController,
};
