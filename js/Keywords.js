// 'use strict'
const fs = require('fs');
var path = require('path');
const { paths } = require("./paths.js");
const axios=require('axios');
const OriginalSPIN_keysFile = paths.OriginalSPIN_keys;
const SPIN_KeywordsFile = paths.SPIN_Keywords;

const getSPINKeyWordsdata=async()=>{

    let results=await axios.get('https://spin.infoedglobal.com/Keywords/MillerList');
    // console.log(results.data);
    fs.writeFileSync(OriginalSPIN_keysFile,JSON.stringify(results.data));
    console.log("first");


// var directory = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/JSONs';
// let file_abs_path = path.join(directory, 'OriginalSPIN_keys.json');     //Get the file from https://spin.infoedglobal.com/Keywords/MillerList



let file = fs.readFileSync(OriginalSPIN_keysFile);
console.log("second");
let data = JSON.parse(file);

let object = {};
let l1 = {};
let l2 = {};
let l3 = {};
for(var i=0;i<data.length;i++){
    var key = data[i].value;

    var lvl1 = data[i].value.substring(0,2);
    var lvl2 = data[i].value.substring(2,4);
    var lvl3 = data[i].value.substring(4,7);

    // if(data[i].text == "Control Engineering"){
    //     console.log("data[i].value : ",data[i].value,"\nlevel1 : ",lvl1,"\nlvl2 : ",lvl2,"\nlvl3 : ",lvl3);
    // }

    object[key] = new Object();
    object[key].text = data[i].hasOwnProperty("text")? data[i].text : "";
    // object[key].value = data[i].hasOwnProperty("value")? data[i].value : "";
    object[key].level1 = lvl1;
    object[key].level2 = lvl2;
    object[key].level3 = lvl3;
    // object[key].leaflevel = data[i].hasOwnProperty("leaflevel")? data[i].leaflevel : "";
    // object[key].has_children = data[i].hasOwnProperty("has_children")? data[i].has_children : "";

    if(object[key].level3 == 0){
        if(object[key].level2 == 0){
            l1[lvl1] = new Object();
            l1[lvl1].text = object[key].text;
        }else{
            var temp = ""+lvl1+lvl2;
            // console.log(lvl1+" + "+lvl2+" = "+temp);
            l2[temp] = new Object();
            l2[temp].text = object[key].text;
            l2[temp].lvl1 = object[key].level1;
            l2[temp].lvl2 = object[key].level2;
        }
    }else{
        l3[key] = new Object();
        l3[key].text_level3 = object[key].text;
        l3[key].lvl1 = object[key].level1;
        l3[key].lvl2 = object[key].level2;
        l3[key].lvl3 = object[key].level3;
    }
}
// console.log(JSON.stringify(l3));
JSON.stringify(l1);
JSON.stringify(l2);
JSON.stringify(l3);

for (const [key, value] of Object.entries(l3)){
    temp = "" + l3[key].lvl1 + l3[key].lvl2;
    if(l2.hasOwnProperty(temp)){
        // console.log(l2[temp].text);
        l3[key].text_level2 = l2[temp].text;
    }
    if(l1.hasOwnProperty(l3[key].lvl1)){
        l3[key].text_level1 = l1[l3[key].lvl1].text;
    }
}

// console.log(JSON.stringify(l3));
let l3newdata = {};
for(const [key, value] of Object.entries(l3)){
    temp = l3[key].text_level3;
    l3newdata[temp] = new Object();
    l3newdata[temp].level2 = l3[key].text_level2;
    l3newdata[temp].level1 = l3[key].text_level1;
}

fs.writeFileSync(SPIN_KeywordsFile,JSON.stringify(l3newdata));

}

getSPINKeyWordsdata();