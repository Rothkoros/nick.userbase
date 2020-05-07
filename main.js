const express = require("express");
const path = require("path");
const uuid = require("uuid/dist/v4");
const User = require("./user.js");

const { Client } = require("pg");

const client = new Client({
  connectionString: `postgres://biiwanfouocuwl:a603774577c80548dcfad3838b40246b1384b6c42813b8ce0360c1591bfb384f@ec2-54-165-36-134.compute-1.amazonaws.com:5432/d7c225schdj2m5`,
  ssl: false,
});
client.connect();

const createTableString = `
CREATE TABLE IF NOT EXISTS users (
  id varchar(50),
  firstName varchar(50),
  lastName varchar(50),
  email varchar(50),
  birthDate varchar(8),
  password varchar(15)
);
`;

// client.query(createTableString, (err) => {
//   if (err) throw err;
// });
client
  .query(createTableString)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const viewsFolder = path.join(__dirname, "views");

app.set("port", process.env.PORT || 3000);
app.set("views", viewsFolder);
app.use(express.static(viewsFolder));

// URLs
app.get("/", (req, res) => {
  res.render("newuser", {});
});
