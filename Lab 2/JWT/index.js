const express = require("express");
const http = require("http");
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fs = require("fs");
const secret = "$329239dksdkdjkw"

const app = express();
const response = (status, message, data=undefined) => {
  return { status, message, data };
}
app.use(bodyParser.json());

const conntectionInfo = {
    host: "127.0.0.1",
    port: 5432,
    database: "jwtDB",
    user: 'postgres',
    password: 'pass',
};

var Sequelize = new sequelize('jwtDB', 'postgres', 'pass', {
    host: '127.0.0.1',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

Sequelize
  .authenticate()
  .then(function (err) {
    console.log('Connection works');
  })
  .catch(function(err) {
    console.log('Connection does not work', err);
  });
    http.createServer(app).listen(3000);

    // This endpoint must be publicly-accessible
    app.post('/register', (req, res) => {
      const email = req.body.email;
      const password = req.body.password;
      const username = req.body.username;
      const insert = "INSERT INTO users (email, password, username) VALUES \
        (:email, crypt(:password, gen_salt('bf', 8)), :username);";
        Sequelize.query(insert, { replacements: { email, password, username }, type: sequelize.QueryTypes.INSERT }).then(() => {
        res.json({})
      })
    });

  /*  app.post('/login', (req, res) => {
      const email = req.body.email;
      const password = req.body.password;
      const user = {
      email1: email,
      password1: password
  }
      const query = 'SELECT * FROM users WHERE email = lower(:email) AND \
        password = crypt(:password, password);';
        req.app.get('db').query(query, { replacements: { email, password } })
        .then((result) => {
          if (result[0].length == 0) {
            res
            .status(401)
            .json(response('Failed', 'Incorrect password or email'))
          } else {
            jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
              res.json({
                token
                });
            const token = auth.generateToken(result[0][0])
            res.send(response('Sucess', 'Successful Authentication', {
              'token': token
            }))
          }
        })
        .catch(() => {
          res
            .status(401)
            .json(response('Failed', 'Incorrect password or email'))
        });
    });

    // This endpoint is publicly-accessible (by choice)
    app.get("/products/:id", (req, res) => {
        req.app.get('db')
            .query("select * from products where id = $1", [req.params.id])
            .then(items => {
                res.json(items);
            })
            .catch(error => res.status(400).send(error));
    });

    // This endpoint must be protected with authentication
    app.post("/products", authenticate, (req, res) => {
        // Not actually implemented
        res.status(200).send("Successfully authenticated");
    });*/


// Authentication middleware for protected endpoints
function authenticate(req, res, next) {
    /*
     * The steps for completing this function are as follows:
     *
     *  1. Extract the authorization header from req.headers
     *  2. The needs to be of the form:
     *         BEARER JWT-TOKEN
     *  3. Parse the authorization header to extract the value of JWT-TOKEN
     *  4. Call the jwt.verify() function passing this and the public key
     *  5. If they match then call next(), otherwise respond with a 401
     */
    // YOUR CODE GOES HERE
}
