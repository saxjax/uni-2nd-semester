/* eslint-disable guard-for-in */
/* eslint no-console: off */

const path = require(`path`);

const { Section } = require(path.join(__dirname, `..`, `Models`, `Section`));
const { ErrorController } = require(path.join(__dirname, `AbstractControllers`, `ErrorController`));

/* Formål: CreateControllerens opgave er at håndtere alle DELETE-requests fra platformen
 * Input:  Modtager en settingsfil, indeholder serverinstillingerne bestemt i filen serverSettings.js i roden
 */
class DeleteController {
  constructor(settings) {
    this.name = `CreateController`;
    this.root = settings.root;
  }

  /* Formål: At slette et afsnit (section) i databasen */
  async deleteSection(req, res) {
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
