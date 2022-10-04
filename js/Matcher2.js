const fs = require('fs');
function fundingop() {
    let datarequestURL = "data/JSON.json";
    let datarequest = axios.get(datarequestURL);
    axios.all([datarequest]).then(axios.spread((...responses) => {
        let solicitations = responses[0].data;
        parseData(solicitations);
    }))
}

window.onload = function () {
    console.log("Hey!")
    fundingop();
    let datarequestURL = "dir/dict.json";
    let tree3File = axios.get("JSONs/tree3.json");
    let tree2File = axios.get("JSONs/tree2.json");
    let tree1File = axios.get("JSONs/tree1.json");
    let keyIdArrFile = axios.get("JSONs/keyIdArr.json");
    let PI_Data_MapFile = axios.get("JSONs/PI_Data_Map.json");
    let PI_Sponsor_MapFile = axios.get("JSONs/PI_Sponsor.json");
    let ID_Sponsor_MapPath = axios.get("JSONs/ID_Sponsor.json");
    let PI_ProjectTitleMap = axios.get("JSONs/PI_ProjectTitle.json");
    let PI_AbstractMap = axios.get('JSONs/PI_Abstract.json'); // created this from pacs test.js(not in this repo)
    let spin_DataMap = axios.get('dir/newJson.json');
    let PI_DepartmentFile = axios.get('JSONs/PI_Department.json');

    let datarequest = axios.get(datarequestURL);

    axios.all([datarequest, tree3File, tree2File, tree1File, keyIdArrFile, PI_Data_MapFile, PI_Sponsor_MapFile, ID_Sponsor_MapPath, PI_ProjectTitleMap, PI_AbstractMap, spin_DataMap, PI_DepartmentFile]).then(axios.spread((...responses) => {
        let dictJson = responses[0].data;
        let tree3 = responses[1].data;
        let tree2 = responses[2].data;
        let tree1 = responses[3].data;
        let idMapper = responses[4].data;
        let PI_Data_Map = responses[5].data;
        let PI_Sponsor = responses[6].data;
        let ID_Sponsor = responses[7].data;
        let PI_ProjectTitleData = responses[8].data;
        let PI_Abstract = responses[9].data;
        let spinData = responses[10].data;
        let PI_DepartmentData = responses[11].data;

        const { convert } = require('html-to-text');
        const natural = require('natural/lib/natural/tfidf');
        var TfIdf = natural.TfIdf
        var noOfKeywords = 50;
        let mySet = new Set();
        var result = new Object();
        var arr = []
        let scoreDict = {};
        let idTracker = {};
        let keywrdTracker = {};

        const countIds = (id) => {
            if (id in idTracker) {
                idTracker[id] += 1;
            }
            else {
                idTracker[id] = 1;
            }
        }


        const countOccurances = (content, key) => {
            try{
            let regexp = new RegExp(`${key}`, 'gi')  // `/${key}/g`
            console.log(regexp);
            let count = (content.match(regexp) || []).length;
            // console.log(count);
            return count;
            }
            catch(e){
                return 0;
            }
        }
        const hasMatch = (dictKey, inputContent) => {
            try{
            let flag = false;
            const keyWords = dictKey.toLowerCase().split('/')

            for (let i = 0; i < keyWords.length; i++) {
                // console.log(keyWords);
                if (inputContent.toLowerCase().indexOf(keyWords[i]) != -1) {
                    flag = true;
                    let keyTocheck = keyWords[i];
                    keywrdTracker[dictKey] = countOccurances(inputContent, keyTocheck.toLowerCase());
                    break;
                }
            }
            if (flag === false) {
                return false
            }
            else {
                return true
            }
        }
        catch(e){
            return false;
        }
        }
        // content is lowercase
        //|| hasMatch(key, content)
        const findKeywords = (content) => {

            scoreDict = {};
            idTracker = {};
            keywrdTracker = {};

            for (const [key, val] of Object.entries(tree3)) {
                if (content.includes(key.toLowerCase()) ) {
                    console.log(key,"-----key",val,'--val');
                    if (idMapper[key]) {
                        // console.log(key,'---keyyyy');
                        if (!(key in keywrdTracker)) {
                            keywrdTracker[key] = countOccurances(content, key.toLowerCase());
                        }
                        for (let id of idMapper[key]) {

                            if (id in scoreDict) {
                                scoreDict[id] += 8;
                                countIds(id);
                            }
                            else {
                                scoreDict[id] = 8;
                                countIds(id);
                            }
                            // console.log(id);
                        }

                        // console.log(idMapper[key].length);
                        //TODO logic for scoring and matching spin content for cousins
                        // console.log(val, "--------------------value");
                        for (let keywrd of tree2[val]) { //for all children of level 2
                            if (idMapper[keywrd] && keywrd != key) {
                                // console.log(keywrd,"--",idMapper[keywrd]);
                                for (let spin_id of idMapper[keywrd]) {
                                    if (!(spin_id in scoreDict)) {
                                        scoreDict[spin_id] = 2;
                                        // console.log(keywrd.split(' ').join('_')," ",spin_id," ",scoreDict[spin_id]);
                                    }
                                }
                            }
                        }

                        //for all children of level 1 of same category ----------
                        for (let [l1key, l1val] of Object.entries(tree1)) {
                            if (l1val.includes(val)) {
                                // console.log(l1key);
                                for (let keyterm of l1val) {
                                    if (keyterm != val) {
                                        // console.log(keyterm);
                                        //map ids start ------
                                        if (tree2[keyterm]) {
                                            for (let keywrd of tree2[keyterm]) { //go through  children of level 2
                                                if (idMapper[keywrd] && keywrd != key) {
                                                    // console.log(keywrd,"--",idMapper[keywrd]);
                                                    for (let spin_id of idMapper[keywrd]) { //get ids for each c3 keyword
                                                        if (!(spin_id in scoreDict)) {
                                                            // console.log(spin_id);
                                                            scoreDict[spin_id] = 1;
                                                            // console.log(keywrd.split(' ').join('_')," ",spin_id, " ",scoreDict[spin_id]);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        //ends -----------
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //some change
            // console.log(scoreDict);
            console.log(keywrdTracker);
            return scoreDict;
        }

        function checkSimilarity(lhs) {
            var dct = getScoreFromText(lhs);
            var final = [];
            result[lhs] = new Object();
            var max = 0;
            // console.log("DCT now :")
            // console.log(dct)
            // console.log(dictJson)

            for (var opportunity in dictJson) {
                var value = dictJson[opportunity];
                cmnCount = intersection(dct, value);
                // console.log(value)
                if (cmnCount > max)
                    max = cmnCount
                if (cmnCount > 1) {
                    var url = "https://spin.infoedglobal.com/Program/Detail/" + opportunity;
                    result[lhs][opportunity] = new Object();
                    result[lhs][opportunity].link = url;
                    result[lhs][opportunity].id = opportunity;
                    result[lhs][opportunity].cmnCount = cmnCount;
                    // console.log(url, " : ",cmnCount);
                    arr.push(result[lhs][opportunity]);
                }
            }
            if (max == 0) {
                console.log("No similar abstracts found!")
            } else {
                // return result[lhs]
                arr.sort((a, b) => {
                    return b.cmnCount - a.cmnCount;
                });
                final = arr.slice(0, 20)
                console.log("The following abstracts found-->\n", final)
                tableCreate(final);
            }
        }

        function checkIfnameExists(fName, lName) {
            let fullName = lName.toLowerCase() + ", " + fName.toLowerCase();
            let fullMameWithoutComma = fName.toLowerCase() + " " + lName.toLowerCase();
            if (PI_Data_Map.hasOwnProperty(fullName)) {
                return true;
            }
            else if (PI_ProjectTitleData[fullMameWithoutComma]) {
                return true;
            }
            else {
                return null;
            }
        }

        function checkSimilarityWithName(fName, lName) {
            let fullName = lName.toLowerCase() + ", " + fName.toLowerCase();
            let fullMameWithoutComma = fName.toLowerCase() + " " + lName.toLowerCase();
            let idsWithScore = {};
            // if (PI_Data_Map.hasOwnProperty(fullName)) {
            //     let PI_data = PI_Data_Map[fullName].content;
            //     let scoreWithMultiplier = findKeywords(PI_data.toLowerCase());
            //     for ([key] of Object.entries(scoreWithMultiplier)) {
            //         idsWithScore[key] = dictJson[key];
            //     }
            //     var dct = getScoreFromText(PI_data);
            //     let result = {};
            //     for (let opportunity in dictJson) {
            //         let value = dictJson[opportunity];
            //         let score = intersection(dct, value);
            //         result[opportunity] = score;
            //     }
            //     return result;
            // }
            // //take project abstract from PACS Proposals
            // else 
            if (PI_Abstract[fullMameWithoutComma]) {
                console.log("found");
                let PI_data = PI_Abstract[fullMameWithoutComma];
                let scoreWithMultiplier = findKeywords(PI_data.toLowerCase());
                for ([key] of Object.entries(scoreWithMultiplier)) {
                    idsWithScore[key] = dictJson[key];
                }
                let dct = getScoreFromText(PI_data);
                let result = {};
                for (let opportunity in dictJson) {
                    let value = dictJson[opportunity];
                    let score = intersection(dct, value);
                    result[opportunity] = score;
                    // console.log(opportunity," ",score);
                }
                return result;
            }
            else {
                return null;
            }

        }
        // incase of not match at all TODO function
        function SortBySponNameForNoMatch(array, name, keyMatchFlag) {
            let retArray = [];
            let set = new Set();
            if (!PI_Sponsor.hasOwnProperty(name)) {
                return array;
            } else {
                let sponsCheckFlag = false;
                for (let obj of PI_Sponsor[name]) {
                    console.log(obj);
                }
                // console.log("--------------\nSponsorNamesOfPI-->\n" + Object.values(PI_Sponsor[name]) + "\n\n\nOp Sponsor with ID-->\n");
                for (let obj of PI_Sponsor[name]) {
                    for (let op of array) {
                        // console.log(ID_Sponsor[op.id]);
                        if (ID_Sponsor[op.id] == Object.keys(obj)[0]) {
                            console.log(Object.keys(obj)[0] + "   ---Matched---")
                            retArray.push(op);
                            set.add(op.id);
                            sponsCheckFlag = true;
                        }
                    }
                }
                for (let obj of array) {
                    if (!set.has(obj.id)) {
                        retArray.push(obj);
                    }
                }
                //check for 2 flags i.e keymatch and spons match
                if (sponsCheckFlag == false && keyMatchFlag == false) {

                }
                return retArray;
            }
        }


        function checkSimilarity2Param(lhs, rhs) {
            let result = {};
            let dct = getScoreFromText(lhs);
            for (let opportunity in rhs) {
                let value = rhs[opportunity];
                let score = intersection(dct, value);
                result[opportunity] = score;
                // if (score > 0) {
                //     console.log(opportunity, " ", score);
                // }
            }
            // console.log(result,"result");
            return result;
        }

        function getResultData(jsonData, solicitations) {
            let accordionContent = document.createElement("div");
            accordionContent.innerHTML = ''
            for (var i = 0; i < jsonData.length; i++) {
                accordionContent.innerHTML += generateAccordianContent(solicitations[jsonData[i].id]).innerHTML;
            }
            retVal = generateAccordionElem(8, "collapse8", "heading8", "accordion-ops", "child8", "Results", accordionContent);
            return retVal;
        }

        const checkDeadLines = (SortArraydata) => {

            // console.log(SortArraydata.length);
            let solicitations;
            let flag = false;
            let today = new Date();
            let deadlineDate = "";
            let Estimated_Funding = "";
            let filteredResults = [];

            for (let idObj of SortArraydata) {
                flag = false;
                // console.log(idObj);
                let idval = idObj?.id;
                // console.log(idval);
                if (spinData[idval]) {
                    let data = spinData[idval];

                    if (data.NextDeadlineDate != null) {
                        if (data.NextDeadlineDate.length <= 11) {
                            dueDate = data.NextDeadlineDate;
                            deadlineDate = new Date(data.NextDeadlineDate).toLocaleDateString();
                        }
                        else {
                            var dateArr = data.NextDeadlineDate.split(" ");
                            dueDate = data.NextDeadlineDate.substring(1, 11);
                            deadlineDate = new Date(dateArr[0]).toLocaleDateString();
                        }
                    } else {
                        dueDate = "Continuous Submission/Contact the Program Officer"
                        flag = true;
                    }
                    if (dueDate != "Continuous Submission/Contact the Program Officer") {
                        if (Date.parse(dueDate) > Date.parse(today)) {
                            flag = true;
                            dueDate = deadlineDate;
                        }
                    }
                    if (flag) {
                        filteredResults.push(idObj);
                    }
                }
            }
            // console.log(filteredResults.length, "FILTEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            return filteredResults;
            //here data is sorted ID array based on score
        }
        function generateAccordianContent(data) {
            let content = document.createElement("div");
            let flag = false;   //To check if deadline is already past
            spin_logo = "https://sdat-dev.github.io/resources/wecliemprep/assets/logos-funding-opportunities/SPIN_logo.png";
            var dueDate = "";
            var today = new Date();
            var deadlineDate = "";
            var Estimated_Funding = "";
            if (data.NextDeadlineDate != null) {
                if (data.NextDeadlineDate.length <= 11) {
                    dueDate = data.NextDeadlineDate;
                    deadlineDate = new Date(data.NextDeadlineDate).toLocaleDateString();
                }
                else {
                    var dateArr = data.NextDeadlineDate.split(" ");
                    dueDate = data.NextDeadlineDate.substring(1, 11);
                    deadlineDate = new Date(dateArr[0]).toLocaleDateString();
                }
            } else {
                dueDate = "Continuous Submission/Contact the Program Officer"
                flag = true;
            }
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            if (data.total_funding_limit === 0) {
                Estimated_Funding = "N/A";
            } else {
                Estimated_Funding = formatter.format(data.total_funding_limit);
            }
            var description = '';
            if (data.synopsis != null) {
                var description = data.synopsis.replace(/<[^>]*>/g, '');
            }
            if (dueDate != "Continuous Submission/Contact the Program Officer") {
                if (Date.parse(dueDate) > Date.parse(today)) {
                    flag = true;
                    dueDate = deadlineDate;
                }
            }
            content.innerHTML = '';
            if (flag) {
                content.innerHTML += '<div class="display-flex opportunity-container search-container">'
                    + '<div class="col-xl-2 col-lg-3">'
                    + '<img class="agency-logo" src="' + spin_logo + '"></div>'
                    + '<div class="col-xl-10 col-lg-9">'
                    + '<h4 class="opp-header black-content-header-no-margin">' + data.prog_title + '</h4>'
                    + '<div class="opp-details display-flex">'
                    + '<div class="col-sm-12 col-md-12 col-lg-12 col-xl-6">'
                    + '<i class="fas fa-flag"></i><strong>Agency Name: </strong>' + data.spon_name + '<br><i class="fas fa-dollar-sign"></i>'
                    + '<strong>Estimated Funding: </strong>' + Estimated_Funding + '<br></div>'
                    + '<div class="col-sm-12 col-md-12 col-lg-12 col-xl-6">'
                    + '<i class="fas fa-calendar-day"></i> <strong>Date: </strong>' + dueDate + '<br></div></div></div><br><br><br><br><br><br><br>'
                    + '<p class="opp-description">' + description + '</p><p class="width100" style="padding-left: 15px;">'
                    + '<button type="button" class="details-button" onclick="window.open(\'' + data.programurl + '\',\'_blank\')">View Details</button></p></div>';
            }
            return content;
        }

        function generateAccordionElem(level, collapseId, headerId, parentId, childId, header, accordionContent) {
            var headerno = level + 2;
            let accordionElem = document.createElement("div");
            console.log("Content : ", accordionContent);
            accordionElem.innerHTML = '';
            accordionElem.innerHTML += '<div class="panel panel-default">' +
                '<div class="panel-heading level' + level + '" role="tab" id="' + headerId + '">' +
                '<h' + headerno + ' class = "panel-title">' +
                '<button class="btn btn-link collapsed" type="button" data-toggle="collapse"  data-parent="#' + parentId + '" data-target="#' + collapseId + '" aria-expanded="false" aria-controls="' + collapseId + '">' +
                header + '<i class="fas fa-chevron-up"></i>' +
                '</button>' +
                '</h' + headerno + '>' +
                '</div>'
                + '<div id="' + collapseId + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + headerId + '">' +
                '<div class="panel-body" id="' + childId + '">'
                + accordionContent.innerHTML +
                '</div>' +
                '</div>' +
                '</div>';
            return accordionElem;
        }

        function getScoreFromText(text) {
            var dict = new Object();
            const tfidf = new TfIdf();
            tfidf.addDocument(text);
            tfidf.listTerms(0 /*document index*/).every(function (item) {
                if (noOfKeywords <= 0) {
                    return false;
                }
                let isnum = /^\d+$/.test(item.term);
                if (!isnum && !mySet.has(item.term)) {
                    dict[item.term] = item.tfidf.toFixed(3);
                    noOfKeywords--;
                }
                return true;
            });
            return dict;
        }

        function populateSet(mySet) {
            mySet.add("research");
            mySet.add("grants");
            mySet.add("synopsis");
            mySet.add("purpose");
            mySet.add("funding");
            mySet.add("opportunity");
            mySet.add("announcement");
            mySet.add("foa");
            mySet.add("https");
            mySet.add("available");
            mySet.add("funds");
            mySet.add("related");
            mySet.add("specific");
            mySet.add("among");
            mySet.add("data");
            mySet.add("new");
            mySet.add("award");
            mySet.add("grant");
            mySet.add("small");
            mySet.add("basic");
            mySet.add("may");
            mySet.add("include");
            mySet.add("better");
            mySet.add("not");
            mySet.add("studies");
            mySet.add("goal");
            mySet.add("within");
            mySet.add("id");
            mySet.add("programurl");
            mySet.add("prog_title");
            mySet.add("will");
            mySet.add("centers");
            mySet.add("including");
            mySet.add("allowed");
            mySet.add("www");
            mySet.add("understanding");
            mySet.add("use");
            mySet.add("institute");
            mySet.add("institutes");
            mySet.add("html");
            mySet.add("directly");
            mySet.add("awards");
            mySet.add("program");
            mySet.add("programs");
            mySet.add("agency");
            mySet.add("co");
            mySet.add("study");
            mySet.add("notice");
            mySet.add("proposals");
            mySet.add("dm");
            mySet.add("programs");
            mySet.add("programs");
            mySet.add("programs");
            mySet.add("programs");
        }

        function intersection(o1, o2) {
            let score = 0;
            for (const [key, value] of Object.entries(o1)) {
                if (o2.hasOwnProperty(key)) {
                    score += parseFloat(o2[key]);
                }
            }
            return score;
        }

        function tableCreate(data) {
            let oldAccord = document.getElementsByClassName('panel-group')[0];
            oldAccord.setAttribute("hidden", true);
            let maincontentContainer = document.getElementsByClassName('main-content')[0];
            // var body = document.getElementsByTagName('body')[0];
            var tbl = document.createElement('table');
            tbl.className = "table table-hover table-bordered";
            tbl.style.width = '100%';
            tbl.setAttribute('border', '1');
            var tbdy = document.createElement('tbody');
            for (var i = 0; i < data.length; i++) {
                var ii = i + 1;
                var link = data[i].link;
                var tr = document.createElement('tr');
                for (var j = 0; j < 2; j++) {
                    if (j == 0) {
                        var td = document.createElement('td');
                        td.appendChild(document.createTextNode('Suggestion ' + ii))
                        tr.appendChild(td)
                    }
                    else {
                        content = '<button><a href="' + link + '">Click Here!</a></button>'
                        var td = document.createElement('td');
                        td.innerHTML = content;
                        tr.appendChild(td)
                    }
                }
                tbdy.appendChild(tr);
            }
            tbl.appendChild(tbdy);
            // maincontentContainer.appendChild(tbl)
            let datarequest = axios.get('dir/newJson.json');
            axios.all([datarequest]).then(axios.spread((...responses) => {
                let solicitations = responses[0].data;
                let htmlVal = getResultData(data, solicitations);
                while (maincontentContainer.firstChild) {
                    maincontentContainer.removeChild(maincontentContainer.lastChild)
                }
                maincontentContainer.appendChild(htmlVal);
            })).catch(errors => {
                console.log(errors);
            })
        }

        function SortBySponName(array, name) {
            let retArray = [];
            let set = new Set();
            if (!PI_Sponsor.hasOwnProperty(name)) {
                return array;
            } else {
                for (let obj of PI_Sponsor[name]) {
                    console.log(obj);
                }
                // console.log("--------------\nSponsorNamesOfPI-->\n" + Object.values(PI_Sponsor[name]) + "\n\n\nOp Sponsor with ID-->\n");
                for (let obj of PI_Sponsor[name]) {
                    for (let op of array) {
                        // console.log(ID_Sponsor[op.id]);
                        if(ID_Sponsor[op.id]){
                        if (ID_Sponsor[op.id].includes(Object.keys(obj)[0])) {
                            console.log(Object.keys(obj)[0] + "   ---Matched---")
                            retArray.push(op);
                            set.add(op.id);
                        }}
                    }
                }
                for (let obj of array) {
                    if (!set.has(obj.id)) {
                        retArray.push(obj);
                    }
                }
                return retArray;
            }
        }

        const sortByDepartment = (PI_name) => {
            // let 
            // tree2;
            // PI_DepartmentData
            let dept_tree2Map = {};
            console.log("sortybydept");
            for (let [Spinkey, Spinval] of Object.entries(tree2)) {
                for (let [Deptkey, Deptval] of Object.entries(PI_DepartmentData)) {
                    //  console.log( Deptval.split(" "));
                    let matchfound = false;
                    for (let eachWrd of Deptval.split(" ")) {
                        if (Spinkey.toLowerCase().includes(eachWrd.toLowerCase()) &&
                            (eachWrd.indexOf('Science') == -1) && (eachWrd != 'and') && (eachWrd != 'Studies')
                            && (eachWrd != 'for') && (eachWrd != 'of') && (eachWrd != '&') && (eachWrd != 'in') && (eachWrd != 'The')) {
                            // console.log(Spinkey,'--',Deptval);
                            matchfound = true;
                            break;
                        }
                    }
                    if (matchfound == true) {
                        if (Deptval in dept_tree2Map) {
                            //dept_tree2Map[Deptval]=[]
                            if (dept_tree2Map[Deptval].includes(Spinkey) != true) { //check if spink key already exist for that dept and if exist don't insert
                                let arr = [];
                                arr = dept_tree2Map[Deptval];
                                arr.push(Spinkey);
                                dept_tree2Map[Deptval] = arr;
                            }
                        }
                        else {
                            dept_tree2Map[Deptval] = [Spinkey]
                        }
                    }
                }
            }

            if (PI_name in PI_DepartmentData) {
                let dept = PI_DepartmentData[PI_name];
                let lvl2keys = dept_tree2Map[dept];
                console.log(lvl2keys);
            }

            // console.log(dept_tree2Map);
        }

        let btn = document.getElementById("btn");
        if (btn) {
            btn.addEventListener('click', event => {
                let Description = document.getElementById("Description").value;
                // alert(Description);
                let scoreWithMultiplier = findKeywords(Description.toLowerCase());
                let idsWithScore = {};
                let sortArray = [];         //Will contain all SPIN IDs with tf-idf scores in decr order
                for ([key] of Object.entries(scoreWithMultiplier)) {
                    idsWithScore[key] = dictJson[key];
                }
                let similarResult = checkSimilarity2Param(Description, dictJson); //pass all ids for similarity check (initially: idsWithScore)
                // console.log(similarResult, "before-----");
                //score reduction logic
                // console.log('-----------------');
                for (const [keys, vals] of Object.entries(similarResult)) {
                    similarResult[keys] = similarResult[keys] / 4;
                }
                // console.log('---------------');
                let directMatchIds = {};
                for (let [kkey, kval] of Object.entries(keywrdTracker)) {
                    if (idMapper[kkey]) {
                        for (let mapId of idMapper[kkey]) {
                            if (directMatchIds[mapId]) {  //case where id is repeated for other keywords
                                directMatchIds[mapId] += (100 * (1 - (0.5) ** kval)) / 0.5;
                            }
                            else {
                                directMatchIds[mapId] = (100 * (1 - (0.5) ** kval)) / 0.5;
                            }
                        }
                    }
                }

                for (let [key, val] of Object.entries(similarResult)) {
                    if (key in directMatchIds) {
                        // console.log(val);
                        similarResult[key] += directMatchIds[key];
                    }
                    if (key in scoreDict) { //for sibling case
                        if (scoreDict[key] >= 2 && scoreDict[key] < 8) {
                            similarResult[key] += (10 * (1 - (0.5) ** scoreDict[key])) / 0.5;
                        }
                    }
                    // if (key in scoreDict) {
                    //     // similarResult[key] = val * scoreDict[key];
                    //     if (scoreDict[key] >= 8) {
                    //         if (key in idTracker) {
                    //             similarResult[key] = idTracker[key] * 100 + similarResult[key];
                    //         }
                    //         else {
                    //             similarResult[key] = 100 + similarResult[key];
                    //         }
                    //     }
                    // }
                }
                for (let [key, val] of Object.entries(similarResult)) {
                    let tobj = { id: key, score: val }
                    // tobj[key]={score:val};
                    sortArray.push(tobj);
                }
                sortArray.sort((a, b) => b.score - a.score);
                let filteredArray = checkDeadLines(sortArray);
                // console.log(filteredArray,"filtererererer");
                let final = filteredArray.slice(0, 20);
                console.log("The following abstracts found-->\n", final)
                tableCreate(final);
            });
        }


        let btnName = document.getElementById("btnName");
        if (btnName) {
            btnName.addEventListener('click', event => {
                let firstName = document.getElementById("fName").value;
                let lastName = document.getElementById("lName").value;
                let description = document.getElementById('Description2').value;
                // console.log(description);
                let sortArray = [];
                // alert(Description);
                //---------------------------------------------------------------------------
                //CASE : when user inputs name and description
                if (description && firstName && lastName) {
                    console.log("all vals");

                    let profExists = checkIfnameExists(firstName, lastName);
                    if (profExists != null) {
                        // console.log("Only description related reuslts logic starts ----------------------------");
                        let scoreWithMultiplier = findKeywords(description.toLowerCase());
                        let idsWithScore = {};
                        let sortArray = [];         //Will contain all SPIN IDs with tf-idf scores in decr order
                        for ([key] of Object.entries(scoreWithMultiplier)) {
                            idsWithScore[key] = dictJson[key];
                        }
                        let similarResult = checkSimilarity2Param(description, dictJson); //pass all ids for similarity check (initially: idsWithScore)
                        // console.log(similarResult, "before-----");
                        //score reduction logic
                        for (const [keys, vals] of Object.entries(similarResult)) {
                            similarResult[keys] = similarResult[keys] / 4;
                        }
                        let directMatchIds = {};
                        for (let [kkey, kval] of Object.entries(keywrdTracker)) {
                            if (idMapper[kkey]) {
                                for (let mapId of idMapper[kkey]) {
                                    if (directMatchIds[mapId]) {  //case where id is repeated for other keywords
                                        directMatchIds[mapId] += (100 * (1 - (0.5) ** kval)) / 0.5;
                                    }
                                    else {
                                        directMatchIds[mapId] = (100 * (1 - (0.5) ** kval)) / 0.5;
                                    }
                                }
                            }
                        }
                        for (let [key, val] of Object.entries(similarResult)) {
                            if (key in directMatchIds) {
                                // console.log(val);
                                similarResult[key] += directMatchIds[key];
                            }
                            if (key in scoreDict) { //for sibling case
                                if (scoreDict[key] >= 2 && scoreDict[key] < 8) {
                                    similarResult[key] += (10 * (1 - (0.5) ** scoreDict[key])) / 0.5;
                                }
                            }
                            // if (key in scoreDict) {
                            //     // similarResult[key] = val * scoreDict[key];
                            //     if (scoreDict[key] >= 8) { //TODO - to prioritise the ids repeated more for direct keyword match
                            //         if (key in idTracker) {
                            //             similarResult[key] = idTracker[key] * 100 + similarResult[key];
                            //         }
                            //         else {
                            //             similarResult[key] = 100 + similarResult[key];
                            //         }
                            //     }
                            // }
                        }
                        for (let [key, val] of Object.entries(similarResult)) {
                            let tobj = { id: key, score: val }
                            // tobj[key]={score:val};
                            sortArray.push(tobj);
                        }
                        sortArray.sort((a, b) => b.score - a.score);
                        let filteredArray = checkDeadLines(sortArray);
                        // console.log(filteredArray,"filtererererer");
                        //----------------------------
                        //SPONSER SORT LOGIC STARTS
                        let fullName = firstName.toLowerCase() + " " + lastName.toLowerCase();
                        let final = SortBySponName(filteredArray.slice(0, 20), fullName);
                        console.log("The following abstracts found-->\n", final)
                        tableCreate(final);
                    }
                    else {
                        alert("Data for the provided researcher name not found!")
                    }
                }
                //---------------------------------------------------------------------------
                //CASE :: when user inputs only name and not description
                else if (!description && firstName && lastName) {
                    console.log("no desc");
                    let similarResult = checkSimilarityWithName(firstName, lastName);
                    if (similarResult != null) {
                        for (const [keys, vals] of Object.entries(similarResult)) {
                            similarResult[keys] = similarResult[keys] / 4;
                        }
                        let directMatchIds = {};
                        for (let [kkey, kval] of Object.entries(keywrdTracker)) {
                            if (idMapper[kkey]) {
                                for (let mapId of idMapper[kkey]) {
                                    if (directMatchIds[mapId]) {  //case where id is repeated for other keywords
                                        directMatchIds[mapId] += (100 * (1 - (0.5) ** kval)) / 0.5;
                                    }
                                    else {
                                        directMatchIds[mapId] = (100 * (1 - (0.5) ** kval)) / 0.5;
                                    }
                                }
                            }
                        }
                        for (let [key, val] of Object.entries(similarResult)) {
                            if (key in directMatchIds) {
                                // console.log(val);
                                similarResult[key] += directMatchIds[key];
                            }
                            if (key in scoreDict) { //for sibling case
                                if (scoreDict[key] >= 2 && scoreDict[key] < 8) {
                                    similarResult[key] += (10 * (1 - (0.5) ** scoreDict[key])) / 0.5;
                                }
                            }
                            // if (key in scoreDict) {
                            //     // similarResult[key] = val * scoreDict[key];
                            //     if (scoreDict[key] >= 8) {   //multiply the times it got repeated
                            //         //TODO - to prioritise the ids repeated more for direct keyword match
                            //         if (key in idTracker) {
                            //             similarResult[key] = idTracker[key] * 100 + similarResult[key];
                            //         }
                            //         else {
                            //             similarResult[key] = 100 + similarResult[key];
                            //         }
                            //     }
                            // }
                        }
                        for (let [key, val] of Object.entries(similarResult)) {
                            let tobj = { id: key, score: val }
                            // tobj[key]={score:val};
                            sortArray.push(tobj);
                        }
                        let fullName = firstName.toLowerCase() + " " + lastName.toLowerCase();
                        sortByDepartment(fullName);
                        sortArray.sort((a, b) => b.score - a.score);
                        let filteredArray = checkDeadLines(sortArray);
                        // console.log(filteredArray.slice(0,20),"filtererererer");

                        let final = SortBySponName(filteredArray.slice(0, 20), fullName); //do any scoring logic before sortby sponsor
                        console.log("The following abstracts found-->\n", final)
                        tableCreate(final);
                    }
                    else {
                        alert("Data for the provided researcher name not found!")
                    }
                }
                //---------------------------------------------------------------------------
                //CASE : when user inputs no name and description only
                else if (description && !firstName && !lastName) {
                    console.log("only desc");
                    let scoreWithMultiplier = findKeywords(description.toLowerCase());
                    let idsWithScore = {};
                    let sortArray = [];         //Will contain all SPIN IDs with tf-idf scores in decr order
                    for ([key] of Object.entries(scoreWithMultiplier)) {
                        idsWithScore[key] = dictJson[key];
                    }
                    let similarResult = checkSimilarity2Param(description, dictJson); //pass all ids for similarity check (initially: idsWithScore)
                    // console.log(similarResult, "before-----");
                    //score reduction logic
                    // console.log('-----------------');
                    for (const [keys, vals] of Object.entries(similarResult)) {
                        similarResult[keys] = similarResult[keys] / 4;
                    }

                    let directMatchIds = {};
                    for (let [kkey, kval] of Object.entries(keywrdTracker)) {
                        if (idMapper[kkey]) {
                            for (let mapId of idMapper[kkey]) {
                                if (directMatchIds[mapId]) {  //case where id is repeated for other keywords
                                    directMatchIds[mapId] += (100 * (1 - (0.5) ** kval)) / 0.5;
                                }
                                else {
                                    directMatchIds[mapId] = (100 * (1 - (0.5) ** kval)) / 0.5;
                                }
                            }
                        }
                    }

                    for (let [key, val] of Object.entries(similarResult)) {
                        if (key in directMatchIds) {
                            // console.log(val);
                            similarResult[key] += directMatchIds[key];
                        }
                        if (key in scoreDict) { //for sibling case
                            if (scoreDict[key] >= 2 && scoreDict[key] < 8) {
                                similarResult[key] += (10 * (1 - (0.5) ** scoreDict[key])) / 0.5;
                            }
                        }
                        // if (key in scoreDict) {
                        //     // similarResult[key] = val * scoreDict[key];
                        //     if (scoreDict[key] >= 8) { //TODO - to prioritise the ids repeated more for direct keyword match
                        //         if (key in idTracker) {
                        //             similarResult[key] = idTracker[key] * 100 + similarResult[key];
                        //         }
                        //         else {
                        //             similarResult[key] = 100 + similarResult[key];
                        //         }
                        //     }
                        // }
                    }
                    for (let [key, val] of Object.entries(similarResult)) {
                        let tobj = { id: key, score: val }
                        // tobj[key]={score:val};
                        sortArray.push(tobj);
                    }
                    sortArray.sort((a, b) => b.score - a.score);
                    let filteredArray = checkDeadLines(sortArray);
                    // console.log(filteredArray,"filtererererer");
                    let final = filteredArray.slice(0, 20);
                    console.log("The following abstracts found-->\n", final)
                    tableCreate(final);
                }
                else {
                    alert("Invalid data");
                }
            });
        }
        // result[text] = checkSimilarity(text,dictJson)
        populateSet(mySet);
        // var text = "The purpose of this Funding Opportunity Announcement (FOA) is to support studies to investigate mechanisms by which the gut microbiome and gut immune system modulates the brain functions, circuits, neurotransmitters, signaling pathways and synaptic plasticity in the context of HIV and Anti-retroviral therapy. Exploratory and high-risk research projects are encouraged. Basic, preclinical, and clinical (e.g., pathophysiology or mechanisms) research in domestic and international settings are of interest. No clinical trials will be accepted for this FOA. Multidisciplinary research teams and collaborative alliances are encouraged but not required. In the United States and globally, Central Nervous System (CNS) comorbidities associated with HIV including neurologic, neurocognitive, and mental health problems continue to persist in people living with HIV (PWH) despite effective antiretroviral therapy (ART). Considerable gaps exist in the understanding of CNS comorbidities associated with HIV in the context of ART. Recent studies have shown gut microbiota and gut immune system can alter brain development, neurotransmitter systems, signaling pathways, synaptic related proteins, and modulate behavior. From early stages of infection, HIV alters the gut immune system and the gut microbiome (dysbiosis) resulting in immune dysfunction as well as higher levels of systemic inflammation. ART does not completely reverse the impact of HIV on the gut immune system and the microbiome. To date there is a paucity of studies looking at unique pathways and mechanisms of gut microbiome and gut-related immune dysregulation impacting CNS-related outcomes in PWH. An enhanced understanding of mechanisms underlying gut microbiome-immune-CNS interactions may provide novel insights into CNS comorbidities observed in PWH.";
        // checkSimilarity(text)

    })).catch(errors => {
        console.log(errors);
    })
}