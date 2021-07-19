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
            }
            else {
                item[key] = mapping[key]["__default__"];
            }
        }
    }

    return item;
}


function genHtml(data) {
    var d = `
<div class="result">
<div class="resultContainer">
<a class="resultLink" href="${data.platform.link_pre}${data.id_link}${data.platform.link_post}">
<img style="width:18px;" src="/img/${data.platform.img}.svg" />`;

    if (data.tipo != "C") {
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


document.addEventListener('DOMContentLoaded', _ => {
    Search.init();

    document.querySelectorAll('input[type="search"]').forEach(el => {
        const result_div = document.getElementById("searchResultsID");

        el.addEventListener('keyup', _ => {
            Search.search({ class: el.value}, 20)
                .then(data => {
                    if (data.length == 0) {
                        result_div.innerHTML = '<div class=\"result\"><div class="resultContainer"><a class="noResults" href="\https://t.me/PoliGruppo">There are no suggestions for your query. <i>Try asking here</i></a></div></div>';
                    }
                    else {
                        result_div.innerHTML = data
                            .map(applyMapping)
                            .map(genHtml)
                            .join('');
                    }

                    activateResultsDiv();
                })
                .catch(e => {
                    el.setAttribute('disable', true);
                    el.setAttribute('placeholder', 'Search Broke Down :(');
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
