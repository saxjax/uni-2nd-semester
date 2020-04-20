const { Model } = require(`./Model.js`);

class EvaluationElement extends Model {
  constructor() {
    super();
    this.table = null;
  }
}

module.exports = {
  EvaluationElement,
};
