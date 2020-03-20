const { User } = require(`../User/User.js`);

class Expert extends User{
  constructor(request) {
    super()
    this.name = `Expert`;
    this.firstname = `Poul`;
  }
}

module.exports = {
  Expert,
};
