// 'use strict'
const fs = require('fs');
const { convert } = require('html-to-text');
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");
let dictJson = JSON.parse(fs.readFileSync('dir/dict.json'));
var path = require('path');
const natural = require('natural')
const TfIdf = natural.TfIdf
var directory = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/dir';
let fileNames = getFilesFromDir(directory);
var dict = new Object();
// let dir = path.dirname(path.dirname(__dirname));
let dir = 'C:/Users/sg797751/Desktop/GIt';
let file_relative_path = path.join('University at Albany - SUNY','Script Repository - Documents','JSON.json');
let file_abs_path = path.join(dir, file_relative_path);
let file = fs.readFileSync(file_abs_path);
let mySet = new Set();
var noOfKeywords = 50;

let rawdata = JSON.parse(file);
let Programs = rawdata.Programs;
let data = [];

var text = "The purpose of this Funding Opportunity Announcement (FOA) is to support studies to investigate mechanisms by which the gut microbiome and gut immune system modulates the brain functions, circuits, neurotransmitters, signaling pathways and synaptic plasticity in the context of HIV and Anti-retroviral therapy. Exploratory and high-risk research projects are encouraged. Basic, preclinical, and clinical (e.g., pathophysiology or mechanisms) research in domestic and international settings are of interest. No clinical trials will be accepted for this FOA. Multidisciplinary research teams and collaborative alliances are encouraged but not required. In the United States and globally, Central Nervous System (CNS) comorbidities associated with HIV including neurologic, neurocognitive, and mental health problems continue to persist in people living with HIV (PWH) despite effective antiretroviral therapy (ART). Considerable gaps exist in the understanding of CNS comorbidities associated with HIV in the context of ART. Recent studies have shown gut microbiota and gut immune system can alter brain development, neurotransmitter systems, signaling pathways, synaptic related proteins, and modulate behavior. From early stages of infection, HIV alters the gut immune system and the gut microbiome (dysbiosis) resulting in immune dysfunction as well as higher levels of systemic inflammation. ART does not completely reverse the impact of HIV on the gut immune system and the microbiome. To date there is a paucity of studies looking at unique pathways and mechanisms of gut microbiome and gut-related immune dysregulation impacting CNS-related outcomes in PWH. An enhanced understanding of mechanisms underlying gut microbiome-immune-CNS interactions may provide novel insights into CNS comorbidities observed in PWH.";
var result = new Object();
var arr = []

main();


async function main(){
    populateSet();
    for(let iter of Programs){
        let Solicitation = await mapSolicitation(iter);
        data.push(Solicitation);
    }
    // Programs.forEach(async function(entry){
    //     let Solicitation = await mapSolicitation(entry);
    //     data.push(Solicitation);
    // });
    
    fs.writeFileSync(path.join(directory, 'data.json'),JSON.stringify(data));
    
    for(var i=0;i<data.length;i++){
        // if(data[i].id == '100239'){
        //     console.log(data[i])
        // }
        var dictVal = getScoreFromJson(JSON.stringify(data[i]),noOfKeywords);
        dict[data[i].id] = dictVal;
    }
    
    // for(var i=0;i<fileNames.length;i++){
    //     var dictVal = getScoreFromPath(fileNames[i],noOfKeywords);
    //     dict[fileNames[i]] = dictVal;
    // }
    // Uncomment below
    fs.writeFileSync(path.join(directory, 'dict.json'),JSON.stringify(dict));
    // console.log(dict);
    // mostUsedWords(dict);

    
    // result[text] = checkSimilarity(text,dictJson)
    // console.log(result)
}

async function mapSolicitation(entry){
    let solicitation = {};
    // solicitation["synopsis"] = entry.hasOwnProperty("synopsis")? convert(entry.synopsis, { wordwrap: null  }) : "";
    solicitation["synopsis"] = entry.hasOwnProperty("objective")? convert(entry.objective, { wordwrap: null  }) : "";
    solicitation["id"] = entry.hasOwnProperty("id")? entry.id : "";
    solicitation["programurl"] = entry.hasOwnProperty("programurl")? entry.programurl : "";
    solicitation["prog_title"] = entry.hasOwnProperty("prog_title")? entry.prog_title : "";
    if(solicitation.programurl != null){
        let abc = await textScrape(solicitation.programurl);
        solicitation["url_mining"] = abc;
    }
    return solicitation;
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

function getScoreFromPath(filePath,noOfKeywords){
    var dict = new Object();
    const tfidf = new TfIdf();
    tfidf.addFileSync(filePath);
    tfidf.listTerms(0 /*document index*/).every(function(item) {
        if(noOfKeywords<=0){
            return false;
        }
        dict[item.term] = item.tfidf.toFixed(3);
        noOfKeywords--;
        // console.log(item.term + ': ' + item.tfidf);
        return true;
    });
    // console.log(dict);
    return dict;
}

function getFilesFromDir(dirPath) {
    var files = fs.readdirSync(dirPath);
    var arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        let fileLocation = path.join(dirPath, file);
        if (fs.statSync(fileLocation).isDirectory()) {
            arrayOfFiles = getFilesFromDir(fileLocation)
        } 
        else {
            if(['.txt', '.TXT', '.doc','.DOC','.docx','.DOCX'].indexOf(path.extname(fileLocation)) != -1){
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    })
    return arrayOfFiles;
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

function getScoreFromText(text) {
    var dict = new Object();
    const tfidf = new TfIdf();
    tfidf.addDocument(text);
    tfidf.listTerms(0 /*document index*/).every(function(item) {
        if(noOfKeywords<=0){
            return false;
        }
        let isnum = /^\d+$/.test(item.term);
        if(!isnum && !mySet.has(item.term)){
            dict[item.term] = item.tfidf.toFixed(3);
            noOfKeywords--;
        }
        return true;
    });
    return dict;
}

function intersection(o1, o2) {
    return Object.keys(o1).filter({}.hasOwnProperty.bind(o2)).length;
}

function checkSimilarity(lhs,rhs) {
    var dct = getScoreFromText(lhs);
    result[lhs] = new Object();
    var max=0;
    // console.log(dct)
    // console.log(rhs)

    for (var opportunity in rhs) {
        var value = rhs[opportunity];
        cmnCount = intersection(dct, value);
        // console.log(value)
        if(cmnCount>max)
            max=cmnCount
        if(cmnCount>3){
            var url = "https://spin.infoedglobal.com/Program/Detail/"+opportunity;
            result[lhs][opportunity] = new Object();
            result[lhs][opportunity].link = url;
            result[lhs][opportunity].cmnCount = cmnCount;
            // console.log(url, " : ",cmnCount);
            arr.push(result[lhs][opportunity]);
        }
    }
    if(max==0){
        console.log("No similar abstracts found!")
    }else{
        
        console.log("The following abstracts found-->")
        // return result[lhs]
        arr.sort((a, b) => {
            return b.cmnCount - a.cmnCount;
        });
        return arr.slice(0, 5)
    }
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

async function textScrape(url){
    console.log(url);
    try{
        const response = await axios.get(url);
        // console.log(response);
        const $= await cheerio.load(response.data);
        const data = await $("p").text();
        // console.log("1 " +data);
        if(data){
            // console.log("3 "+ data);
            return data;
        }
    }
    catch(error){
        console.error(error.data);
        console.error(error.message);
        // console.error(error);
    }
}