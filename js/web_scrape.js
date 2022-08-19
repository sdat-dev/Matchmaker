const axios = require("axios");
const cheerio = require("cheerio");
// require('follow-redirects').maxRedirects = 1000;

// const url = "https://spin.infoedglobal.com/Program/Detail/107222";
const url = "https://www.netl.doe.gov/business/crada/crada.html";

async function textScrape(){
    try{
        const response = await axios.get(url);
        const $=cheerio.load(response.data);
        const data = $("p").text();
        console.log(data);
    }
    catch(error){
        console.error(error);
    }
}

textScrape();