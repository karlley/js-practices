#!/usr/bin/env node
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");
const titles = ["書籍1", "書籍2", "書籍3"];

const createTable = () => {
  db.run(
    `CREATE TABLE Books
         (
             id    INTEGER PRIMARY KEY AUTOINCREMENT,
             title TEXT UNIQUE
         )`,
    () => {
      console.log("created table");
      insertRecords(titles);
    },
  );
};

const insertRecords = (titles, index = 0) => {
  if (titles.length === index) {
    console.log("inserted record");
    getRecords();
    return;
  }

  db.run(
    `INSERT INTO Books (title)
         VALUES (?)`,
    [titles[index]],
    function () {
      console.log(this.lastID);
      insertRecords(titles, index + 1);
    },
  );
};

const getRecords = () => {
  db.all(
    `SELECT *
         FROM Books`,
    function (error, results) {
      displayRecords(results);
    },
  );
};

const displayRecords = (records) => {
  records.forEach((row) => {
    console.log(`ID: ${row.id} Title: ${row.title}`);
  });
  deleteTable();
};

const deleteTable = () => {
  db.run(`DROP TABLE Books`, function () {
    console.log("deleted table");
    db.close();
  });
};

function main() {
  createTable();
}

main();
