const fs = require('fs/promises')

const x = require('./scopusjson/scopus.json')
const y = require('./scopusjson/scopus2.json')
// const z = require('./scopusjson/scopus3.json')
// const a = require('./scopusjson/scopus4.json')
// const b = require('./scopusjson/scopus5.json')

const scppus_jsons =async () =>{
//finalJson = [...x['Sheet1'],...y['Sheet1'],...z['Sheet1'],...a['Sheet1'],...b['Sheet1']]
finalJson = [...x['Sheet1'],...y['Sheet1']]
console.log(finalJson)
await fs.writeFile(`${__dirname}/final.json`, JSON.stringify(finalJson));
}

;(async () => {
    await scppus_jsons()
  })();