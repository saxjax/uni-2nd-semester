/* eslint-disable guard-for-in */
/* eslint no-console: off */
const { Section } = require(`../Models/Section`);
const { ErrorController } = require(`./AbstractControllers/ErrorController`);

/* UNDER CONSTRUCTION */

class DeleteController {
  /* UNDER CONSTRUCTION */
  constructor(root) {
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
      const E = new ErrorController(error);
      const errorMsg = E.produceErrorMessageToUser();
      res.send({ error: errorMsg });
    }
  }
}

module.exports = {
  DeleteController,
};
