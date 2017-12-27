const db = require('./dataBase');

const res = {
  json: (object) => console.log(JSON.stringify(object)),
};

const req = {
  body: {
    token: '852e45b9457e1add5eae51b5dac6fb8612631441'
  }
};

const title = 'a,b,c'.split(',');
console.log(title);
