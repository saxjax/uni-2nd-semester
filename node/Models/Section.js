/* eslint no-console: off */

const path = require(`path`);

const { Model } = require(path.join(__dirname, `AbstractClasses`, `Model`));
const { Keyword } = require(path.join(__dirname, `Keyword`));

/* Section er den klasse som indeholder data vedrørende de afsnit der findes i et dokument.
 * Det er muligt at oprette et section object med alle elementer sat til undefined til test brug.
 * Dettes bruges af testData klassen som opretter opjekter med predefinerede data.
 * For at oprette en tom section gøres følgende:
 *   const req = {method: `TEST`, session: {}, params: {}, body: {},};
 *   const sec = new Section(req);
 */

class Section extends Model {
  /* Alle sectionType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super(req);
    this.elementType = `${this.sectionType}`;
    this.table = `${this.sectionTable}`;
    this.req = req;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `${this.sectionCol}`;
          this.idQuery        =  req.params.idQuery;
          break;
        case `POST`:
          this.idDocument = req.body.idDocument;
          this.idSection = undefined;
          this.title    = req.body.title;
          this.content  = req.body.content;
          this.keywords = req.body.keywords;
          this.number   = req.body.number;
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
    this.idSection = await this.getUuid();
    // Insert section to database
    const data = `${this.sectionCol} = "${this.idSection}" AND `
               + `${this.STitleCol} = "${this.title}" AND `
               + `${this.SContentCol} = "${this.content}" AND `
               + `${this.documentCol} = "${this.idDocument}" AND `
               + `${this.SNumberCol} = "${this.number}" AND `
               + `${this.groupCol} = "${this.idGroup}" AND `
               + `${this.userCol} = "${this.idUser}"`;
    await this.query(`INSERT`, data);
    // Insert keywords to database
    const ids = {
      idDocument: this.idDocument,
      idSection: this.idSection,
    };
    const keyw = new Keyword(this.req);
    await keyw.insertToDatabase(ids, this.keywords);
    return this.idSection;
  }

  // /* Formål: At generere keywords automatisk ud fra det content der bliver posted
  //  * Input : Intet, men bruger this.content
  //  * Output: Et array af Keywords der skal oprettes tilknyttet denne section.
  //  */
  // generateKeywords() {
  //   const potentialKeywords = this.content.split(` `);
  //   const keywords = [];
  //   for (let i = 0; i < potentialKeywords.length; i++) {
  //     if (potentialKeywords[i].length > 10) {
  //       keywords.push(potentialKeywords[i]);
  //     }
  //   }
  //   return keywords;
  // }

  /* Formål: At slette et afsnit (section) fra databasen samt alt hvad der ligger under afsnittet. */
  async deleteFromDatabase() {
    await this.query(`CUSTOM`, `DELETE FROM ${this.quizResultTable} WHERE ${this.evaluationCol} in (SELECT ${this.evaluationCol} FROM ${this.evaluationTable} WHERE ${this.sectionCol} = "${this.idQuery}")`);
    await this.query(`CUSTOM`, `DELETE FROM ${this.spacedRepetitionTable} WHERE ${this.quizQuestionCol} in (SELECT ${this.quizQuestionCol} 
                                                                                         FROM ${this.quizQuestionTable} 
                                                                                         INNER JOIN ${this.evaluationTable} 
                                                                                         ON ${this.evaluationTable}.${this.evaluationCol} = ${this.quizQuestionTable}.${this.evaluationCol} 
                                                                                         WHERE ${this.evaluationTable}.${this.sectionCol} = "${this.idQuery}")`);

    await this.query(`CUSTOM`, `DELETE FROM ${this.quizQuestionTable} WHERE ${this.evaluationCol} in (SELECT ${this.evaluationCol} FROM ${this.evaluationTable} WHERE ${this.sectionCol} = "${this.idQuery}")`);
    await this.query(`CUSTOM`, `DELETE FROM ${this.keywordLinkTable} WHERE ${this.sectionCol} = "${this.idQuery}"`);
    await this.query(`CUSTOM`, `DELETE FROM ${this.evaluationTable} WHERE ${this.sectionCol} = "${this.idQuery}"`);
    await this.query(`CUSTOM`, `DELETE FROM ${this.sectionTable} WHERE ${this.sectionCol} = "${this.idQuery}"`);
  }
}

module.exports = {
  Section,
};
