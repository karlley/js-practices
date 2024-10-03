const createTableSQL = `CREATE TABLE Books
                        (
                            id    INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT UNIQUE
                        )`;
const insertBookSQL = `INSERT INTO Books (title)
                       VALUES (?)`;
const invalidInsertBookSQL = `INSERT INTO InvalidTable (title)
                              VALUES (?)`;
const selectBookSQL = `SELECT *
                       FROM Books`;
const invalidSelectBookSQL = `SELECT *
                              FROM InvalidTable`;
const dropTableSQL = `DROP TABLE Books`;

export {
  createTableSQL,
  insertBookSQL,
  invalidInsertBookSQL,
  selectBookSQL,
  invalidSelectBookSQL,
  dropTableSQL,
};
