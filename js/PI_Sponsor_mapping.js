const exceltojson = require("xls-to-json-lc");

const { paths } = require("./paths.js");
let xlsx = require('node-xlsx');
let file = xlsx.parse(paths.Proposals_csv);
// console.log(file[0].data);
let datapart=(file[0].data)


function convertToJSON(array) {
    let first = array[0].join()
    let headers = first.split(',');
  
    let jsonData = [];
    for ( let i = 1, length = array.length; i < length; i++ )
    {
  
      let myRow = array[i].join();
      let row = myRow.split(',');
  
      let data = {};
      for ( let x = 0; x < row.length; x++ )
      {
        data[headers[x]] = row[x];
      }
      jsonData.push(data);
  
    }
    return jsonData;
  };

  let jsondata=convertToJSON(file[0].data);
//   console.log(jsondata);

  let PI_spons_map={};
  for(let pi_sp_obj of jsondata){
      if(PI_spons_map[pi_sp_obj['Principal Investigator']]){
        let val=PI_spons_map[pi_sp_obj['Principal Investigator']];
        let sponser_name=pi_sp_obj['Prime Sponsor'];
        if(val[sponser_name]){
            val[sponser_name]+=1
        }
        else{
            val[sponser_name]=1;
        }
      }else{
          let val={}
          val[pi_sp_obj['Prime Sponsor']]=1
        PI_spons_map[pi_sp_obj['Principal Investigator']]=val;
      }
  }

  console.log(PI_spons_map);



// exceltojson({
//     input: paths.Proposals_csv,
//     sheet: "sheetname",  // specific sheetname inside excel file (if you have multiple sheets)
//  //to convert all excel headers to lowr case in json
//   }, function(err, result) {
//     if(err) {
//       console.error(err);
//     } else {
//       console.log(result);
//       //result will contain the overted json data
//     }
//   });