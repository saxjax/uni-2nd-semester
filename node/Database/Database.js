const mysql = require(`mysql`);

class Database {
  constructor() {
    this.connect = mysql.createConnection({
      host: `213.32.247.201`,
      user: `ADMIN`,
      port: `3306`,
      password: `Admin123!`,
      database: `p2`,
    });
    }

  query(table,string,objects) {
    return new Promise((resolve, reject) => {this.connect.query(`${table}${string}`, objects,
      (error, result) => {
        if(error) {
          console.log(`Here at node/Database/Database.js-query the error \n${error.code} 
            \nand ${error.stack} should be saved in the Database`)
          reject(error);
        }
        else{
          resolve(result);
        }
      });
    });
  }
}

module.exports = {
    Database,
  };  
