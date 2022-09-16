//For creating a new json file with objects of structure key:value = id:allInfo
const fs = require('fs');
var path = require('path');
const { paths } = require('../js/paths');
var directory = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/dir';
let dictJson =JSON.parse(fs.readFileSync( paths.JSON)).Programs; 
// JSON.parse(fs.readFileSync('data/JSON.json'));

// console.log(dictJson);
var dict = new Object();
const newJsonpath=paths.newJsonPath;
for(var i=0;i<dictJson.length;i++){
    // console.log("//////////////////",dictJson[i].id);
    dict[dictJson[i].id] = dictJson[i];
}
fs.writeFileSync(newJsonpath,JSON.stringify(dict));