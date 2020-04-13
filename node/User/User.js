/* eslint no-console: off */

const { Database } = require(`../Database/Database.js`);

/* UNDER CONSTRUCTION */

class User extends Database {
  /* Input : requestet der sendes fra en klient, samt inheritance af Database objektet.
   * Output: Et objekt med unikt ID konstrueret med de givne variable tilknyttet det.
   * Udvidet Beskrivelse:
   * Variablene over mellemrummet inheriter og overskriver JS database modulet.
   * Variablene under mellemrummet har navn efter tabelens SQL database kolonner.
   * groupId variablen hentes fra cookies, da de altid skal være tilgængelige.
   * idUser variablen hentes fra parametrene, da den sendes med en GET/SELECT request
   * Andre variable hentes fra body, da de sendes med en POST/INSERT eller PUT/UPDATE request
   */
  constructor(req) {
    super();
    this.elementtype = `user`;
    this.table = `user`;

    // this.idGroup      = (typeof req.session.idGroup     !== `undefined` ? req.session.idGroup     : undefined);
    this.idUser       = (typeof req.params.idUser       !== `undefined` ? req.session.idUser      : undefined);
    this.username     = (typeof req.body.username       !== `undefined` ? req.body.username       : undefined);
    this.password     = (typeof req.body.password       !== `undefined` ? req.body.password       : undefined);
    this.firstName    = (typeof req.body.firstName      !== `undefined` ? req.body.firstName      : undefined);
    this.lastName     = (typeof req.body.lastName       !== `undefined` ? req.body.lastName       : undefined);
    this.studySubject = (typeof req.body.studySubject   !== `undefined` ? req.body.studySubject   : undefined);
    this.semester     = (typeof req.body.semester       !== `undefined` ? req.body.semester       : undefined);
    this.university   = (typeof req.body.university     !== `undefined` ? req.body.university     : undefined);
    this.email        = (typeof req.body.email          !== `undefined` ? req.body.email          : undefined);
  }

  /* FIXME: UNDER CONSTRUCTION */
  async loginValid() {
    this.data = await this.query(`SELECT *`, `username = "${this.username}" AND password = "${this.password}"`)
      .then((result) => result)
      .catch((error) => error);

    return this.data;
  }

  /* Skal implementeres med sessions */
  /* FIXME: UNDER CONSTRUCTION */
  alreadyLoggedIn() {
    this.cookie = false;
    return this.cookie;
  }

  /* FIXME: UNDER CONSTRUCTION */
  async validateRegister() {
    let validationCheck = false;
    if (sufficientData()) {
      this.data = await this.query(`SELECT *`, `username = "${this.username}" OR email = "${this.email}"`);
      if (this.data.length > 0) {
        console.log(`User already registered`);
      }
      else {
        validationCheck = true;
      }
    }
    return validationCheck;
  }

  /* UNDER CONSTRUCTION */
  async createUser() {
    this.register_data = await this.query(`INSERT`,
      `username = "${this.username}" 
      AND password = "${this.password}" 
      AND firstname = "${this.firstName}" 
      AND lastname = "${this.lastName}" 
      AND university = "${this.university}" 
      AND studysubject = "${this.studySubject}" 
      AND semester = "${this.semester}"`);
  }
}


module.exports = {
  User,
};

function sufficientData() {
  return (!isEmpty(this.username) && !isEmpty(this.firstName) && !isEmpty(this.lastName) && !isEmpty(this.email));
}

function isEmpty(str) {
  return (!str || str.length === 0);
}
