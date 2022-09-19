// 'use strict'  Used for creating dir/data.json file
const fs = require('fs');
const { convert } = require('html-to-text');
const axios = require("axios");
const cheerio = require("cheerio");
var path = require('path');
const { paths } = require("./paths.js");
// let dir = path.dirname(path.dirname(__dirname));
// let dir = 'C:/Users/sg797751/Desktop/GIt';
// let file_relative_path = path.join('University at Albany - SUNY','Script Repository - Documents','JSON.json');
var directory = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/dir';
// let file_abs_path = path.join(dir, file_relative_path);

const dataFile = paths.data;
const JSONFile = paths.JSON;

let file = fs.readFileSync(JSONFile);

let rawdata = JSON.parse(file);
let Programs = rawdata.Programs;
let data = [];

async function main(){
    for(let iter of Programs){
        let Solicitation = await mapSolicitation(iter);
        data.push(Solicitation);
    }
    fs.writeFileSync(dataFile,JSON.stringify(data));
}

async function mapSolicitation(entry){
    let solicitation = {};
    let temp = entry.hasOwnProperty("objective")? convert(entry.objective, { wordwrap: null  }) : "" + " " + entry.hasOwnProperty("synopsis")? convert(entry.synopsis, { wordwrap: null  }) : "";
    // solicitation["synopsis"] = entry.hasOwnProperty("synopsis")? convert(entry.synopsis, { wordwrap: null  }) : "";
    solicitation["synopsis"] = temp;
    solicitation["id"] = entry.hasOwnProperty("id")? entry.id : "";
    solicitation["programurl"] = entry.hasOwnProperty("programurl")? entry.programurl : "";
    solicitation["prog_title"] = entry.hasOwnProperty("prog_title")? entry.prog_title : "";
    solicitation["total_funding_limit"] = entry.hasOwnProperty("total_funding_limit")? entry.total_funding_limit : "";
    solicitation["keyword"] = entry.hasOwnProperty("keyword")? entry.keyword : [];
    if(solicitation.programurl != null){
        let abc = await textScrape(solicitation.programurl);
        solicitation["url_mining"] = abc;
    }
    return solicitation;
}

async function textScrape(url){
    // console.log(url);
    try{
        const response = await axios.get(url);
        // console.log(response);
        const $= await cheerio.load(response.data);
        const data = await $("p").text();
        // console.log("1 " +data);
        if(data){
            // console.log("3 "+ data);
            console.log("req success");
            return data;
            
        }
    }
    catch(error){
        console.error(error.data);
        console.error(error.message);
        // console.error(error);
    }
}

main();