
const fs = require('fs')
const pdfParse = require('pdf-parse');
var reader = require('any-text');
const { paths } = require("./paths.js");
// const { nextTick } = require('process');
const PI_Data_MapFile = paths.PI_Data_Map;

function getFiles(dir, files_) {
    try {
        files_ = files_ || [];
        let files = fs.readdirSync(dir);
        for (let i in files) {
            let name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()) {
                getFiles(name, files_);
            } else {
                files_.push(name);
            }
        }
        return files_;
    }
    catch (e) {
        console.log("file error" + e);
    }
}
// let allFiles = getFiles("C:/Users/rb954294/Desktop/Git/University at Albany - SUNY/GRP-SPA Pre-Award - Schools and Colleges")
// // console.log(allFiles);
// for(let fil of allFiles){
//     console.log(fil);
// }

//get word content
const getWordContent = async (path) => {
    try {
        const text = await reader.getText(path);
        return text;
    }
    catch (e) {
        console.log(e);

    }

}

const getPDF = async (file) => {
    let readFileSync = fs.readFileSync(file)
    try {
        let pdfExtract = await pdfParse(readFileSync)
        if (pdfExtract)
            // console.log('File content: ', pdfExtract.text)
            // console.log('Total pages: ', pdfExtract.numpages)
            // console.log('All content: ', pdfExtract.info)
            return pdfExtract;
    } catch (error) {
        console.log(error);
    }
}
// const pdfRead='C:/Users/rb954294/Desktop/Git/University at Albany - SUNY/GRP-SPA Pre-Award - Schools and Colleges/Academic Affairs/Carr/ThruwayAuthority.workpermit.pdf'
// const pdfRead = 'C:/Users/rb954294/Desktop/Git/University at Albany - SUNY/GRP-SPA Pre-Award - Schools and Colleges/Academic Affairs/Carr/YCIP.scopeofwork.pdf'
// getPDF(pdfRead);
let totalData = [];
let obj = new Object();


const buildData = (schoolName, profName, content) => {

    // console.log(schoolName, profName, content);

    let researchDetails = {
        schoolAndColleges: "",
        profName: "",
        content: ""
    }

    content = content.replace(/\n|\t|\u001f|__/g, '');

    researchDetails.schoolAndColleges = schoolName;
    researchDetails.profName = profName.toLowerCase();
    researchDetails.content = content;
    totalData.push(researchDetails);

    if (obj[researchDetails.profName]) {
        obj[researchDetails.profName] = {
            schoolAndColleges: researchDetails.schoolAndColleges,
            content: obj[researchDetails.profName].content + " " + researchDetails.content
        }
    }
    else {
        obj[researchDetails.profName] = {
            schoolAndColleges: researchDetails.schoolAndColleges,
            content: researchDetails.content
        }
    }


}

const saveRdata = async () => {

    let allFiles = getFiles("C:\\Users\\sg797751\\Desktop\\GIt\\University at Albany - SUNY\\GRP-SPA Pre-Award - General\\Schools and Colleges")

    let pdf = 0, doc = 0, xlsx = 0, elses = 0;

    for (let i of allFiles) {
        try {
            let lenOfFile = (i.split('/')).length;
            let fileStruct = i.split('/')
            if (fileStruct[lenOfFile - 1].toLowerCase().indexOf('.pdf') != -1) {
                pdf++;

                let content = await getPDF(i);
                content = content.text ? content.text : "";
                if (content) {
                    // console.log(i);
                    //schoolname , profName   , research data
                    buildData(i.split('/')[7], i.split('/')[lenOfFile - 2], content);
                }
                continue;
            }
            else if (fileStruct[lenOfFile - 1].toLowerCase().indexOf('.xlsx') != -1 || fileStruct[lenOfFile - 1].toLowerCase().indexOf('.xls') != -1) {
                xlsx++;
            }
            else if (fileStruct[lenOfFile - 1].toLowerCase().indexOf('.doc') != -1 && fileStruct[lenOfFile - 1].toLowerCase().indexOf('.docx') === -1) {

                let contentWord = await getWordContent(i);
                if (contentWord) {
                    // console.log(i);
                    //schoolname , profName  , research data
                    buildData(i.split('/')[7], i.split('/')[lenOfFile - 2], contentWord)
                    doc++;
                }
                continue;
            }
            else {
                elses++;
            }
        }
        catch (e) {
            console.log(e);
            continue;
        }
    }


}

main = async () => {
    await saveRdata();
    // console.log(totalData);
    fs.writeFile(PI_Data_MapFile, JSON.stringify(obj), (err) => {
        if (err) throw err;
    });

    //    try {
    //     const data = fs.readFileSync('output.txt', 'utf8');
    //     // console.log(data);
    //     let parsedData=JSON.parse(data);
    //     console.log(parsedData);


    //   } catch (err) {
    //     console.error(err);
    //   }


}

main();