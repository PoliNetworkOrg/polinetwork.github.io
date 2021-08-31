# imports
import os
import time
import traceback
import urllib.request
from bs4 import BeautifulSoup
import datetime
import codecs
import sys

try:
    from urllib.parse import urlparse, urljoin
except ImportError:
    try:
        from urlparse import urlparse
    except Exception as e_import:
        print(e_import)

# variables
to_download = []
success_download = 0
global url_global


# methods
def addLink(link):
    j = 0
    while j < len(to_download):
        url2 = to_download[j]["url"]
        if url2 == link:
            return
        j = j + 1

    elem2 = {"url": link}
    to_download.append(elem2)


def filterLink(soup, url):
    url = str(url)

    new_soup = BeautifulSoup('<link rel="stylesheet" href="%s" type="text/css">' % '../style/ateneo2014.css',
                             features="html.parser")
    soup.head.insert(0, new_soup)
    new_soup2 = BeautifulSoup('<link rel="stylesheet" href="%s" type="text/css">' % '../style/desktop.css',
                              features="html.parser")
    soup.head.insert(0, new_soup2)
    new_soup3 = BeautifulSoup('<link rel="stylesheet" href="%s" type="text/css">' % '../style/graduatorie.css',
                              features="html.parser")
    soup.head.insert(0, new_soup3)
    new_soup4 = BeautifulSoup("<meta charset='UTF-8'>",
                              features="html.parser")
    soup.head.insert(0, new_soup4)

    if url.endswith("_generale.html"):
        soup.select_one(".titolo").decompose()
        soup.select_one(".BoxInfoCard").decompose()
        new_soup5 = BeautifulSoup("<div style=\"padding: 1.1rem;font-weight: bold;font-size: calc(1.2rem + 0.1vw);\">"
                                  "<a href=\"./../\">"
                                  "🔙 Go to back homepage to see all rankings"
                                  "</a>"
                                  "</div>",
                                  features="html.parser")
        soup.select_one(".TablePage").insert(0, new_soup5)

        pass
    elif "_indice.html" in url and "sotto_indice.html" not in url:
        return None
    elif "_sotto_" in url and "sotto_indice.html" not in url:
        # da rimuovere la colonna matricola
        tab = soup.find("table", {"class": "TableDati"})
        soup.select(".HeadColumn1")[1].decompose()
        rows = tab.select_one(".TableDati-tbody")
        for row in rows:
            row.select(".Dati1")[1].decompose()

        return soup

    elif "_grad_" in url and "_M.html" in url:
        # da rimuovere la colonna matricola (prima colonna)
        tab = soup.find("table", {"class": "TableDati"})
        soup.select_one(".HeadColumn1").decompose()
        rows = tab.select_one(".TableDati-tbody")
        for row in rows:
            row.select_one(".Dati1").decompose()

        return soup

    return soup
    pass


def getCorso(soup):
    if soup is None:
        return None

    item = soup.select(".intestazione")[2]
    return item

    pass


def getFase(soup):
    if soup is None:
        return None

    item = soup.select(".intestazione")[3]
    return item
    pass


def downloadAndAddChildrenUrl1(i2, start2, i_url):
    global url_global
    global success_download

    elem2 = to_download[i2]
    url = elem2["url"]
    try:
        soup = BeautifulSoup(urllib.request.urlopen(url), features="html.parser")
        soup = filterLink(soup, url)
        to_download[i2]["content"] = soup
        if i2 == 0:
            url_global[i_url]["corso"] = getCorso(soup)
            url_global[i_url]["fase"] = getFase(soup)

        if soup is not None:
            success_download += 1
            for link in soup.find_all('a', href=True):
                link = urljoin(url, link["href"])
                if link.startswith(start2):
                    addLink(link)
                else:
                    print("Link not valid! " + link + "\n")

    except Exception as e:
        print("Failed to download [" + url + "]")
    pass


def directoryOutput(url, base_output2, start_len2, return_first_folder):
    url2 = url[start_len2:]
    url3 = url2.split("/")

    if len(url3) == 0:
        return None

    if url3[0] is None or len(url3[0]) == 0:
        url3.pop(0)

    if len(url3) == 0:
        return None

    path2 = base_output2
    j = 0
    while j < (len(url3) - 1):
        path2 = path2 + "/" + url3[j]

        if return_first_folder:
            return path2, url3[0]

        if os.path.isdir(path2):
            pass
        else:
            os.makedirs(path2)

        j = j + 1

    return path2 + "/" + url3[len(url3) - 1], url3[0]


def downloadAndAddChildrenUrl(url, start2, base_output2, i_url, only_first):
    elem2 = {"url": url}
    to_download.append(elem2)

    i2 = 0
    if not only_first:
        while i2 < len(to_download):
            downloadAndAddChildrenUrl1(i2, start2, i_url)
            i2 = i2 + 1
    else:
        downloadAndAddChildrenUrl1(i2, start2, i_url)

    start_len2 = len(start2)
    i2 = 0
    while i2 < len(to_download):
        url2 = str(to_download[i2]["url"])
        path2, path_first = directoryOutput(url2, base_output2, start_len2, return_first_folder=False)
        file_to_write = None
        try:
            file_to_write = to_download[i2]["content"]
        except:
            pass

        if file_to_write is not None:
            if path2 is not None:
                with open(path2, "w", encoding='utf-8') as file:
                    file.write(str(file_to_write))

        i2 = i2 + 1

        pass


def executeDownload(url, i2, start2, base_output2, only_first):
    global to_download
    global success_download

    time.sleep(1)

    to_download = []
    success_download = 0
    try:
        downloadAndAddChildrenUrl(url[i2]["url"], start2, base_output2, i2, only_first)
        if success_download > 0:
            print("Done [" + url[i2]["url"] + "]")
            return 1
        else:
            print("Error [" + url[i2]["url"] + "]")
            return 0
    except Exception as e:
        print(traceback.format_exc())
        print("Error [" + url[i2]["url"] + "] => " + str(e))
        return 0

    return 0


def generateUrl(start2):
    global url_global

    url_global = []
    now = datetime.datetime.now()
    year = int(now.year)
    kl = [2, 5, 6, 7, 8, 40, 41, 42, 45, 54, 60, 64, 69, 91, 102, 103, 104]
    # kl = range(500,1000) #todo: remove later

    i2 = 2018
    while i2 <= year:

        j = 0  # j = 0 => html, j = 1 => htm
        while j < 2:

            js = ""
            if j == 0:
                js = "html"
            else:
                js = "htm"

            k = 0
            while k < len(kl):
                ks = (str(kl[k])).zfill(3)
                ks2 = str(i2) + "_" + "20" + str(ks) + "_"
                single = start2 + "/" + ks2 + js + "/" + ks2 + "generale.html"

                elem2 = {"url": single, "year": i2}
                url_global.append(elem2)

                k = k + 1

            j = j + 1

        i2 += 1

    pass


def write_html(html, base_output2):
    path2 = base_output2 + "/index.html"
    with open(path2, "w", encoding='utf-8') as file:
        file.write(str(html))
    pass


def write_index(index_links2, base_output2):
    # sort
    index_links2.sort(key=lambda x: x["year"], reverse=True)

    i2 = 0
    j = 0
    while i2 < len(index_links2):

        while j < (len(index_links2) - 1):

            str1 = None
            str2 = None

            if "fase" in index_links2[j]:
                str1 = str(index_links2[j]["fase"]).lower()

            if "fase" in index_links2[j + 1]:
                str2 = str(index_links2[j + 1]["fase"]).lower()

            if str1 is None and str2 is None:
                pass
            elif str2 is None:
                pass
            elif str1 is None or str1 > str2:
                temp = index_links2[j]
                index_links2[j] = index_links2[j + 1]
                index_links2[j + 1] = temp
            else:
                pass

            j = j + 1

        i2 = i2 + 1

    index_links2.sort(key=lambda x: x["year"], reverse=True)

    # write
    html = "<html>\n"
    html += "<head>\n"
    html += "<meta charset='UTF-8'>\n"
    html += "<style>" \
            " li { padding:0.5rem;border: 1px solid;margin: 1rem;border-radius: 1rem; } " \
            "ul{padding-left: 0.1rem;}" \
            " body{overflow: auto;padding:0.5rem;}" \
            " h1{overflow: auto;font-size: calc(1.25rem + 1.25vw);}" \
            "h4{overflow:auto;}" \
            "</style>\n"
    html += "</head>\n"
    html += "<body>\n"
    html += "<h1>\n"
    html += "Graduatorie/Rankings\n"
    html += "</h1>\n"
    html += "<div>\n"
    html += "<ul>\n"
    for item in index_links2:
        html += "<li>\n"
        if "delete" in item:
            html += "<p style='color:black;'>[Deleted in the Polimi website]</p>";
        link = "." + item["path"]
        html += "<a href='" + link + "'>\n"
        if "corso" in item:
            html += str(item["year"]) + " " + str(item["corso"]) + " " + str(item["fase"]) + "\n"
        else:
            html += str(item["year"]) + "\n"
        html += "</a>\n"
        html += "</li>\n"
        pass
    html += "</ul>\n"
    html += "</div>\n"
    html += "<br />\n"
    html += "<h4>\n"
    html += "Website by "
    html += "<a href='./../'>"
    html += "PoliNetwork"
    html += "</a>\n"
    html += "</h4>\n"
    html += "</body>\n</html>\n"

    write_html(html, base_output2)

    pass


def selectWorkingBaseOutput(base_output):
    if base_output is None:
        return None

    if len(base_output) == 0:
        return None

    if len(base_output) == 1:
        return base_output[0]

    if len(base_output) > 1:
        for b in base_output:
            if os.path.exists(b):
                return b

    return None
    pass


def getPath(param, param1):
    pass

    p2 = param1.split("/")

    return param + "/" + p2[2]


def getCorsoFase(url_global_item, elem):
    path = getPath(elem["index"], elem["path"])
    if path is None:
        return None, None

    path = str(path)

    with open(path, 'r') as f:
        contents = f.read()

        soup = BeautifulSoup(contents, features="html.parser")

        return getCorso(soup), getFase(soup)

    return None, None


# main
if __name__ == '__main__':

    global url_global

    start = "http://www.risultati-ammissione.polimi.it"
    base_output = []
    if sys.argv is None or len(sys.argv) < 2 or sys.argv[1] is None:
        base_output.append("D:\\git\\Polimi\\polinetwork.github.io\\graduatorie")
        base_output.append("C:\\git\\polinetwork.github.io\\graduatorie")
    else:
        base_output.append(sys.argv[1])
    start_len = len(start)

    base_output = selectWorkingBaseOutput(base_output)

    if base_output is None:
        print("Base output error!")
        exit(-2)

    base_output = str(base_output)
    print("Chosen base output: " + base_output)

    generateUrl(start)

    index_links = []

    i = 0
    while i < len(url_global):

        url_global_item = url_global[i]

        success = -1
        folder, folder_first = directoryOutput(url_global_item["url"], base_output, start_len, return_first_folder=True)
        if os.path.isdir(folder):
            files = os.listdir(folder)
            if files is None or len(files) == 0:
                success = executeDownload(url_global, i, start, base_output, only_first=False)
            else:
                print("Already done [" + url_global_item["url"] + "]")
                executeDownload(url_global, i, start, base_output, only_first=True)
                success = 2
        else:
            success = executeDownload(url_global, i, start, base_output, only_first=False)

        if success == 1 or success == 2:
            path = url_global_item["url"][start_len:]
            if "corso" in url_global_item:
                elem = {
                    "url": url_global_item["url"],
                    "index": folder,
                    "folder": folder_first,
                    "year": url_global_item["year"],
                    "path": path,
                    "corso": url_global_item["corso"],
                    "fase": url_global_item["fase"]
                }
                index_links.append(elem)
            else:
                if success == 1:
                    pass
                elif success == 2:
                    elem = {
                        "url": url_global_item["url"],
                        "index": folder,
                        "folder": folder_first,
                        "year": url_global_item["year"],
                        "path": path
                    }

                    corso, fase = getCorsoFase(url_global_item, elem)

                    elem["corso"] = corso
                    elem["fase"] = fase
                    elem["delete"] = True

                    index_links.append(elem)
            pass

        i = i + 1

    print("Download done [all]!")

    write_index(index_links, base_output)

    exit(0)
