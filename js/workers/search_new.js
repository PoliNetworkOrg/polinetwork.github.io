/**
 *  Web Worker wrapping all the search logic of the website.
 *
 *  Only two methods are exposed: 
 *	{@link preload}	useful to warm up the search script
 *	{@link search}  for executing a search
 *
 *  You can call a method by posting a message formatted as below:
 *	`
 *  {
 *		op_id: 		an opaque id associated with this call
 *		op_type: 	the name of the method to call
 *		data: 		object containing functions' params
 *  }
 *  `
 *
 *  Each method returns data by firing a message formatted as below:
 *  `
 *	{
 *		op_id: 		the same value passed in the request,
 *      op_type: 	the name of the method called (for example filter)
 *      data: 		see doc for each method
 *  }
 *  `
 *
 *  @package search
 *
 *  {@link search}
 *	{@link reload}
 *  {@link index_data}
 *  {@link loaded}
 *  {@link _reload}
 *  {@link _filter}
 */

/**
 *	The index dataset for the worker. See {@link reload}.
 */
index_data = [];

/**
 *  True if data has been loaded, false otherwise
 */
loaded = false;

/**
 *  Post messages to this worker to call methods. 
 *  
 *	See main doc for this package
 */
onmessage = function(e) {
	var data = e.data;
	
	// Loading data if first startup
	while (this.loaded !== true){
		this.loaded = this._reload();
	}

	switch (data.op_type){
		case "search":
			data.data = this.search(
				data.data.query,
				data.data.join,
				data.data.limit
			);

			break;
		case "preload":
			// Only for warming the script up
			break;
		default:
			// Nothing to do
	}
	
	postMessage(data);
}

/**
 *	Search the dataset for a given query
 *
 *	@param 	query	The query to execute, as an object where each element name
 *					contains the field of the dataset to filter, and the 
 *					content the value to filter by
 *	@param 	join 	The type of join for query: AND (default AND)
 *	@param 	limit 	Max elements to return (default 5, -1 disable)
 */
search = function(query, join, limit){
	// Setting defaults
	// if (join === undefined) {
	// 	join = "AND";
	// }

	if (limit === undefined) {
		limit = 5;
	}

	return this.index_data
		.filter(item => this._filter(item, query))
		.slice(0, (limit !== -1?undefined:limit));
	// // Filtering data
	// var result = [];

	// Object.keys(query).forEach((item) => {
	// 	result.push(
	// 		this._filter(item, query)
	// 	);
	// });

	// // Joining Data
	// if (join == "AND"){
	// 	// AND

	// 	this.index_data.filter(
	// 		item => this._filter(item, query)
	// 	)


	// 	// var tmp = {};
	// 	// var oksum = 0;

	// 	// result.forEach((curarr, curarrid) => {
	// 	// 	curarr.forEach((item) => {
	// 	// 		if (!tmp[item]){
	// 	// 			tmp[item] = 0;
	// 	// 		}
	// 	// 		tmp[item] += Math.pow(2, curarrid);
	// 	// 	});
	// 	// 	oksum += Math.pow(2, curarrid);
	// 	// });

	// 	// result = Object.keys(tmp).filter((item) => {
	// 	// 	if (tmp[item] === oksum){
	// 	// 		return true;
	// 	// 	}
	// 	// 	else {
	// 	// 		return false;
	// 	// 	}
	// 	// });
	// }
	// // else {
	// // 	// OR
	// // 	result = result.reduce((list, item) => {
	// // 		return list.concat(item);
	// // 	},[]);
	// // }

	// // result = this._remove_duplicates(result);
	// // result.sort();

	// // Limiting data
	// if (Number(limit) !== -1){
	// 	result = result.slice(0, limit);
	// }

	// // Retriving Data Info
	// // result = result.map(id => this.info_data[id]);

	// // Returning Data
	// return result;

}

/**
 *  Dummy function used only for warming up the worker
 */
preload = function(){
	return;
}

/**
 *  Reload the dataset used in this worker.
 *
 *  You must call this function successfully at least once after starting this
 *  worker, otherwise functions likes {@link filter} may not work properly.
 *
 *  @return `true` if dataset has been reloaded successfully, `false` on errors.
 */
_reload = function(){
	var xhttp = new XMLHttpRequest();

	xhttp.open('GET', '/data/search/groups15v2.json', false);
	xhttp.send(null);

	if (xhttp.status === 200) {
		try {
			var tmp = JSON.parse(xhttp.responseText);
			if (
				(Array.isArray(tmp.index_data) === true)
			){
				this.index_data = tmp.index_data;
				return true;
			}
			else {
				return false;
			}
		}
		catch (e){
			return false;
		}
	}
	else {
		return false;
	}
}

/**
 *  Filters a single object against a query
 *
 *  @param obj 	The item to filter
 *	@param query	The query to match (regex allowed)
 *
 *  @return True if the item matches the query, false otherwise
 */
_filter = function(obj, query){
	// var toReturn;

	return Object.keys(query)
		.map(item => obj[item] === null || query[item] === null || obj[item].match(query[item]))
		.reduce((acc, item) => acc && item, true);
	// toReturn = this.index_data.filter((item) => {
	// 	if (value === null || item[key] === null || item[key].match(value)){
	// 		return true;
	// 	}
	// 	else {
	// 		return false;
	// 	}
	// });

	// toReturn = toReturn.map(item => item.id);
	// // toReturn = this._remove_duplicates(toReturn);
	// // toReturn.sort();

	// return toReturn;
}

// /**
//  *  Remove duplicates from an array
//  *
//  * 	@param arr 	The array to remove duplicates from
//  *
//  *  @return The cleaned array
//  */
// _remove_duplicates = function(arr){
// 	arr.sort();
// 	arr = arr.reduce((list, item) => {
// 		if ((item) !== (list[0])){
// 			list.unshift(item);
// 		}
// 		return list;
// 	}, []);

// 	return arr;
// }