const path = require("path");

const paths = {
  JSON : path.join(path.dirname(path.dirname(__dirname)), "University at Albany - SUNY","Script Repository - Documents", "JSON.json"),
  data : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","dir","data.json"),
  dict : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","dir","dict.json"),
  overall : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","dir","overall.json"),
  OriginalSPIN_keys : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","JSONs","OriginalSPIN_keys.json"),
  SPIN_Keywords : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","JSONs","SPIN_Keywords.json"),
  tree1 : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","JSONs","tree1.json"),
  tree2 : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","JSONs","tree2.json"),
  tree3 : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","JSONs","tree3.json"),
  keyIdArr : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","JSONs","keyIdArr.json"),
  PI_Data_Map : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","JSONs","PI_Data_Map.json"),
  Proposals_csv : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","data","Proposals.csv"),
  sortedPI_SponsorMap : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","JSONs","PI_Sponsor.json"),
  ID_SponsorMap : path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","JSONs","ID_Sponsor.json"),
  PI_ProjectTitleMap:path.join(path.dirname(path.dirname(__dirname)),'Matchmaker',"JSONs","PI_ProjectTitle.json"),
  newJsonPath:path.join(path.dirname(path.dirname(__dirname)), "Matchmaker","dir","newJson.json"),
  PI_Departmentpath:path.join(path.dirname(path.dirname(__dirname)),'Matchmaker',"JSONs","PI_Department.json")
};
module.exports.paths = paths;
