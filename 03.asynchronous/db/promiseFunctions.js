import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

const runPromise = (sql, params = [], callback = null) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) {
        if (callback) {
          callback(error);
        } else {
          reject(error);
        }
      } else {
        if (callback) {
          callback(null);
        } else {
          resolve(this);
        }
      }
    });
  });
};

const allPromise = (sql, params = [], callback = null) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (error, rows) {
      if (error) {
        if (callback) {
          callback(error);
        } else {
          reject(error);
        }
      } else {
        if (callback) {
          callback(null, rows);
        } else {
          resolve(rows);
        }
      }
    });
  });
};

const closePromise = (callback = null) => {
  return new Promise((resolve, reject) => {
    db.close(function (error) {
      if (error) {
        if (callback) {
          callback(error);
        } else {
          reject(error);
        }
      } else {
        if (callback) {
          callback(null);
        } else {
          resolve(null);
        }
      }
    });
  });
};

export { runPromise, allPromise, closePromise };
