/* eslint no-console: 0 */

class ErrorController {
  produceErrorMessageToUser(errorObj) {
    let errorMsg = ``;
    const errorType = this.getErrorType(errorObj);

    switch (errorType) {
      case `ER_DUP_ENTRY`:
        errorMsg = `Please do not enter duplicate keywords`; break;
      default:
        errorMsg = `Whoops. Something went wrong.`; break;
    }

    return errorMsg;
  }

  getErrorType(errorObj) {
    try {
      const regExp = /\w+/;
      const error = regExp.exec(errorObj.message.toString());
      const errorType = error[0];
      return errorType;
    }
    catch (error) {
      console.log(`getErrorType() in ErrorController failed. With error:`, error);
      return undefined;
    }
  }
}

module.exports = {
  ErrorController,
};
