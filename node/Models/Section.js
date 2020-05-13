/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

/* Section er det objekt som indeholder data vedr�rende de afsnit der findes i et dokument.
* en section oprettes ved at.....
* det er muligt at oprette et section object med alle elementer sat til undefined til test brug.
* dettes bruges af testData klassen som opretter opjekter med predefinerede data.
* for at oprette en tom section g�res f�lgende:
const req = {method: `TEST`, session: {}, params: {}, body: {},};
const sec = new Section(req);

 * UDVID MED INFORMATION NÅR SECTION ER DESIGNET
 */

class Section extends Model {
  constructor(req) {
    super(req);
    this.elementType = `section`;
    this.table = `document_section`;
    this.idDocument = `11111111-aaaa-bbbb-1111-111111111111`; // Hardcoded into every section - can be changed in the future

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `ID_DOCUMENT_SECTION`;
          this.idQuery        =  req.params.idQuery;
          break;
        case `POST`:
          this.title    = req.body.title;
          this.content  = req.body.content;
          this.keywords = req.body.keywords;
          this.number   = req.body.number;
          break;
        case `TEST`:
          this.elementType = `section`;
          this.table = `document_section`;
          this.idSection =  undefined;
          this.idDocument =  undefined;
          this.idUser =  undefined;
          this.idGroup =  undefined;
          this.title =  undefined;
          this.content =  undefined;
          this.number =  undefined;
          this.teaser =  undefined;
          this.keywords =  undefined;
          break;

        default: break;
      }
    }
  }

  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: True hvis queren inserter, ellers false hvis der sker en fejl.
   */
  async insertToDatabase() {
    try {
      await this.query(`INSERT`, `SECTION_TITLE = "${this.title}" `
                       + `AND SECTION_CONTENT = "${this.content}" `
                       + `AND ID_DOCUMENT = "${this.idDocument}" `
                       + `AND KEYWORDS = "${this.keywords}" `
                       + `AND SECTION_NUMBER = "${this.number}" `
                       + `AND ID_USER_GROUP = "${this.idGroup}" `
                       + `AND ID_USER = "${this.idUser}"`);
    }
    catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  generateKeywords() {
    const potentialKeywords = this.content.split(` `);
    const keywords = [];
    for (let i = 0; i < potentialKeywords.length; i++) {
      if (potentialKeywords[i].length > 10) {
        keywords.push(potentialKeywords[i]);
      }
    }
    return keywords.split(`;`);
  }
}

module.exports = {
  Section,
};
