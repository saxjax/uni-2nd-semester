/* eslint no-console: 0 */

class ErrorController {
  produceErrorMessageToUser(errorObj) {
    let errorMsg = ``;
    // RegExen læser alt frem til det første kolon den finder, da SQL-error-beskeder ser ud på formen: "ERROR_CODE: Because.... "
    const errorType = /^[^:]+/.exec(errorObj.message)[0];
    switch (errorType) {
      case `USER_ALREADY_REGISTERED`:
        errorMsg = `Error: User is already registered.`;
        break;
      case `ER_PARSE_ERROR`:
        errorMsg = `Please do not use silly characters.`;
        break;
      default:
        errorMsg = `Whoops. Something went wrong.\nPlease try again later.`;
        break;
    }

    return errorMsg;
  }
}

module.exports = {
  ErrorController,
};
