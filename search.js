class Search {
    static URL = '/groups.json';
    static CHUNK = 50;
    static LIMIT = 10;
    static _data = null;

    static async init() {
        let tmp = await fetch(Search.URL);
        tmp = await tmp.json();
        Search._data = tmp['index_data']
            .filter(item => item['linkfunzionante'] === 'Y');

        return true;
    }

    static async search(query, limit) {
        await Search.init();

        let i = 0;
        let toReturn = [];
        while (i < Search._data.length && toReturn.length < limit) {
            if (Search._filter(query, Search._data[i])) {
                toReturn.push(Search._data[i]);
            }

            i++;

            if (i % Search.CHUNK === 0) {
                await Search._sleep(0);
            }

        }

        return toReturn;
    }

    static _filter(query, data) {
        Object.keys(query).map(key => console.log("key: " + key + " , data: " + data[key] + " , query: " + query[key]));
        return Object.keys(query)
            .map(key => data[key] === null || query[key] === null || (data[key].match(query[key]) !== null))
            .reduce((acc, item) => acc && item, true);
    }

    static _sleep(t) {
        return new Promise(r => setTimeout(r, t));
    }
}
