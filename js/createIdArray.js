// 'use strict'
const fs = require('fs');
var path = require('path');
const { paths } = require("./paths.js");
// var directory = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/dir';
// var directory2 = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/JSONs';
let dict2=new Object();

const dataFile = paths.data;
const SPIN_KeywordsFile = paths.SPIN_Keywords;
const keyIdArrFile = paths.keyIdArr;

// let file_abs_path = path.join(directory, 'data.json');
let file = fs.readFileSync(dataFile);

let data = JSON.parse(file);

let keyss=fs.readFileSync(SPIN_KeywordsFile)

const keys1=JSON.parse(keyss);
// console.log(keys1);

// console.log(keys1);

async function main() {
    for (var i = 0; i < data.length; i++) {
        
        for (const [key, value] of Object.entries(keys1)) {
            // console.log(`${key}`,data[i]);
            // break;
            if(data[i].keyword.includes(key)){
                  let tempArr=[];
                  if(dict2[key]){
                    tempArr=dict2[key];
                    tempArr.push(data[i].id);
                    dict2[key]=tempArr;
                  }
                  else{
                    tempArr.push( data[i].id);
                    dict2[key]=tempArr;
                }
            }
          }
       
        // add the logic here to iterate through keywords
        
}

    // Uncomment below
    fs.writeFileSync(keyIdArrFile, JSON.stringify(dict2));
    // console.log(dict);
    // mostUsedWords(dict);
    // result[text] = checkSimilarity(text,dictJson)
    // console.log(result)
}

main();