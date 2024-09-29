const createTableSQL = `CREATE TABLE Books
                        (
                            id    INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT UNIQUE
                        )`;
const insertBookSQL = `INSERT INTO Books (title)
                       VALUES (?)`;
const invalidInsertBookSQL = `INSERT INTO InvalidTable (title)
                              VALUES (?)`;
const fetchBookSQL = `SELECT *
                      FROM Books`;
const invalidFetchBookSQL = `SELECT *
                             FROM InvalidTable`;
const deleteTableSQL = `DROP TABLE Books`;

export {
  createTableSQL,
  insertBookSQL,
  invalidInsertBookSQL,
  fetchBookSQL,
  invalidFetchBookSQL,
  deleteTableSQL,
};
