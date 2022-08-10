window.onload = function () {
    console.log("Hey!")
    
    let datarequestURL = "dir/dict.json";
    let datarequest = axios.get(datarequestURL);

    axios.all([datarequest]).then(axios.spread((...responses) => {
        let dictJson = responses[0].data;
        
            
        const { convert } = require('html-to-text');
        const natural = require('natural/lib/natural/tfidf');
        var TfIdf = natural.TfIdf
        var noOfKeywords = 50;
        let mySet = new Set();
        var result = new Object();
        var arr = []

        function checkSimilarity(lhs) {
            var dct = getScoreFromText(lhs);
            var final = [];
            result[lhs] = new Object();
            var max=0;
            // console.log(dct)
            // console.log(dictJson)
        
            for (var opportunity in dictJson) {
                var value = dictJson[opportunity];
                cmnCount = intersection(dct, value);
                // console.log(value)
                if(cmnCount>max)
                    max=cmnCount
                if(cmnCount>3){
                    var url = "https://spin.infoedglobal.com/Program/Detail/"+opportunity;
                    result[lhs][opportunity] = new Object();
                    result[lhs][opportunity].link = url;
                    result[lhs][opportunity].cmnCount = cmnCount;
                    console.log(url, " : ",cmnCount);
                    arr.push(result[lhs][opportunity]);
                }
            }
            if(max==0){
                console.log("No similar abstracts found!")
            }else{
                
                console.log("The following abstracts found-->")
                // return result[lhs]
                arr.sort((a, b) => {
                    return b.cmnCount - a.cmnCount;
                });
                final = arr.slice(0, 5)
                console.log("new one")
                console.log(final)
                tableCreate(final);
            }
        }

        function getScoreFromText(text) {
            var dict = new Object();
            const tfidf = new TfIdf();
            tfidf.addDocument(text);
            tfidf.listTerms(0 /*document index*/).every(function(item) {
                if(noOfKeywords<=0){
                    return false;
                }
                let isnum = /^\d+$/.test(item.term);
                if(!isnum && !mySet.has(item.term)){
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
            return Object.keys(o1).filter({}.hasOwnProperty.bind(o2)).length;
        }

        function tableCreate(data) {
            var body = document.getElementsByTagName('body')[0];
            var tbl = document.createElement('table');
            tbl.style.width = '100%';
            tbl.setAttribute('border', '1');
            var tbdy = document.createElement('tbody');
            for (var i = 0; i < data.length; i++) {
                var ii=i+1;
                var link = data[i].link;
                var tr = document.createElement('tr');
                for (var j = 0; j < 2; j++) {
                    if(j==0){
                        var td = document.createElement('td');
                        td.appendChild(document.createTextNode('Suggestion '+ ii))
                        tr.appendChild(td)
                    }
                    else{
                        content = '<button><a href="'+link+'">Click Here!</a></button>'
                        var td = document.createElement('td');
                        td.innerHTML = content;
                        tr.appendChild(td)
                    }
                }
                tbdy.appendChild(tr);
            }
            tbl.appendChild(tbdy);
            body.appendChild(tbl)
        }
        
        let btn = document.getElementById("btn");
        btn.addEventListener('click', event => {
            let Description = document.getElementById("Description").value;
            // alert(Description);
            checkSimilarity(Description);
        });

        // result[text] = checkSimilarity(text,dictJson)
        populateSet(mySet);
        // var text = "The purpose of this Funding Opportunity Announcement (FOA) is to support studies to investigate mechanisms by which the gut microbiome and gut immune system modulates the brain functions, circuits, neurotransmitters, signaling pathways and synaptic plasticity in the context of HIV and Anti-retroviral therapy. Exploratory and high-risk research projects are encouraged. Basic, preclinical, and clinical (e.g., pathophysiology or mechanisms) research in domestic and international settings are of interest. No clinical trials will be accepted for this FOA. Multidisciplinary research teams and collaborative alliances are encouraged but not required. In the United States and globally, Central Nervous System (CNS) comorbidities associated with HIV including neurologic, neurocognitive, and mental health problems continue to persist in people living with HIV (PWH) despite effective antiretroviral therapy (ART). Considerable gaps exist in the understanding of CNS comorbidities associated with HIV in the context of ART. Recent studies have shown gut microbiota and gut immune system can alter brain development, neurotransmitter systems, signaling pathways, synaptic related proteins, and modulate behavior. From early stages of infection, HIV alters the gut immune system and the gut microbiome (dysbiosis) resulting in immune dysfunction as well as higher levels of systemic inflammation. ART does not completely reverse the impact of HIV on the gut immune system and the microbiome. To date there is a paucity of studies looking at unique pathways and mechanisms of gut microbiome and gut-related immune dysregulation impacting CNS-related outcomes in PWH. An enhanced understanding of mechanisms underlying gut microbiome-immune-CNS interactions may provide novel insights into CNS comorbidities observed in PWH.";
        // checkSimilarity(text)

    })).catch(errors => {
        console.log(errors);
    })
}