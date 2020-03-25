/* eslint no-console: off */
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
    this.table = `database`;
    this.optionalValue = `optionalValue`
    this.query = `username=${this.username}`;
  }

  info() {


    return false;
  }

  parser(method,choice,query) {
    const sql;
    switch(method) {
      case `get`:
        if(query === undefined) {
          sql = `SELECT ${choice} FROM ${this.table}`
        }
        else {
          sql = `SELECT ${choice} FROM ${this.table} WHERE ${query}`
        }
      case `post`:
    }

    return sql;
  }

  get(choice, query) {
    this.sql = this.parser(`get`,choice,query);
    return new Promise((resolve, reject) => {
      this.connect.query(this.sql,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-query the error \n${error.code} 
            \nand ${error.stack} should be saved in the Database`);
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }

  /* Virker ikke endnu */
  post(choice,query) {
    this.sql = this.parser(`post`,choice,query);
    return new Promise((resolve, reject) => {
      this.connect.query(`INSERT INTO ${table}${queries} VALUES ${objects}`,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-query the error \n${error.code} 
            \nand ${error.stack} should be saved in the Database`);
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }

  /* Virker ikke endnu */
  put(table, queries, objects) {
    return new Promise((resolve, reject) => {
      this.connect.query(`DOESNT WORK ${table}${queries}${objects}`,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-query the error \n${error.code} 
            \nand ${error.stack} should be saved in the Database`);
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }

  /* Virker ikke endnu */
  delete(table, queries, objects) {
    return new Promise((resolve, reject) => {
      this.connect.query(`DOESNT WORK ${table}${queries}${objects}`,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-query the error \n${error.code} 
            \nand ${error.stack} should be saved in the Database`);
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }
}


module.exports = {
  Database,
};
