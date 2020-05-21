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

  /* Formål */
  dbDown(req, res) {
    this.ejs = path.join(`${this.root}/www/views/dbDown.ejs`);
    res.render(this.ejs);
  }

  /* Session Interaction URLs */

  /* UNDER CONSTRUCTION
   *
   */
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

  /* UNDER CONSTRUCTION
   *
   */
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

  /* UNDER CONSTRUCTION */
  registerPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/register.ejs`);
    res.render(this.ejs);
  }

  /* No Session Requirement URLs */

  /* UNDER CONSTRUCTION */
  loginPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/login.ejs`);
    res.render(this.ejs);
  }

  // TODO: Mangler EJS fil
  /* Formål: En side der angiver information om hjemmesiden.
   *         Denne side skal være tilgængelig fra alle sider af hjemmesiden.
   * Input : Non.
   * Output: Visning af information om hjemmesiden, uden man behøver være User.
   * FIXME: Implementation af denne funktionalitet kræver højst sandsynligt en ændring i Servermetoden "noSessionNoAccess"
   *         da den blokere for alt adgang til hjemmesiden, hvis man ikke er logget ind og har valgt gruppe, hvor denne
   *         vil være en undtagelse. Implementer gerne så denne kan være "en af flere" undtagelser.
   */
  async aboutPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/about.ejs`);
    res.render(this.ejs);
  }
}

module.exports = {
  AccessController,
};
