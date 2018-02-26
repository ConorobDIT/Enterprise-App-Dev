const express = require("express");
const http = require("http");
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fs = require("fs");
const secret = "$329239dksdkdjkw" //Random secret key.

const app = express();
const response = (status, message, data=undefined) => {
  return { status, message, data }; //Response for error messages
}
app.use(bodyParser.json());

var Sequelize = new sequelize('jwtDB', 'postgres', 'pass', { //Signing in with sequelize to the database
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
      const insert = "INSERT INTO users (email, password, username) VALUES \
        (:email, crypt(:password, gen_salt('bf', 8)), :username);";
        Sequelize.query(insert, { replacements: { email: [req.body.email], password: [req.body.password], username: [req.body.username] }, type: sequelize.QueryTypes.INSERT }).then(() => {
        res.json({message: "Successfully registered"}) 
      })
    });

  app.post('/login', (req, res) => {
      const query = 'SELECT * FROM users WHERE email = lower(:email) AND \
        password = crypt(:password, password);';
        Sequelize.query(query, { replacements: { email: [req.body.email], password: [req.body.password] }, type: sequelize.QueryTypes.SELECT })
        .then((result) => {
          if (result[0].length == 0) {
            res
            .status(401)
            .json(response('Failed', 'Incorrect password or email'))
          } else {
            const user = {email: [req.body.email], password: [req.body.password]};

            jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
              res.json({
                message: "Success, here is your token",
                token
                });
            })}
          })
        });

    // This endpoint is publicly-accessible (by choice)
    app.post("/products/:id", (req, res) => {
        Sequelize.query("select * from products where id = :id", {replacements: {id: [req.body.id]}, type: sequelize.QueryTypes.SELECT})
            .then(items => {
                res.json(items);
            })
            .catch(error => res.status(400).send(error));
    });

    // This endpoint must be protected with authentication
    app.post("/products", authenticate, (req, res) => {
          jwt.verify(req.token, 'secretkey', (err, authData) => {
          if(err) {
            res.sendStatus(403);
          } else {
            Sequelize.query(("select * from products"), {type: sequelize.QueryTypes.SELECT})
                .then(items => {
                    res.json(items);
            });
    }
  });
    });


// Authentication middleware for protected endpoints
function authenticate(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }}
