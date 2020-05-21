/* eslint-disable guard-for-in */
/* eslint no-console: off */
const { User } = require(`../Models/User`);
const { Group } = require(`../Models/Group`);
const { ErrorController } = require(`./AbstractControllers/ErrorController`);


/* Formål: SessionControllerens opgave er at håndtere alle requests omhandlende sessions på platformen
 * Input:  Modtager en settingsfil, indeholder serverinstillingerne bestemt i filen serverSettings.js i roden
 */
class SessionController {
  constructor(settings) {
    this.name = `SessionController`;
    this.root = settings.root;
  }

  /* Formål: At validere et login og oprette brugerens session som den bruger der er logget ind med
   * Input : username og password
   * Output: redirect til `/`
   */
  async userSession(req, res) {
    const currentUser = new User(req);
    try {
      await currentUser.loginValid();
      res.redirect(`/access/view/groups`);
    }
    catch (error) {
      const E = new ErrorController(error);
      const errorMsg = E.produceErrorMessageToUser();
      res.send(errorMsg);
    }

    currentUser.connect.end();
  }

  /* Formål: At oprette den session som bestemmer hvilken gruppe brugeren er tilkoblet.
   * Input : et groupId
   * Output: redirect til `/`
   */
  async groupSession(req, res) {
    const G = new Group(req);
    G.idGroup = req.params.idQuery;
    let data = [{}];
    try {
      data = await G.getThisGroupData();

      if (Object.keys(data[0]).length > 1) {
        req.session.idGroup = data[0].idGroup;
        req.session.groupname = data[0].name;
        G.connect.end();
        res.redirect(`/`);
      }

      else {                     // FIXME: Dokumentation mangler - hvornår rammer man denne else-clause?
        G.connect.end();
        res.redirect(`/access/view/groups`); // FIXME: Statuskode indsættes
      }
    }
    catch (error) {
      const E = new ErrorController(error);
      const errorMsg = E.produceErrorMessageToUser();
      res.send(errorMsg);
    }
  }

  /* Formål: At gøre det muligt at skifte bruger og grupperum.
   * Input : @req som indeholder en brugers session data.
   * Output: Et reset af brugerens session data, og redirect til loginpagen
   */
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect(`/access/login`);
      return false;
    });
  }
}

module.exports = {
  SessionController,
};
