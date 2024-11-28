export const createTableQuery =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE)";
export const insertQuery = "INSERT INTO books (title) VALUES (?)";
export const invalidInsertQuery =
  "INSERT INTO invalid_table (title) VALUES (?)";
export const selectQuery = "SELECT * FROM books";
export const invalidSelectQuery = "SELECT * FROM invalid_table";
export const dropTableQuery = "DROP TABLE books";
