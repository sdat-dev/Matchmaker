//For creating a new json file with objects of structure key:value = id:allInfo
const fs = require('fs');
var path = require('path');
var directory = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/dir';
let dictJson = JSON.parse(fs.readFileSync('data/JSON.json'));
var dict = new Object();
for(var i=0;i<dictJson.length;i++){
    dict[dictJson[i].id] = dictJson[i];
}
fs.writeFileSync(path.join(directory, 'newJson.json'),JSON.stringify(dict));