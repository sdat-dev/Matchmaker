// 'use strict'
const fs = require('fs');
const { convert } = require('html-to-text');
let dictJson = JSON.parse(fs.readFileSync('dir/dict.json'));
var path = require('path');
const natural = require('natural')
const TfIdf = natural.TfIdf;
var directory = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/Data_ram';
var dict = new Object();
let file_abs_path = path.join(directory, 'output.json');
let file = fs.readFileSync(file_abs_path);
let mySet = new Set();
var noOfKeywords = 50;

let data = JSON.parse(file);

async function main(){
    populateSet();

    for (const [key, value] of Object.entries(data)){
        var dictVal = getScoreFromJson(JSON.stringify(value.content),noOfKeywords);
        dict[key] = dictVal;
    }
    
    // Uncomment below
    fs.writeFileSync(path.join(directory, 'dict.json'),JSON.stringify(dict));
    // console.log(dict);
    // mostUsedWords(dict);

    
    // result[text] = checkSimilarity(text,dictJson)
    // console.log(result)
}

function getScoreFromJson(file,noOfKeywords){
    var dict = new Object();
    const tfidf = new TfIdf();
    tfidf.addDocument(file);
    tfidf.listTerms(0 /*document index*/).every(function(item) {
        if(noOfKeywords<=0){
            return false;
        }
        let isnum = /^\d+$/.test(item.term);
        if(!isnum && !mySet.has(item.term)){
            dict[item.term] = item.tfidf.toFixed(3);
            noOfKeywords--;
            // console.log(item.term + ': ' + item.tfidf);
        }
        return true;
    });
    // console.log(dict);
    return dict;
}

function mostUsedWords(dict) {      //Pass a dictionary Object containing dictionary Objects as Values and opp ID as keys and get all the words and their cumulative TF-IDF from the input
    var muw = new Object();
    for (const [key1] of Object.entries(dict)) {
        for (const [key, value] of Object.entries(dict[key1])) {
            if( Object.keys(muw).indexOf(key) == -1 ){
                muw[key] = Number(value);
            }else{
                muw[key] += Number(value);
            }
        }
    }
    for (const [key] of Object.entries(muw)){
        if(muw[key] <= 10){
            delete muw[key];
        }
    }
    fs.writeFileSync(path.join(directory, 'overall.json'),JSON.stringify(muw));
}

function populateSet() {
    mySet.add("research");
    mySet.add("grants");
    mySet.add("synopsis");
    mySet.add("purpose");
    mySet.add("funding");
    mySet.add("opportunity");
    mySet.add("announcement");
    mySet.add("foa");
    mySet.add("https");
    mySet.add("available");
    mySet.add("funds");
    mySet.add("related");
    mySet.add("specific");
    mySet.add("among");
    mySet.add("data");
    mySet.add("new");
    mySet.add("award");
    mySet.add("grant");
    mySet.add("small");
    mySet.add("basic");
    mySet.add("may");
    mySet.add("include");
    mySet.add("better");
    mySet.add("not");
    mySet.add("studies");
    mySet.add("goal");
    mySet.add("within");
    mySet.add("id");
    mySet.add("programurl");
    mySet.add("prog_title");
    mySet.add("will");
    mySet.add("centers");
    mySet.add("including");
    mySet.add("allowed");
    mySet.add("www");
    mySet.add("understanding");
    mySet.add("use");
    mySet.add("institute");
    mySet.add("institutes");
    mySet.add("html");
    mySet.add("directly");
    mySet.add("awards");
    mySet.add("program");
    mySet.add("programs");
    mySet.add("agency");
    mySet.add("co");
    mySet.add("study");
    mySet.add("notice");
    mySet.add("proposals");
    mySet.add("dm");
    mySet.add("programs");
    mySet.add("programs");
    mySet.add("programs");
    mySet.add("programs");
}

main();