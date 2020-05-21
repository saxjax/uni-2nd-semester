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
    const errorType = /^[^:]+/.exec(this.error.message)[0];
    switch (errorType) {
      /* LOGIN FEJL */
      case `USER_ALREADY_REGISTERED`:
        errorMsg = `Brugeren er allerede registreret. Du kan allerede logge ind med den.`;
        break;
      case `USER_NOT_EXISTING`:
        errorMsg = `De brugeroplysninger du har indtastet findes ikke, prøv igen!`;
        break;

      /* DATABASE FEJL */
      case `ER_PARSE_ERROR`: case `ER_BAD_FIELD_ERROR`:
        errorMsg = `Lad lige være med at bruge fjollede bogstaver.`;
        break;

      default:
        errorMsg = `Whoops. Noget gik galt.\nPrøv igen senere.`;
        break;
    }

    return errorMsg;
  }
}

module.exports = {
  ErrorController,
};
