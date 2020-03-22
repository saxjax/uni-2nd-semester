const path = require(`path`);

const { User } = require(`../User/User.js`);

class RedirectController {
  constructor() {
    this.name = `RedirectController`;
    this.root = __dirname.slice(0, -(`node/${this.name}`.length));
  }

  dbdown(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/database_down.ejs`);
    res.render(this.ejs);
  }

  async auth(req, res) {
    const currentUser = new User(req);
    this.data = await currentUser.loginValid();
    if (this.data.fatal) {
      res.redirect(`/dbdown`);
    }
    else if (this.data.length > 0) {
      res.redirect(`/`);
    }
    else {
      res.redirect(`/register`);
    }
  }
}

module.exports = {
  RedirectController,
};
