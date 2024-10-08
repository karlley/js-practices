const runPromise = (db, sql, params = []) => {
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

const runMultiplePromise = (db, sql, params) => {
  const promises = params.map((param) => runPromise(db, sql, [param]));
  return Promise.all(promises);
};

const allPromise = (db, sql, params = []) => {
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

const closePromise = (db) => {
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
