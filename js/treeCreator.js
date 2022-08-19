
const fs = require('fs');
var path = require('path');
var directory = 'C:/Users/sg797751/Desktop/GIt/Matchmaker/JSONs';
const file = fs.readFileSync(path.join(directory,'SPIN_Keywords.json'));
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

fs.writeFileSync('C:/Users/sg797751/Desktop/GIt/Matchmaker/JSONs/tree3.json',JSON.stringify(level3_lvl2));
fs.writeFileSync('C:/Users/sg797751/Desktop/GIt/Matchmaker/JSONs/tree2.json',JSON.stringify(level2_3arr));
fs.writeFileSync('C:/Users/sg797751/Desktop/GIt/Matchmaker/JSONs/tree1.json',JSON.stringify(level1_2));

