/* eslint no-console: off */

const { User } = require(`../User/User.js`);

/* UNDER CONSTRUCTION */

class Expert extends User {
  /* UNDER CONSTRUCTION */
  constructor(req) {
    super(req);
    this.elementtype = `expert`;
  }
}

module.exports = {
  Expert,
};
