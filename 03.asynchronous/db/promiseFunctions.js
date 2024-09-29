import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

const runPromise = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
};

const runMultiplePromise = (sql, params) => {
  const promises = params.map((param) => runPromise(sql, [param]));
  return Promise.all(promises);
};

const allPromise = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
};

const closePromise = () => {
  return new Promise((resolve, reject) => {
    db.close(function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
  });
};

export { runPromise, runMultiplePromise, allPromise, closePromise };
