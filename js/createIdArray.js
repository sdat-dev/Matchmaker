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

    let newTree3={}

    for(let [key,val] of Object.entries(dict2)){
        let c=0;
        for(let k=0;k<key.length;k++){
            if(key[k]=='/'){
                c+=1;
            }
        }
        if(c==1){
            let nk=key.split(" ")
            // console.log(nk);
            let comb1Arr=[];
            let comb2Arr=[];
            let slCom=[];
            for(let i of nk){
                if(i.indexOf('/')!=-1){
                    slCom=i.split("/");
                    // console.log(slCom);
                    comb1Arr.push(slCom[0]);
                    comb2Arr.push(slCom[1]);
                }
                else{
                    comb1Arr.push(i);
                    comb2Arr.push(i);
                   
                }
            }
            // console.log(key);
            // console.log(key,"==> ",comb1Arr.join(" "));
            // console.log(key,"==> ",comb2Arr.join(" "));
    
            newTree3[comb1Arr.join(" ")]=val;
            newTree3[comb2Arr.join(" ")]=val;
        }
        else{
            newTree3[key]=val;
        }
        
    }


    fs.writeFileSync(keyIdArrFile, JSON.stringify(newTree3));
    // console.log(dict);
    // mostUsedWords(dict);
    // result[text] = checkSimilarity(text,dictJson)
    // console.log(result)
}

main();