const createTableSQL = `CREATE TABLE Books
                        (
                            id    INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT UNIQUE
                        )`;
const createBooksSQL = `INSERT INTO Books (title)
                        VALUES (?)`;
const invalidCreateBooksSQL = `INSERT INTO InvalidTable (title)
                               VALUES (?)`;
const getBooksSQL = `SELECT *
                     FROM Books`;
const invalidGetBooksSQL = `SELECT *
                            FROM InvalidTable`;
const deleteTableSQL = `DROP TABLE Books`;

export {
  createTableSQL,
  createBooksSQL,
  invalidCreateBooksSQL,
  getBooksSQL,
  invalidGetBooksSQL,
  deleteTableSQL,
};
