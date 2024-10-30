export const createTableSQL =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE)";
export const insertBookSQL = "INSERT INTO books (title) VALUES (?)";
export const invalidInsertBookSQL =
  "INSERT INTO invalid_table (title) VALUES (?)";
export const selectBookSQL = "SELECT * FROM books";
export const invalidSelectBookSQL = "SELECT * FROM invalid_table";
export const dropTableSQL = "DROP TABLE books";
