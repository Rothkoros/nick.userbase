const express = require("express");
const path = require("path");
const { v4: uuid } = require("uuid");
const User = require("./user.js");

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
client.connect();

const createTableString = `
CREATE TABLE IF NOT EXISTS users (
  id varchar(50),
  first_name varchar(50),
  last_name varchar(50),
  email varchar(50),
  birth_date varchar(10),
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
app.set("view engine", "pug");
app.set("views", viewsFolder);
app.use(express.static(viewsFolder));

// URLs
app.get("/", (req, res) => {
  res.render("newuser", {});
});

app.post("/addUser", (req, res) => {
  console.log(req.body);
  if ("Create" in req.body) {
    console.log("Creating");
    const newUser = new User(
      uuid(),
      req.body.FirstName,
      req.body.LastName,
      req.body.Email,
      req.body.Birthday,
      req.body.Password
    );
    client.query(
      "INSERT INTO users(id, first_name, last_name, email, birth_date, password) VALUES($1, $2, $3, $4, $5, $6)",
      [
        newUser.id,
        newUser.firstName,
        newUser.lastName,
        newUser.email,
        newUser.birthDate,
        newUser.password,
      ],
      (err, response) => {
        if (err) throw err;
        else {
          res.render("results", { userData: response.rows[0] });
        }
      }
    );
  } else if ("Update" in req.body) {
    console.log("Updating");
    const updateQuery = {
      text: `UPDATE users
              SET first_name = $1, last_name = $2, email = $3, birth_date = $4
              WHERE
                  password = $5;`,
      values: [
        req.body.FirstName,
        req.body.LastName,
        req.body.Email,
        req.body.Birthday,
        req.body.Password,
      ],
    };
    client.query(updateQuery, (err, response) => {
      if (err) throw err;
      res.render("results", { userData: response.rows[0] });
    });
  } else if ("Search" in req.body) {
    console.log("Searching");
    const searchQuery = {
      text: `SELECT * FROM users
                WHERE
                  first_name = $1
      `,
      values: [req.body.FirstName],
    };
    client.query(searchQuery, (err, response) => {
      if (err) throw err;
      console.log("RESPONSE.ROWS", response.rows[0]);
      res.render("results", { userData: response.rows[0] });
    });
  }
});

app.listen(app.get("port"), () =>
  console.log(`App listening on port ${app.get("port")}!`)
);
