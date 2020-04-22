/* eslint no-console: off */
const path = require(`path`);
const { User } = require(`../Models/User.js`);
const { Section } = require(`../Models/Section.js`);

/* FIXME: UNDER CONSTRUCTION */

class RedirectController {
  /* UNDER CONSTRUCTION */
  constructor() {
    this.name = `RedirectController`;
    this.root = __dirname.slice(0, -(`node/Controllers`.length));
    this.ejs = ``;
  }

  /* FIXME: UNDER CONSTRUCTION */
  dbdown(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/database_down.ejs`);
    res.render(this.ejs); // FIXME: Implementer brug af statuskode 503 (https://httpstatuses.com/503)
  }

  /* Formål: At autentificere at bruger og password kombinationen findes i databasen
   * Input : Et username og password submittet fra login
   * Output: Oprettelsen af en session med den indloggede bruger
   */
  async auth(req, res) {
    const currentUser = new User(req);
    this.data = await currentUser.loginValid();
    if (this.data.fatal) {
      res.redirect(`/dbdown`);
    }
    else if (this.data.length > 0) {
      req.session.userId = currentUser.getThis(``);
      req.session.loggedin = true;
      req.session.key = this.data[0].username;
      res.redirect(`/`);
    }
    else {
      res.redirect(`/login`); // FIXME: Implementer brug af statuskode 422 ved invalid login
    }
  }

  /* Formål: At oprette en bruger i databasen hvis registrerings informationen er valid.
   * Input : Username, Password, Firstname, Lastname, Semester, University, Email, Studysubject.
   * Output: Opretter bruger eller informerer om fejl.
   */
  async RegisterNewUser(req, res) {
    const newUser = new User(req);
    if (await newUser.validateRegister()) {
      await newUser.createUser();
      res.redirect(`/`);
    }
    else {
      console.log(`User could not be validated`);
      res.redirect(`/register`);
    }
  }

  /* UNDER CONSTRUCTION */
  UploadRapport(req, res) {
    if (req.files) {
      const file = req.files.section_file;
      const filename = file.name;

      file.mv(`./node/File_uploads/${filename}`, (err) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(`File Uploaded`);
        }
      });
    }

    const newKeywords = [req.body.keyword_1, req.body.keyword_2, req.body.keyword_3].toString();
    const newSection = req.body.name_of_section;
    // sectionDatabase[newSection] = {};
    // sectionDatabase[newSection]['keywords'] = newKeywords;

    this.addNewSection(newSection, newKeywords);

    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, { section: req.body.name_of_section, content: null });
  }

  /* UNDER CONSTRUCTION */
  UploadEvalueringer(req, res) {
    this.ejs = path.join(`${this.root}/www/views/evalueringerUpload.ejs`);
    res.render(this.ejs);
  }

  async createSection(req, res) {
    const newSection = new Section(req);
    const testInsert = await newSection.insertSectionToDatabase();
    console.log(testInsert);
    res.redirect(`/rapport`);
  }
}

module.exports = {
  RedirectController,
};
