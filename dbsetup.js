const express = require('express');
const db = require('./db');


const app = express();

db.createTable()
.then((res) => {
    console.log("In then() clause--table creation should be done");
    db.addOne({id: 1, name:"Roger Rabbit", age:29, qualification:"B.Com",rating:3,gender:"male",
    city:"San Francisco",skills:"node.js"})
       .then((res) => 
            console.log(res))
       .catch(err => 
            console.error(err));
    db.addOne({id: 2, name:"Lisa Loeb", age:23, qualification:"C.Com",rating:3,gender:"female",
       city:"Palo Alto",skills:"react"})
          .then((res) => console.log(res))
          .catch(err => console.error(err));  
    db.addOne({id: 3, name:"Dom Perignon", age:53, qualification:"D.Com",rating:3,gender:"male",
        city:"Arnold",skills:"python"})
            .then((res) => console.log(res))
            .catch(err => console.error(err));       
    db.addOne({id: 4, name:"Pat That", age:44, qualification:"E.Com",rating:3,gender:"unspecified",
        city:"Walnut Creek",skills:"java"})
            .then((res) => console.log(res))
            .catch(err => console.error(err));            
    })
  .catch((err) => {
    console.log(err);
  })
  .finally (() => {
      db.closePool();
  });

