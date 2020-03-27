/* eslint no-console: off */

const { User } = require(`../User/User.js`);

class Expert extends User {
  constructor(req) {
    super(req);
    this.name = `Expert`;
    this.firstname = `Poul`;
  }
}

module.exports = {
  Expert,
};
