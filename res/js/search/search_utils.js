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

let queryOverheadYear = '';
let queryOverheadDegree = '';
let queryOverheadGroup = '';
let queryOverheadPlatform = '';
let queryOverheadLanguage = '';

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, s => entityMap[s]);
}

const mapping = {
    language: {
        "ITA": "it_flag",
        "IT": "it_flag",
        "ENG": "en_flag",
        "EN": "en_flag",
        "ITA-ENG": "en_flag",
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
        }
    }
}

function applyMapping(item) {
    for (key in mapping) {
        //if (item[key] && ( item[key] ==="TG" || item[key] ==="FB" || item[key] ==="TG") || item[key] ==="__default__" ) {
        if (item[key]){
            if (mapping[key][item[key]] !== undefined) {
                item[key] = mapping[key][item[key]];
            }
        }
    }

    return item;
}


function searchParamMapper(query) {
    let toReturnQuery = {class: query};
    if(queryOverheadYear !== ''){
        toReturnQuery.year = queryOverheadYear;
    }
    if(queryOverheadDegree !== ''){
        toReturnQuery.degree = queryOverheadDegree;
    }
    if(queryOverheadGroup !== ''){
        toReturnQuery.type = queryOverheadGroup;
    }
    if(queryOverheadPlatform !== ''){
        toReturnQuery.platform = queryOverheadPlatform;
    }
    if(queryOverheadLanguage !== ''){
        toReturnQuery.language = queryOverheadLanguage;
    }
    return toReturnQuery
}

document.addEventListener('DOMContentLoaded', _ => {
    Search.init();

    document.querySelectorAll('input[type="search"]').forEach(el => {
        const result_div = document.getElementById("searchResultsID");

        el.addEventListener('keyup', _ => {
          //alert(el.value + queryOverheadYear + queryOverheadDegree + queryOverheadGroup + queryOverheadPlatform + queryOverheadLanguage);
          //alert({class: el.value + queryOverheadYear + queryOverheadDegree + queryOverheadGroup + queryOverheadPlatform + queryOverheadLanguage});
            //Search.search({ class: el.value + queryOverheadYear + queryOverheadDegree + queryOverheadGroup + queryOverheadPlatform + queryOverheadLanguage } , 20)
            Search.search(searchParamMapper(el.value) , 20)
                .then(data => {
                    if (data.length === 0) {
                        result_div.innerHTML = '<div class=\"result\"><div class="resultContainer"><a class="noResults" href="\https://t.me/PoliGruppo">There are no suggestions for your query. <i>Try asking here</i></a></div></div>';
                    }
                    else {
                        /*result_div.innerHTML = data
                            .map(applyMapping)
                            .map(genHtml)
                            .join('');

                         */
                        showSearchResults(data)
                    }

                    activateResultsDiv();
                })
                .catch(e => {
                    console.error(e);
                });
        })
    })
});


function activateResultsDiv() {
    var bar = document.getElementById("searchBarID");
    var container = document.getElementById("searchContainerID");
    if (bar.value.length > 0) {
        if (!container.classList.contains("searchResultsActive")) {
            container.classList.add("searchResultsActive");
        }
    } else {
        if (container.classList.contains("searchResultsActive")) {
            container.classList.remove("searchResultsActive");
        }
    }
}

function showSearchResults(data){
    let result_div = document.getElementById("searchResultsID");
    data = data
        .filter(item => item.id_link);

    var data3 = data.reduce((unique, o) => {
        if(!unique.some(obj => obj.id_link === o.id_link)) {
            unique.push(o);
        }
        return unique;
    },[]);

    if (queryOverheadYear == "?/?")
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

    var dictDati = {};

    dictDati["G"] = data.filter(checkFiltroTipo("G", true));
    dictDati["S"] = data.filter(checkFiltroTipo("S", true));
    dictDati["C"] = data.filter(checkFiltroTipo("C", true));
    dictDati["E"] = data.filter(checkFiltroTipo("E", true));

    dictNomi = {};
    dictNomi["G"] = "Generale";
    dictNomi["E"] = "Extra";
    dictNomi["!G"] = "Altro";
    dictNomi["S"] = "Scolastico";
    dictNomi["C"] = "Corso (esame)";


    for(var key in dictDati) {
        dictDati[key] = dictDati[key].sort((a, b) => a.class.toLowerCase().localeCompare(b.class))
            .sort((a,b) => compareType(a,b))
            .map(applyMapping)
            .map(genHtml)
            .join("");
    }

    results = getResultsString(dictDati, dictNomi);
    result_div.innerHTML = results;

}

function getResultsString(dictDati, dictNomi){

    let key;
    for (key in dictDati){
        if (!dictDati[key])
        {
            delete dictDati[key];
        }
    }

    const size = Object.keys(dictDati).length;

    if (size === 0)
        return "";

    let r = "";
    let i = 0;
    for (key in dictDati){
        r += "<div>";
        r += '<p class="searchTypeDivider">';
        r += dictNomi[key];
        r += "</p>";
        r += dictDati[key];
        r += "</div>";
        if (i !== size -1){ //non è ultimo
            r += "<hr />";
        }

        i++;
    }

    return r;
}

function genHtml(data) {
    let d = `
    <div class="result">
    <div class="resultContainer">
    <a class="resultLink" href="${data.platform.link_pre}${data.id_link}${data.platform.link_post}">
    <img style="width:18px;" src="/img/${data.platform.img}.svg" />`;

    if (data.tipo !== "C") {
        d += `${(data.office ? `&nbsp[${data.office}]` : ``)}`;
        d += `&nbsp`;
    }
    d += `${escapeHtml(data.class)}&nbsp`;

    if (data.language) {
        d += `<img style="width:18px;" src="/img/${data.language}.png" />`;
    }
    d += `</a></div></div>`;

    return d;

}

function checkFiltroTipo(tipo, negate_false){
    return function(item){
        if (negate_false)
        {
            return item.type == tipo;
        }
        else
        {
            return item.type != tipo;
        }
    }
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