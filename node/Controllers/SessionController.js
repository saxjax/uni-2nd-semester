/* eslint-disable guard-for-in */
/* eslint no-console: off */
const { User } = require(`../Models/User`);
const { Group } = require(`../Models/Group`);

/* Controllere for sessions
 * Omdirigere altid til `/` (som det står nu)
 */

class SessionController {
  constructor(root) {
    this.name = `ViewController`;
    this.root = root;
  }

  /* Formål: At validere et login og oprette brugerens session som den bruger der er logget ind med
   * Input : username og password
   * Output: redirect til `/`
   */
  async userSession(req, res) {
    const currentUser = new User(req);
    const data = await currentUser.loginValid();
    console.log(`data ${data[0]}`);
    if (data.fatal) {
      res.redirect(503, `/dbdown`);
    }
    else if (data.length > 0) {
      req.session.idUser = data[0].idUser;
      req.session.loggedIn = true;
      req.session.username = data[0].username;
      res.redirect(`/`);
    }
    else {                       // FIXME: Dokumentation mangler - hvornår rammer man denne else-clause?
      res.redirect(`/register`); // FIXME: Statuskode indsættes
    }
  }

  /* Formål: At oprette den session som bestemmer hvilken gruppe brugeren er tilkoblet.
   * Input : et groupId
   * Output: redirect til `/`
   */
  async groupSession(req, res) {
    const G = new Group(req);
    G.idGroup = req.params.idQuery;
    const data = await G.getThisGroupData();
    if (data) {
      req.session.idGroup = data[0].idGroup;
      req.session.groupname = data[0].name;
      res.redirect(`/`);
    }
    else {                     // FIXME: Dokumentation mangler - hvornår rammer man denne else-clause?
      res.redirect(`/groups`); // FIXME: Statuskode indsættes
    }
  }
}

module.exports = {
  SessionController,
};
