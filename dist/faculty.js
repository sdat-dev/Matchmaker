console.log("Hey!")
const tree2 = require('../JSONs/tree2.json')
const tree3 = require('../JSONs/tree3.json')
const facultyAbstracts = require('../JSONs/PI_Abstract.json');


const matchFacultyToDepartments = (firstName, lastName) => {
    const facultyName = `${firstName} ${lastName}`.toLowerCase()
    const keyWords = [...new Set([...Object.keys(tree2), ...Object.keys(tree3)])]

    let abstract = facultyAbstracts[facultyName]

    if (!abstract) {
        console.log('Faculty name is incorrect')
        return []
    }

    abstract = abstract.toLowerCase()
    return keyWords.filter((keyWord) => new RegExp(`\\b${keyWord}\\b`, 'gmi').test(abstract))
    //return includeWords(keyWords,abstract)
}

//console.log(matchFacultyToDepartments('christopher','thorncroft'))

const checkFacultiesBasedOnKeywords = (keyWord) => {
    const matchedFaculties = []

    Object.entries(facultyAbstracts).reduce((matchedFaculties, [key, abstract]) => {
        if (abstract.toLowerCase().includes(keyWord.toLowerCase())) {
            const facultyName = key.split(' ')
            matchedFaculties.push({ firstName: facultyName[0], lastName: facultyName[1] })
        }
        return matchedFaculties
    }, matchedFaculties)
    return matchedFaculties
}

//console.log(checkFacultiesBasedOnKeywords('project summary project overview: we propose to establish a center for weather innovation and smart energy and resilience (wiser) that will provide state-of-the-art weather and climate information combined with leading-edge industry-inspired research and development to empower the energy industry of the future. we envision wiser to become a leading energy industry-academia partnership advancing research and cutting-edge technologies to improve the energy industrys power grid efficiency and reliability in the face of intensification of weather extremes in a changing climate and transition to clean energy'))

function isKeyInContent(key,content) {
    key = key.toLowerCase()
    console.log(content.length,"Content")
    console.log(key.length,"Key")
    content = content.toLowerCase()
    let i=0, j=0

    while(j<content.length) {
        if(i>=key.length) {
        console.log(i)
            return i>= key.length/2 ? true : false
        }
        if(key[i] === content[j]){
            i++
        }
        j++
    }
    console.log(i)
    return i>=key.length/2 ? true : false
}

//console.log(isKeyInContent('Artificial Intelligence','This data Science is the part of dadArtificial int'))