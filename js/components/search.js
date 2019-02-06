/**
 *  A search bar will be initialized for each input type="search".
 *  `search_callback`, property of the input, must contain the callback 
 *	function for processing search result
 *  Use data-limit to limit result length (-1 to remove limit)
 *
 *  This script can be safely load async defer
 */

document.addEventListener("DOMContentLoaded", init);

if (document.readyState !== "loading") {
	init();
}

function init(event) {
	els = document.querySelectorAll("input[type=search]");
	for (const el of els) {
		if (!el.search_callback){
			el.search_callback = function(data){console.log(data.data)}
		}
		el.search_worker = new Worker('/js/workers/search.js');
		el.search_worker.postMessage({
			op_id: "warmup",
			op_type: "preload",
			data: null
		});
		el.addEventListener("keyup", function(e){
			var q = new RegExp(this.value, "gi")
			this.search_worker.postMessage({
				op_id: "",
				op_type: "search",
				data: {
					query: {
						class: q,
						office: q,
						id: q,
						degree: q,
						school: q,
						group_type: q
					},
					join: "OR",
					limit: this.dataset.limit
				}
			});
		});
		el.search_worker.onmessage = el.search_callback;
	}
}