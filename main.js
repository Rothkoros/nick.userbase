const express = require("express");
const path = require("path");
const User = require("./user.js");

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
client.connect().then(
  (response) => console.log("response", response),
  (err) => console.log("Client Connect Error", err)
);

const createTableString = `
CREATE TABLE IF NOT EXISTS users (
  id varchar(50),
  first_name varchar(50),
  last_name varchar(50),
  email varchar(50),
  birth_date varchar(8),
  password varchar(15)
);
`;

client.query(createTableString, (err) => {
  if (err) throw err;
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const viewsFolder = path.join(__dirname, "views");

app.set("port", process.env.PORT);
app.set("views", viewsFolder);
app.use(express.static(viewsFolder));

// URLs
app.get("/", (req, res) => {
  res.render("newuser.html", {});
});
