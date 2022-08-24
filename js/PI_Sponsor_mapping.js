const { paths } = require("./paths.js");
let xlsx = require('node-xlsx');
let file = xlsx.parse(paths.Proposals_csv);
console.log(file[0].data);