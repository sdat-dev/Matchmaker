// const { fs } = require("browserify/lib/builtins");
const { paths } = require("./paths");
let stringSimilarty= require('string-similarity');
const fs = require('fs')

let tree3path=paths.tree3;

let treeData=fs.readFileSync(tree3path);
treeData=JSON.parse(treeData);

// console.log(treeData);
let newTree3={}

for(let [key,val] of Object.entries(treeData)){
    // if(key.includes("/")){
    //     console.log(key,"-->",key.split(" "));
    // }
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
console.log(newTree3);

fs.writeFileSync(tree3path,JSON.stringify(newTree3));
// let arr=[];
// for(let[key,val] of Object.entries(treeData)){
//     let results2=stringSimilarty.compareTwoStrings("In artificial intelligence, abstraction is commonly used to account for the use of various levels of details in a given representation language or the ability to change from one level to another while preserving useful properties",key)
// console.log(results2,"--",key);
// // arr.push(key);
// }


// let results=stringSimilarty.findBestMatch('Artifcial Intelligence/Cybernetics',['In artificial intelligence, abstraction is commonly used to account for the use of various levels of details in a given representation language or the ability to change from one level to another while preserving useful properties'])

// console.log(results.bestMatch);
// console.log(results.bestMatchIndex);

// for(let i of results.ratings){
//     console.log(i);
// }


