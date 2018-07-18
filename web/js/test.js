// $ npm install -g browserify
var platform = require('platform');

//console.log(platform.name);

// $ browserify test.js -o bundle.js

function getSystemDetails() {
    console.log(platform.name);
}
