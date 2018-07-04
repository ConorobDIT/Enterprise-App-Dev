//Conor O'Brien C14733295
const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'exampledb',
  user: 'postgres',
  password: 'pass',
}).then(instance => {
  app.set('db', instance);

  //Part 1:1
  app.get('/users', (req, res) => {
    req.app.get('db').query(
  "select * from users")
    .then(items => {
      res.json(items);
    });
  })
  //Part 1:2

  app.get('/users:id', (req, res) => {
    req.app.get('db').query(
  "select * from users where id = $1", [1])
    .then(items => {
      res.json(items);
    });
  })
  //Part 1:3
  app.get('/products', (req, res) => {
    req.app.get('db').query(
  "select title from products order by price asc")
    .then(items => {
      res.json(items);
    });
  })
//Part 1:4
  app.get('/products:id', (req, res) => {
    req.app.get('db').query(
  "select * from products where id = $1", [1])
    .then(items => {
      res.json(items);
    });
  })
//Part 1:5
  app.get('/purchases', (req, res) => {
    req.app.get('db').query(
  "select * from purchases")
    .then(items => {
      res.json(items);
    });
  })
//PART 2 Makes the app display all of the products by using the var id, 1 will always be 1 so it will always be true, therefore displaying everything
  app.get('/products/insertion', (req, res) => {
    var id = "23 OR 1=1";
    req.app.get('db').query(
  `select * from products where id = ${id}`)
    .then(items => {
      res.json(items);
    });
  })
//PART 3 Won't let it happen
  app.get('/products/safe', (req, res) => {
    var id = "23 OR 1=1";
    req.app.get('db').query(
  "select * from products where id = $1", [id])
    .then(items => {
      res.json(items);
    });
  })

  ;
});
http.createServer(app).listen(3000);
