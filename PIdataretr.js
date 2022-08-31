const fs=require('fs');
let pimappath=fs.readFileSync('C:\\Users\\rb954294\\Desktop\\Git\\Matchmaker\\JSONs\\PI_Data_Map.json');
const pidata=JSON.parse(pimappath);

let tree3path=fs.readFileSync('C:\\Users\\rb954294\\Desktop\\Git\\Matchmaker\\JSONs\\tree3.json');
const tree3Data=JSON.parse(tree3path);

let newPI_keyMap={}
for(const[key,val] of  Object.entries(pidata)){
    for( const[skey,sval] of Object.entries(tree3Data)){
        if(val.content.includes(" "+skey) && val.content.includes(skey+" ") || val.content.includes(skey+" ")){
            
            if(newPI_keyMap[key]){
                let tarr=[];
                tarr=newPI_keyMap[key];
                tarr.push(skey);
                newPI_keyMap[key]=tarr;
            }
            else{
                newPI_keyMap[key]=[skey];
            }
          
        }
    }
}

// console.log(newPI_keyMap);

fs.writeFileSync('mostusedkeys.json',JSON.stringify(newPI_keyMap));

let rankmap={}
for(const [k,v] of Object.entries( newPI_keyMap)){
    for( let i of v){
        if(rankmap[i]){
            rankmap[i]+=1
        }
        else{
            rankmap[i]=1;
        }
    }
}
// console.log(rankmap);

  const sorted = Object.entries(rankmap)
    .sort(([, v1], [, v2]) => v2 - v1)
    .reduce((obj, [k, v]) => ({
      ...obj,
      [k]: v
    }), {})
//   console.log(sorted)

let cnt=0

let finaldata={}
  for(const [k,v] of Object.entries(sorted) ){
        for( const [pk,pv] of Object.entries(newPI_keyMap)){
            if(finaldata[k]){
                let tarr=[];
                tarr=finaldata[k];
                tarr.push(pk);
                finaldata[k]=tarr;
            }
            else{
                finaldata[k]=[pk];
            }
        }

        if(cnt==25){
            break;
        }
        cnt+=1;
  }
  

//   console.log(finaldata);


  fs.writeFileSync('Reserach-Prof.json',JSON.stringify(finaldata))