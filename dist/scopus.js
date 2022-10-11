const axios = require('axios')
const fs = require('fs/promises')

const APIS = {
    scopusSearch: {
        method: 'GET',
        url: () => `https://api.elsevier.com/content/search/scopus`
        //url: () =>'https://7caa2430-8aa1-4061-8cc3-57a079e5efb2.mock.pstmn.io/content/search/scopus'
    },
    abstractDOI: {
        method: 'GET',
        url: (doi) => `https://api.elsevier.com/content/abstract/doi/${doi}`
        //url: (doi) => `https://7caa2430-8aa1-4061-8cc3-57a079e5efb2.mock.pstmn.io/content/abstract/doi`
    }
}

const getDOIs = async () => {
    let completeDOIS = new Set()
    const limit = 10
    let start = 8930, totalCount =10000
    const {url, method} = APIS['scopusSearch']

    while (start <= totalCount) {
        const response = await axios({
            url: url(),
            method,
            headers: {},
            params: {
                query: 'affil(SUNY Albany)',
                apiKey: '',
                count: limit,
                start: start
            }
        })
        totalCount = response.data?.['search-results']?.['opensearch:totalResults']
        start += limit
        const entries = response.data?.['search-results']?.entry
        const dois = entries.reduce((acc, entry) => {
            if (entry['prism:doi']) {
                acc.push(entry['prism:doi'])
            }
            return acc
        }, [])
        completeDOIS = new
        Set([...dois, ...completeDOIS])
    }

    console.log([...completeDOIS])
    return completeDOIS
}

const getDOIAbstract = async (doi) => {
    const {url, method} = APIS['abstractDOI']

    const response = await axios({
        url: url(doi),
        method,
        headers: {},
        params: {
            apiKey: '',
            access_token: ''
        }
    })

    return response.data?.['abstracts-retrieval-response']
}

const getAbstracts = async () => {
    const DOIS = await getDOIs()
    const abstracts = []

    for (let doi of DOIS) {
        const abstract = await getDOIAbstract(doi)
        abstracts.push(abstract) 
    }
    console.log(abstracts.length)
    return abstracts
}

const retrieveAndSaveAbstracts = async () => {
    const abstracts = await getAbstracts()
    await fs.writeFile('./abstracts.json', JSON.stringify(abstracts));
    console.log('Files Saved Successfully')
}

;(async () => {
    await retrieveAndSaveAbstracts()
})();