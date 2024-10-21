export const createTableSQL =
  "create table books (id integer primary key autoincrement, title text unique)";
export const insertBookSQL = "insert into books (title) values (?)";
export const invalidInsertBookSQL =
  "insert into invalidtable (title) values (?)";
export const selectBookSQL = "select * from books";
export const invalidSelectBookSQL = "select * from invalidtable";
export const dropTableSQL = "drop table books";
