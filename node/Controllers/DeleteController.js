/* eslint-disable guard-for-in */
/* eslint no-console: off */
const { Section } = require(`../Models/Section`);
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
    try {
      const Sec = new Section(req);
      await Sec.deleteFromDatabase();
      res.send({ response: `OK` });
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send({ error: errorMsg });
    }
  }
}

module.exports = {
  DeleteController,
};
