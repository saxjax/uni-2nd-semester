/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { User } = require(`../Models/User`);
const { Group } = require(`../Models/Group`);

/* Formål: AccessControllerens opgave er at håndtere alle requests omhandlende adgang til platformen
 * Input:  Modtager en settingsfil, indeholder serverinstillingerne bestemt i filen serverSettings.js i roden
 */
class AccessController {
  constructor(settings) {
    this.name = `ViewController`;
    this.root = settings.root;
    this.ejs = ``;
  }

  /* Formål: At rendere en side, som fortæller brugeren at vores database ikke virker */
  dbDown(req, res) {
    this.ejs = path.join(`${this.root}/www/views/dbDown.ejs`);
    res.render(this.ejs);
  }

  /* Session Interaction URLs */

  /* Formål: At hente og videresende data omkring de grupper, som en given bruger er tilknyttet */
  async viewGroupsPage(req, res) {
    const U = new User(req);
    const G = new Group(req);
    G.getIdGroupFromUser(U);

    const data = {
      user: await U.getThisUserData(),
      group: await G.getThisGroupData(),
    };
    this.ejs = path.join(`${this.root}/www/views/groups.ejs`);
    U.connect.end();
    G.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: At hente og videresende data forbundet med at en bruger skal oprette et nyt grupperum */
  async postGroupPage(req, res) {
    const U = new User(req);
    const groupIdFromUser = await U.query(`SELECT ${U.idColumnGroup}`, `${U.idColumnUser} = "${U.idUser}"`);
    const G = new Group(req);
    G.idGroup = groupIdFromUser[0].idGroup;

    const data = {
      user: await U.getThisUserData(),
      group: await G.getThisGroupData(),
    };
    this.ejs = path.join(`${this.root}/www/views/postGroup.ejs`);
    U.connect.end();
    G.connect.end();
    res.render(this.ejs, { data });
  }


  /* No Session Requirement URLs */

  /* Formål: At rendere en side for brugeren, hvor brugeren kan registrere en bruger i systemet */
  registerPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/register.ejs`);
    res.render(this.ejs);
  }

  /* Formål: At rendere en side for brugeren, hvor brugeren kan logge ind */
  loginPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/login.ejs`);
    res.render(this.ejs);
  }

  // TODO: Mangler EJS fil
  /* Formål: En side der angiver information om hjemmesiden.
   *         Denne side skal være tilgængelig fra alle sider af hjemmesiden.
   * Input : Non.
   * Output: Visning af information om hjemmesiden, uden man behøver være User.
   */
  aboutPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/about.ejs`);
    res.render(this.ejs);
  }
}

module.exports = {
  AccessController,
};
