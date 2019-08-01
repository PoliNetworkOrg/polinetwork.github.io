		document.addEventListener("DOMContentLoaded", function(event) {
			document.getElementById("searchBar").search_callback = showSearchResults;
			document.getElementById("searchYearInput").onchange = function(){
				// Forcing search reload
				document.getElementById('searchBar').dispatchEvent(new Event('keyup'));
			}
			document.getElementById("triennale_o_magistrale_triennale").onchange = function(){
				// Forcing search reload
				document.getElementById('searchBar').dispatchEvent(new Event('keyup'));
			}
			document.getElementById("triennale_o_magistrale_magistrale").onchange = function(){
				// Forcing search reload
				document.getElementById('searchBar').dispatchEvent(new Event('keyup'));
			}
			document.getElementById("triennale_o_magistrale_unico").onchange = function(){
				// Forcing search reload
				document.getElementById('searchBar').dispatchEvent(new Event('keyup'));
			}
			document.getElementById("triennale_o_magistrale_all").onchange = function(){
				// Forcing search reload
				document.getElementById('searchBar').dispatchEvent(new Event('keyup'));
			}
			
			
			document.getElementById("tipo_gruppo_s").onchange = function(){
				// Forcing search reload
				document.getElementById('searchBar').dispatchEvent(new Event('keyup'));
			}
			document.getElementById("tipo_gruppo_c").onchange = function(){
				// Forcing search reload
				document.getElementById('searchBar').dispatchEvent(new Event('keyup'));
			}
			document.getElementById("tipo_gruppo_e").onchange = function(){
				// Forcing search reload
				document.getElementById('searchBar').dispatchEvent(new Event('keyup'));
			}
			document.getElementById("tipo_gruppo_a").onchange = function(){
				// Forcing search reload
				document.getElementById('searchBar').dispatchEvent(new Event('keyup'));
			}
			
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

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

function htmlDecode(input)
{
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}


function showSearchResults(data2){
			data = data2.data.data;
			
			var tipo = '';
			if ($('#tipo_gruppo_s').is(':checked'))
				tipo = 'S';
			else if ($('#tipo_gruppo_e').is(':checked'))
				tipo = 'E';
			else if ($('#tipo_gruppo_c').is(':checked'))
				tipo = 'C';
			else if ($('#tipo_gruppo_a').is(':checked'))
				tipo = 'A';
			
						
			var degree_lt = $('#triennale_o_magistrale_triennale').is(':checked') ? 1 : 0;
			var degree_lm = $('#triennale_o_magistrale_magistrale').is(':checked') ? 1 : 0;
			var degree_lu = $('#triennale_o_magistrale_unico').is(':checked') ? 1 : 0;
			var degree_all = $('#triennale_o_magistrale_all').is(':checked') ? 1 : 0;

			var year = document.getElementById("searchYearInput").value;
			data = data.filter((item) => {
				
				if (item.year == year && tipo == 'S'){
					;
				}
				else if (tipo != 'S') {
					;
				}
				else
					return false;
				
				
				if (degree_all)
				{
					;
				}
				else
				{
					if ((item.degree=="LT" && degree_lt) || (item.degree=="LM" && degree_lm) || (item.degree=="LU" && degree_lu) || (tipo != "S" && tipo != "A"))
					{
						;
					}
					else
					{
						return false;
					}
				}
				
				if (tipo == 'A')
					;
				else if (item.type != tipo)
					return false;
				
				
				return true;				
			})


			data.sort((a, b) => {
				return a.class.toLowerCase().localeCompare(b.class);
			});
			
			var text = document.getElementById('searchBar').value;
			
			var no_results = 0;
			var n_results = 0;
			var result_limit = 10;
			
			if (text.length > 0)
			{
				;
			}
			else
			{
				no_results = 1;
			}
	
			
			if (data.length > 0 && no_results == 0){
				html = data.reduce((html, item) => {

					n_results = n_results + 1;
					if (n_results > result_limit)
					{
						return html;
					}
					
					var bandiera = "";
					if (item.language == "ITA")
					{
						bandiera = "it_flag";
					}
					else if (item.language == "ENG")
					{
						bandiera = "en_flag";
					}
				
					item_link = item.id_link;
					
					item.class = item.class.replace("&apos;", "'");
					item.class = item.class.replace("&quot;", "\"");
					if (item.platform == "TG")
					{
						item_html = '<li>';
						item_html += '<a href="https://t.me/joinchat/' + item_link + '">';
						item_html += '<img style="width:18px;" src="../img/tg.svg" />';
						if (item.office)
						{
							item_html += "&nbsp;[";
							item_html += item.office
							item_html += "]&nbsp;";
						}
						else
						{
							item_html += "&nbsp;";
						}
						item_html += escapeHtml((item.class))

						item_html += "&nbsp;";
						item_html += '<img style="width:18px;" src="../img/'+bandiera+'.png" />';

						item_html += '</a>';
						item_html += '</li>';
						return html + item_html;
					}
					else if (item.platform == "FB")
					{
						item_html = '<li>';
						item_html += '<a href="https://www.facebook.com/groups/' + item_link + '">';
						item_html += '<img style="width:18px;" src="../img/fb.svg" />';
						if (item.office)
						{
							item_html += "&nbsp;[";
							item_html += item.office
							item_html += "]&nbsp;";
						}
						else
						{
							item_html += "&nbsp;";
						}
						item_html += escapeHtml(htmlDecode(item.class))
						
						item_html += "&nbsp;";
						item_html += '<img style="width:18px;" src="../img/'+bandiera+'.png" />';
						
						item_html += '</a>';
						item_html += '</li>';
						return html + item_html;
					}
					else if (item.platform == "WA")
					{
						item_html = '<li>';
						item_html += '<a href="https://chat.whatsapp.com/' + item_link + '">';
						item_html += '<img style="width:18px;" src="../img/wa.svg" />';
						if (item.office)
						{
							item_html += "&nbsp;[";
							item_html += item.office
							item_html += "]&nbsp;";
						}
						else
						{
							item_html += "&nbsp;";
						}
						item_html += escapeHtml(htmlDecode(item.class))
						
						item_html += "&nbsp;";
						item_html += '<img style="width:18px;" src="../img/'+bandiera+'.png" />';
						
						item_html += '</a>';
						item_html += '</li>';
						return html + item_html;
					}
					
					return html;
					
				}, "");

				document.getElementById("searchResult").innerHTML = html;

			}
			else {
				no_results = 2;
			}
			
			if (no_results != 0 || html.length == 0)
			{
				if (no_results == 1)
				{
					document.getElementById("error_search").innerHTML = "Non hai scritto il nome di nessun corso!";
				}
				else if (no_results == 2)
				{
					document.getElementById("error_search").innerHTML = "Ancora nessun risultato!";
				}
				else
				{
					document.getElementById("error_search").innerHTML = "Nessun risultato!";
				}
				
				document.getElementById("error_search").classList.remove("hide");
				document.getElementById("searchResult").classList.add("hide");
			}
			else {
				document.getElementById("error_search").classList.add("hide");
				document.getElementById("searchResult").classList.remove("hide");
			}
			
		}
		

		
		
		function display_forma_tabellare(){
			x = document.getElementById("forma_tabellare");
			if (x.classList.contains("hide"))
			{
				x.classList.remove("hide");
			}
			else
			{
				x.classList.add("hide");
			}
		}
		
