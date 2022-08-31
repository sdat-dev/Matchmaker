const { paths } = require("./paths.js");
const fs= require("fs");
let xlsx = require('node-xlsx');
let file = xlsx.parse(paths.Proposals_csv);
// console.log(file[0].data);
let datapart=(file[0].data);
let sortedPI_SponsorMap = paths.sortedPI_SponsorMap;
let dataPath = fs.readFileSync(paths.JSON);
let dataParse = JSON.parse(dataPath);
let data = dataParse.Programs;
let ID_SponsorMapPath = paths.ID_SponsorMap;
let PI_ProjectTitlePath=paths.PI_ProjectTitleMap;
var ID_Sponsor = {};
let PI_ProjTitle={};

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

  let jsondata=convertToJSON(datapart);
  // // console.log(jsondata);
  // for(let i of jsondata){
  //   console.log(i);
  // }

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

  // console.log(PI_spons_map);

  for([key,val] of Object.entries(PI_spons_map)){
    const sortable = Object.entries(val)
    .sort(([,a],[,b]) => b-a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    PI_spons_map[key] = sortable;
  }

  // console.log(PI_spons_map);

  let modified_dict={}
  for(const [k,v] of Object.entries(PI_spons_map)){
    let temp=[]
    for(let [k1,v1] of Object.entries(v)){
      let obj={}
      obj[k1.toLowerCase()]=v1;
      temp.push(obj);
    }
    modified_dict[k.toLowerCase()]=temp;
  }

  fs.writeFileSync(sortedPI_SponsorMap,JSON.stringify(modified_dict));
  // console.log(modified_dict);
// console.log(data);

for(let obj of data){
  ID_Sponsor[obj.id] = obj.spon_name.toLowerCase();
}

fs.writeFileSync(ID_SponsorMapPath,JSON.stringify(ID_Sponsor));


// PI name with Project title mapper
  for(let pi_sp_obj of jsondata){
      if(PI_ProjTitle[pi_sp_obj['Principal Investigator']]){
        let val=PI_ProjTitle[pi_sp_obj['Principal Investigator']];
        let project_title=pi_sp_obj['Proposal Title'];
       val= val+" "+project_title;
       PI_ProjTitle[pi_sp_obj['Principal Investigator'].toLowerCase()]=val.toLowerCase();
        
      }else{
          let val="";
          val=pi_sp_obj['Proposal Title'];
        PI_ProjTitle[pi_sp_obj['Principal Investigator'].toLowerCase()]=val.toLowerCase();
      }
  }

  fs.writeFileSync(PI_ProjectTitlePath,JSON.stringify(PI_ProjTitle));
  // console.log(PI_ProjTitle);


