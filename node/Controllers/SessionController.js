/* eslint-disable guard-for-in */
/* eslint no-console: off */
const { User } = require(`../Models/User`);
const { Group } = require(`../Models/Group`);
const { ErrorController } = require(`./AbstractControllers/ErrorController`);


/* Controllere for sessions
 * Omdirigere altid til `/` (som det står nu)
 */

class SessionController extends ErrorController {
  constructor(settings) {
    super(settings.debug);
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
      const errorMsg = this.produceErrorMessageToUser(error);
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
    // G.idGroup = req.params.idQuery;
    // const data = await G.getThisGroupData();
    // if (data) {
    //   console.log(`got Data`);
    //   res.redirect(`/`);
    // }
    // else {
    //   console.log(`NO Data`);

    //   res.redirect(`/access/view/groups`); // FIXME: Statuskode indsættes
    // }

    // G.connect.end();


    const data = await G.getThisGroupData();
    if (data) {
      console.log(data);
      req.session.idGroup = data[0].idGroup;
      req.session.groupname = data[0].name;
      G.connect.end();
      // res.redirect(`/access/view/groups`);
      res.redirect(`/`);
    }
    else {                     // FIXME: Dokumentation mangler - hvornår rammer man denne else-clause?
      G.connect.end();
      // res.redirect(`/access/view/groups`); // FIXME: Statuskode indsættes
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
