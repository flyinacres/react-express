const express = require('express');
const path = require('path');
const db = require('./db');


const app = express();

db.getAll()
    .then((res) => console.log(res))
    .catch(err => console.error(err));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// An api endpoint that returns a short list of registration items
app.get('/api/getInitialData', (req,res) => {
    var list = [
        {id: 1, name:"a", age:29, qualification:"B.Com",rating:3,gender:"male",
            city:"Kerala",skills:["reactjs","angular","vuejs"]},
        {id: 2, name:"b", age:35, qualification:"B.Sc",rating:5,gender:"female",
            city:"Mumbai",skills:["reactjs","angular"]},
        {id: 3, name:"c", age:42, qualification:"B.E",rating:3,gender:"female",
          city:"Bangalore",skills:["reactjs"]},
      ];
    res.json(list);
    console.log('Sent data');
});

// An api endpoint that returns a short list of registration items
app.get('/api/getModelData', (req,res) => {
    var model=[
        {key: "name", label: "Name", props: {required: true}},
        {key: "age",label: "Age", type: "number"},
        {key: "rating",label: "Rating", type: "number", props:{min:0,max:5}},      
        {key: "qualification",label: "Qualification"}
      ];
    res.json(model);
    console.log('Sent model');
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

