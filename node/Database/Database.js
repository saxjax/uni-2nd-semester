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
  }

  info() {


    return false;
  }

  parser(method,columns,data) {
    let sql = ``;
    switch(method) {
      case `get`:
        if(data === undefined) {
          sql = `SELECT ${columns} FROM ${this.table}`;
        }
        else {
          sql = `SELECT ${columns} FROM p2.${this.table} WHERE ${data}`;
        }
        break;
      case `post`:
        sql = `INSERT INTO ${this.table} (${columns}) VALUES (${data})`;
        break;
    }

    return sql;
  }

  get(columns, data) {
    this.sql = this.parser(`get`,columns,data);
    return new Promise((resolve, reject) => {
      this.connect.query(this.sql,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-data the error \n${error.code} 
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
  post(columns,data) {
    this.sql = this.parser(`post`,columns,data);
    return new Promise((resolve, reject) => {
      this.connect.query(`INSERT INTO ${table}${queries} VALUES ${objects}`,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-data the error \n${error.code} 
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
            console.log(`Here at node/Database/Database.js-data the error \n${error.code} 
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
            console.log(`Here at node/Database/Database.js-data the error \n${error.code} 
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
