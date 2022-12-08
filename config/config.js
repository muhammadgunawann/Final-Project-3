require("dotenv").config();


module.exports = {

    "development": {
      "username": "ahmad",
      "password": "password",
      "database": "db_tokoBelanja",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": process.env.PGUSER,
      "password": process.env.PGPASSWORD,
      "database": process.env.PGDATABASE,
      "host": process.env.PGHOST,
      "port": process.env.PGPORT,
      "dialect": "postgres"
    }
  }