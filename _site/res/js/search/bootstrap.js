if (!window.searchWorker){
    window.searchCbs = {};
    window.searchCbsCount = 0;

    window.searchWorker = new Worker('/res/js/search/worker.js');
    window.searchWorker.onmessage = e => {
        data = e.data;
        let cb = window.searchCbs[data.id];
        if (cb){
            cb(data.data);
            window.searchCbs[data.id] = undefined;
        }
    };
}

/**
 * 
 * @param {Object} query Query to search
 * @param {Function<Object>} cb Callback for the result
 */
function doSearch(query, cb){
    window.searchWorker.postMessage({
        op_type: "search",
        id: window.searchCbsCount,
        data: query
    });
    window.searchCbs[window.searchCbsCount] = cb;
    window.searchCbsCount++;
}