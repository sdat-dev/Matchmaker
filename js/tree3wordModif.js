// const { fs } = require("browserify/lib/builtins");
const { paths } = require("./paths");
let stringSimilarty= require('string-similarity');
const fs = require('fs')

let tree3path=paths.tree3;

let treeData=fs.readFileSync(tree3path);
treeData=JSON.parse(treeData);

let newTree3={}
let newTree32={}

// console.log("--with more than slashes -------------------");

for(let [key,val] of Object.entries(treeData)){
    if(key.includes("/") ){
        let c=0;
        for(let i=0;i<key.length;i++){
            if(key[i]=='/'){
                c+=1;
            }
        }
        if(c>1){
        let spaceSplit=key.split(" ");
            let newArr=[];
            for(let i=0;i<spaceSplit.length;i++){
                if(spaceSplit[i].includes("/")){
                    let slashsplit=spaceSplit[i].split("/")
                    
                        for(let j=0;j<slashsplit.length;j++){
                            let s=[]
                            for(let k=0;k<spaceSplit.length;k++){
                                if(k!=i){
                                    s.push(spaceSplit[k])
                                }
                                else{
                                    s.push(slashsplit[j])
                                }
                            }
                            newArr.push(s);
                            // console.log(s);
                            newTree32[s.join(" ")]=val;
                        }
                    
                }
            }

    }
}
else{
    newTree32[key]=val;
}
}


for(let [key,val] of Object.entries(newTree32)){
    if(key.includes("/")){
    }
    let c=0;
    for(let k=0;k<key.length;k++){
        if(key[k]=='/'){
            c+=1;
        }
    }
    if(c==1){
        let nk=key.split(" ")
        let comb1Arr=[];
        let comb2Arr=[];
        let slCom=[];
        for(let i of nk){
            if(i.indexOf('/')!=-1 ){
                slCom=i.split("/");
                comb1Arr.push(slCom[0]);
                comb2Arr.push(slCom[1]);
            }
            else{
                comb1Arr.push(i);
                comb2Arr.push(i);
            }
        }
        newTree3[comb1Arr.join(" ")]=val;
        newTree3[comb2Arr.join(" ")]=val;
    }
    else{
        newTree3[key]=val;
    }
}
// console.log(newTree3);


// console.log(treeData);
let newTreeWithComma={};
for (let [key,val] of  Object.entries( treeData)){
    if(key.includes(",")){
    const words = key.split(',').map(n=>n.trim());
       
        newTreeWithComma[words.join(" ")]=val;

    let withreverse= words.reverse();
    newTreeWithComma[withreverse.join(" ")]=val;
}
else{
    newTreeWithComma[key]=val;
}

}
console.log(newTreeWithComma);



