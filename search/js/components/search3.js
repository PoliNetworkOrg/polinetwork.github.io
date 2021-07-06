function updateSearch() {
    var cls = new RegExp(
        document.getElementById("searchBar").value
        .split(" ")
        .map(item => "(" + item + ")(.)*")
        .join(""), "gi");

    var type = null;
    if ($('#tipo_gruppo_s').is(':checked'))
        type = 'S';
    else if ($('#tipo_gruppo_e').is(':checked'))
        type = 'E';
    else if ($('#tipo_gruppo_c').is(':checked'))
        type = 'C';

    var degree = null;
    if ($('#triennale_o_magistrale_triennale').is(':checked'))
        degree = 'LT';
    else if ($('#triennale_o_magistrale_magistrale').is(':checked'))
        degree = 'LM';
    else if ($('#triennale_o_magistrale_unico').is(':checked'))
        degree = 'LU';

    var piattaforma = null;
    if ($('#scegli_piattaforma_wa').is(':checked'))
        piattaforma = 'WA';
    else if ($('#scegli_piattaforma_fb').is(':checked'))
        piattaforma = 'FB';
    else if ($('#scegli_piattaforma_tg').is(':checked'))
        piattaforma = 'TG';


    var anno = $("#searchYearInput").val();
    if (anno == "?/?")
        anno = null;


    window.worker.postMessage({
        op_id: "",
        op_type: "search",
        data: {
            query: {
                class: cls,
                year: anno,
                type: type,
                degree: degree,
                linkfunzionante: "Y",
                platform: piattaforma
            },
            join: "AND",
            limit: -1
        }
    });
}

function parseSearchResponse(data) {
    data = data.data;
    if (data.op_type === "preload") {
        document.getElementById("searchBar").onkeyup = updateSearch;
        document.getElementById("searchYearInput").onchange = updateSearch;
        document.getElementById("triennale_o_magistrale_triennale").onchange = updateSearch;
        document.getElementById("triennale_o_magistrale_magistrale").onchange = updateSearch;
        document.getElementById("triennale_o_magistrale_unico").onchange = updateSearch;
        document.getElementById("triennale_o_magistrale_all").onchange = updateSearch;

        document.getElementById("scegli_piattaforma_all").onchange = updateSearch;
        document.getElementById("scegli_piattaforma_wa").onchange = updateSearch;
        document.getElementById("scegli_piattaforma_fb").onchange = updateSearch;
        document.getElementById("scegli_piattaforma_tg").onchange = updateSearch;

        document.getElementById("tipo_gruppo_s").onchange = updateSearch;
        document.getElementById("tipo_gruppo_c").onchange = updateSearch;
        document.getElementById("tipo_gruppo_e").onchange = updateSearch;
        document.getElementById("tipo_gruppo_a").onchange = updateSearch;

        document.getElementById("searchBar").disabled = false;
        document.getElementById("searchYearInput").disabled = false;
        document.getElementById("triennale_o_magistrale_triennale").disabled = false;
        document.getElementById("triennale_o_magistrale_magistrale").disabled = false;
        document.getElementById("triennale_o_magistrale_unico").disabled = false;
        document.getElementById("triennale_o_magistrale_all").disabled = false;

        document.getElementById("scegli_piattaforma_all").disabled = false;
        document.getElementById("scegli_piattaforma_wa").disabled = false;
        document.getElementById("scegli_piattaforma_fb").disabled = false;
        document.getElementById("scegli_piattaforma_tg").disabled = false;

        document.getElementById("tipo_gruppo_s").disabled = false;
        document.getElementById("tipo_gruppo_c").disabled = false;
        document.getElementById("tipo_gruppo_e").disabled = false;
        document.getElementById("tipo_gruppo_a").disabled = false;

        document.getElementById("loading_search").classList.add("hide");
        document.getElementById("error_search").classList.remove("hide");
        document.getElementById("searchResult").classList.remove("hide");
    } else {
        showSearchResults(data.data);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("loading_search").classList.remove("hide");
    document.getElementById("error_search").classList.add("hide");
    document.getElementById("searchResult").classList.add("hide");

    document.getElementById("searchBar").disabled = true;
    document.getElementById("searchYearInput").disabled = true;
    document.getElementById("triennale_o_magistrale_triennale").disabled = true;
    document.getElementById("triennale_o_magistrale_magistrale").disabled = true;
    document.getElementById("triennale_o_magistrale_unico").disabled = true;
    document.getElementById("triennale_o_magistrale_all").disabled = true;

    document.getElementById("scegli_piattaforma_all").disabled = true;
    document.getElementById("scegli_piattaforma_wa").disabled = true;
    document.getElementById("scegli_piattaforma_fb").disabled = true;
    document.getElementById("scegli_piattaforma_tg").disabled = true;

    document.getElementById("tipo_gruppo_s").disabled = true;
    document.getElementById("tipo_gruppo_c").disabled = true;
    document.getElementById("tipo_gruppo_e").disabled = true;
    document.getElementById("tipo_gruppo_a").disabled = true;

    window.worker = new Worker('/js/workers/search_new.js');
    window.worker.postMessage({
        op_id: "warmup",
        op_type: "preload",
        data: null
    });
    window.worker.onmessage = parseSearchResponse;
});


var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, s => entityMap[s]);
}

const mapping = {
    language: {
        "ITA": "it_flag",
        "IT": "it_flag",
        "ENG": "en_flag",
        "EN": "en_flag",
        "__default__": ""
    },
    platform: {
        "TG": {
            "link_pre": "https://t.me/joinchat/",
            "link_post": "",
            "img": "tg"
        },
        "FB": {
            "link_pre": "https://www.facebook.com/groups/",
            "link_post": "",
            "img": "fb"
        },
        "WA": {
            "link_pre": "https://chat.whatsapp.com/",
            "link_post": "",
            "img": "wa"
        },
        "__default__": {
            "link_pre": "",
            "link_post": "",
            "img": ""
        }
    }
}

function applyMapping(item) {
    for (key in mapping) {
        if (item[key]) {
            if (mapping[key][item[key]] !== undefined) {
                item[key] = mapping[key][item[key]];
            } else {
                item[key] = mapping[key]["__default__"];
            }
        }
    }

    return item;
}

function genHtml(data) {
    var d = `
		<li>
			<a href="${data.platform.link_pre}${data.id_link}${data.platform.link_post}">
				<img style="width:18px;" src="../../img/${data.platform.img}.svg" />`;

    if (data.tipo != "C") {
        d = d + `${(data.office?`&nbsp[${data.office}]`:``)}`;
			d = d +`&nbsp`;
		}
		d = d + `${escapeHtml(data.class)}&nbsp`;
		
		if (data.language)
		{		
			d = d + `<img style="width:18px;" src="../../img/${data.language}.png" />`;
		}
		d = d + `</a></li>`;
		
	return d;
	
}

function compareType(a,b){
	switch(a.type)
	{
		case "G":
			return -1;
	}

	switch(b.type)
	{
		case "G":
			return 1;
	}

	return 0;
}

function checkGenerali(item){
    if (item.type == "G")
        return true;

    return false;
}

function checkNonGenerali(item){
    if (item.type == "G")
        return false;

    return true;
}

function showSearchResults(data){
  document.getElementById("searchResult").innerHTML = "";
  document.getElementById("error_search").innerHTML = "";

	data = data
		  .filter(item => item.id_link);
		  
	var data3 = data.reduce((unique, o) => {
		if(!unique.some(obj => obj.id_link === o.id_link)) {
			unique.push(o);
		}
		return unique;
	},[]);
	
	var anno = $("#searchYearInput").val();
	if (anno == "?/?")
	{
		for (var i=0; i< data3.length; i++){

			if (i<0)
				i =0;

			for (var j=0; j< data3.length; j++){

                if (i<0)
				i =0;

				if (j<0)
					j =0;

				if (i != j){
					if (data3[i].class ==data3[j].class && data3[i].platform == data3[j].platform)
					{
						if (data3[i].year == data3[j].year)
						{
							data3.splice(j,1);
							i--;
							j--;
						}
						else if (data3[i].year == "?/?")
						{
							data3.splice(i,1);
							i--;
							j--;
						}
						else if (data3[j].year == "?/?")
						{
							data3.splice(j,1);
							i--;
							j--;
						}
						else 
						{
							var yi = data3[i].year.split("/");
							var yj = data3[j].year.split("/");
							
							var yin = parseInt(yi[0]);
							var yjn = parseInt(yj[0]);

							if (yin == yjn)
							{
								data3.splice(j,1);
								i--;
								j--;
							}
							else if (yin > yjn)
							{
								data3.splice(j,1);
								i--;
								j--;
							}
							else if (yin < yjn)
							{
								data3.splice(i,1);
								i--;
								j--;
							}
						}
					}
				}
			}
		}
	}

	data = data3.sort((a,b) => compareType(a,b))
		  .slice(0, 20);

    dataGenerali = data.filter(checkGenerali);
    dataNonGenerali = data.filter(checkNonGenerali);

    dataGenerali = dataGenerali.sort((a, b) => a.class.toLowerCase().localeCompare(b.class))
		  .sort((a,b) => compareType(a,b))
		  .map(applyMapping)
		  .map(genHtml)
		  .join("");

    dataNonGenerali = dataNonGenerali.sort((a, b) => a.class.toLowerCase().localeCompare(b.class))
		  .sort((a,b) => compareType(a,b))
		  .map(applyMapping)
		  .map(genHtml)
		  .join("");

  if (document.getElementById('searchBar') && (document.getElementById('searchBar').value === "")){
    document.getElementById("error_search").innerHTML = "Non hai scritto il nome di nessun corso!";
  }
  else if (data.length === 0){
    document.getElementById("error_search").innerHTML = "Nessun risultato!";
  }
  else {
        if (dataGenerali && dataNonGenerali)
        {
            document.getElementById("searchResult").innerHTML = "<div>" + dataGenerali + "</div>   <hr />   <div>" + dataNonGenerali  + "</div>";
        }
        else if (dataGenerali)
        {
            document.getElementById("searchResult").innerHTML = "<div>" + dataGenerali + "</div>";
 
        }
        else if (dataNonGenerali)
        {
            document.getElementById("searchResult").innerHTML = "<div>" + dataNonGenerali + "</div>";
        }
    }
}