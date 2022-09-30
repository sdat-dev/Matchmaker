
const fs = require('fs');
var path = require('path');
const { paths } = require("./paths.js");
// var directory = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/JSONs';

const SPIN_KeywordsFile = paths.SPIN_Keywords;
const tree1File = paths.tree1;
const tree2File = paths.tree2;
const tree3File = paths.tree3;

const file = fs.readFileSync(SPIN_KeywordsFile);
const keywords = JSON.parse(file);

// console.log(keys);


level3_lvl2 = {};
level2_3arr = {};
level1_2 = {};
for (const [key, val] of Object.entries(keywords)) {
    if (val.level1 && val.level2) {
        let temp = [];
        if (level2_3arr[val.level2]) {
            temp = temp.concat(level2_3arr[val.level2]);
            temp.push(key)
            level2_3arr[val.level2] = temp;
        }
        else {
            level2_3arr[val.level2] = [key]
        }

        level3_lvl2[key] = val.level2;

        if (level1_2[val.level1]) {
            if(!level1_2[val.level1].includes(val.level1)){
            // console.log(level1_2[val.level1]);
            let t = [];
            t=t.concat(level1_2[val.level1]);
            t.push(val.level2);
            level1_2[val.level1] = t;
            }
        }
        else {
            // console.log(val.level2, "level 2 val");
            level1_2[val.level1] = [val.level2];
        }
    }
    else if (val.level1 && !val.level2) {
        // console.log(key,"--",val);
        
        if (level1_2[val.level1]) {
            if(!level1_2[val.level1].includes(key)){
            let temp = [];
            temp = temp.concat(level1_2[val.level1]);
            temp.push(key)
            level1_2[val.level1] = temp;
            }
        }
        else {
            level1_2[val.level1] = [key]
        }
    }

}


// console.log(level3_lvl2);
// console.log(level2_3arr);
// console.log(level1_2);


for(let [k,v] of Object.entries(level1_2)){
    level1_2[k]=[...new Set(v)];
}
// console.log(level1_2);



let newTree3={}

for(let [key,val] of Object.entries(level3_lvl2)){
    let c=0;
    for(let k=0;k<key.length;k++){
        if(key[k]=='/'){
            c+=1;
        }
    }
    if(c==1){
        let nk=key.split(" ")
        // console.log(nk);
        let comb1Arr=[];
        let comb2Arr=[];
        let slCom=[];
        for(let i of nk){
            if(i.indexOf('/')!=-1){
                slCom=i.split("/");
                // console.log(slCom);
                comb1Arr.push(slCom[0]);
                comb2Arr.push(slCom[1]);
            }
            else{
                comb1Arr.push(i);
                comb2Arr.push(i);
               
            }
        }
        // console.log(key);
        // console.log(key,"==> ",comb1Arr.join(" "));
        // console.log(key,"==> ",comb2Arr.join(" "));

        newTree3[comb1Arr.join(" ")]=val;
        newTree3[comb2Arr.join(" ")]=val;
    }
    else{
        newTree3[key]=val;
    }
    
}
// console.log(newTree3);

// fs.writeFileSync(tree3path,JSON.stringify(newTree3));
fs.writeFileSync(tree3File,JSON.stringify(newTree3));

fs.writeFileSync(tree2File,JSON.stringify(level2_3arr));
fs.writeFileSync(tree1File,JSON.stringify(level1_2));

