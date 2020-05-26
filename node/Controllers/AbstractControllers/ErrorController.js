/* eslint no-console: 0 */

const { serverSettings } = require(`../../../serverSettings`);

/* Formål: ErrorControlleren har til opgave at håndtere alle fejl i programmet
 * Input : this.debug er en del af settings-objektet, som kommer fra serverSettings.js i roden oprindeligt
 *                    den bestemmer om erroren skal console.logges.
 *         @errorObj indeholder det errorobjekt som skal behandles
 */
class ErrorController {
  constructor(errorObj) {
    this.debug = serverSettings.debug;
    this.error = errorObj;
    if (this.debug) {
      console.log(errorObj);
    }
  }

  /* Formål: At producere en fejlmeddelelse som brugeren kan forstå
   * Output: En tekststreng med en passende fejlmeddelelse til brugeren
   */
  produceErrorMessageToUser() {
    let errorMsg = ``;
    // RegExen læser alt frem til det første kolon den finder, da SQL-error-beskeder ser ud på formen: "ERROR_CODE: Because.... "
    const errorType = this.error.code || /^[^:^ ]+/.exec(this.error.message)[0] || `UNKNOWN_ERROR`;
    switch (errorType) {
      /* LOGIN FEJL */
      case `USER_ALREADY_REGISTERED`:
        errorMsg = `Brugeren er allerede registreret.`;
        break;
      case `USER_NOT_EXISTING`:
        errorMsg = `De brugeroplysninger du har indtastet findes ikke, prøv igen!`;
        break;

      /* DATABASE FEJL */
      case `ER_PARSE_ERROR`: case `ER_BAD_FIELD_ERROR`:
        errorMsg = `Lad lige være med at bruge fjollede bogstaver.`;
        break;
      case `ER_DATA_TOO_LONG`: {
        // RegExen tager alt mellem single quotes i beskeden: "Data too long for column 'EVALUATION_TITLE' at row 1"
        const columnName = /'(.*?)'/.exec(this.error.sqlMessage)[0].toLowerCase().replace(`_`, ` `) || ``;
        errorMsg = `Dit input i feltet ${columnName} er desværre for langt. Gør det kortere og prøv igen.`;
        break;
      }

      /* PARSE.SQL FEJL */
      case `NO_ELEMENTTYPE`:
        errorMsg = `Vi beklager. Den data du forsøger at hente er ugyldig.`;
        break;

      case `UNKNOWN_ERROR`: default:
        errorMsg = `Whoops. Noget gik galt.\nPrøv igen senere.\n\n`
                 + `Hvis fejlen bliver ved med at forekomme, så kontakt venligst supporten og oplys fejlkoden ${this.error.errno || `42`}.`;
        break;
    }

    return errorMsg;
  }
}

module.exports = {
  ErrorController,
};
