/* eslint no-console: 0 */

class ErrorController {
  constructor(debug) {
    this.debug = debug;
  }

  produceErrorMessageToUser(errorObj) {
    if (this.debug) {
      console.log(errorObj);
    }

    let errorMsg = ``;
    // RegExen læser alt frem til det første kolon den finder, da SQL-error-beskeder ser ud på formen: "ERROR_CODE: Because.... "
    const errorType = /^[^:]+/.exec(errorObj.message)[0];
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
