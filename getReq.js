axios = require('axios')
const fs = require('fs');
var url = "https://spin.infoedglobal.com/Keywords/MillerList";
const response = axios.get(url);
response.then(data=>{
    console.log(data.data);
    fs.writeFileSync('abc.json',JSON.stringify(data.data));
})

