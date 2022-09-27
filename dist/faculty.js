console.log("Hey!")
const tree2 = require('../JSONs/tree2.json')
const tree3 = require('../JSONs/tree3.json')
const facultyAbstracts = require('../JSONs/PI_Abstract.json'); // created this from pacs test.js(not in this repo)

const matchFacultyToDepartments = (firstName, lastName) => {
    const facultyName = `${firstName} ${lastName}`.toLowerCase()
    const keyWords = [...new Set([...Object.keys(tree2), ...Object.keys(tree3)])]

    let abstract = facultyAbstracts[facultyName]

    if (!abstract) {
        console.log('Faculty name is incorrect')
        return []
    }

    abstract = abstract.toLowerCase()

    return keyWords.filter((keyWord) => abstract.includes(keyWord.toLowerCase()))
}

console.log(matchFacultyToDepartments('thomas', 'begley'))
