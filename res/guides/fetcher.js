/*
this is the expected format of the data.txt file:
the first line is the title;
any number of empty lines can follow;
the first nonempty line and all following lines are interpreted as a subtitle, until an empty line is found;
any number of empty lines can follow;
then looping until end:
    the first nonempty line starting with '###' is interpreted as a course title;
    if the *contiguous* string(s) start with 'TELEGRAM' or 'MANIFEST' they are interpreted as links;
    loop until a new string starting with '###' is found:
        contiguous nonempty lines make up a single comment, comments are separated by any number of empty lines;

NOTE THAT:
any number of empty lines can go between different courses
the symbol '###' is dedicated to course title, USING IT ELSEWERE BREAKS EVERYTHING (not really but you get the point)
HTML can be embedded in the comments, yay! (please do not hackerino thks)
*/
let filelocation = window.location.pathname;
if (filelocation.slice(-1) == "/") {
  window.location.href = "/" + filelocation.slice(1, -1) + ".html";
}
fetch(filelocation.split("/").pop().split(".")[0] + ".txt")
  .then((res) => res.text())
  .then((data) => {
    let shuffle = false;
    if (data.startsWith("@SHUFFLE@")) {
      data = data.substring("@SHUFFLE@\\n".length);
      console.log("t:", data[1]);
      shuffle = true;
    }
    lines = data.split("\n");

    lines = lines.map((line) => line.replace(new RegExp("\r", "g"), ""));
    //lines = lines.map(line => line.replace('\r', ''))

    l = lines.length;
    path = window.location.pathname.split("/");
    console.log(path.length);
    doc = "";
    if (path.length > 4)
      doc =
        '<body><div class="wrapper"><h2>.<span class="accent">/</span><a class="" href="/">PoliNetwork</a><span class="accent">/</span><a class="" href="../">' +
        capitalizeFirstLetter(path[2]) +
        '</a><span class="accent">/</span><a class="" href="./">' +
        capitalizeFirstLetter(path[3]) +
        '</a><span class="accent">/</span></h2><div class="title"><h1>';
    else if (path.length <= 4)
      doc =
        '<body><div class="wrapper"><h2>.<span class="accent">/</span><a class="" href="/">PoliNetwork</a><span class="accent">/</span><a class="" href="./">' +
        capitalizeFirstLetter(path[2]) +
        '</a><span class="accent">/</span></h2><div class="title"><h1>';
    document.title = lines[0];
    doc += lines[0];
    doc += "</h1></div>";
    i = 1;
    // skips newlines after the title
    while (i < l && lines[i] === "") ++i;
    doc += '<div class="subtitle">';
    while (i < l && lines[i] !== "") doc += lines[i++] + " ";
    doc += "</div>";
    // skips newlines after the subtitle
    while (i < l && lines[i] === "") ++i;
    let course = "";
    let courses = [];
    while (i < l) {
      // if a new course is beginning
      if (lines[i++].slice(0, 3) === "###") {
        course +=
          '<div class="course"><div class="collapsible"><div class="containerFA"><i class="fa fa-angle-down"></i></div><h3>' +
          lines[i - 1].slice(3) +
          "</h3>" +
          "</div>" +
          '<div class="content">';
        while (
          i < l &&
          (lines[i].slice(0, 8) === "TELEGRAM" ||
            lines[i].slice(0, 8) === "MANIFEST" ||
            lines[i].slice(0, 8) === "WHATSAPP" ||
            lines[i].slice(0, 4) === "MAIL")
        ) {
          if (lines[i].slice(0, 8) === "TELEGRAM")
            course +=
              '<a href="' +
              lines[i].slice(8) +
              '"><img class="telegram" src="/res/guides/telegram.webp"></a>';
          else if (lines[i].slice(0, 8) === "MANIFEST")
            course +=
              '<a href="' +
              lines[i].slice(8) +
              '"><img class="manifest" src="/res/guides/manifest.png"></a>';
          else if (lines[i].slice(0, 8) === "WHATSAPP")
            course +=
              '<a href="' +
              lines[i].slice(8) +
              '"><img class="telegram" src="/img/wa.svg"></a>';
          else if (lines[i].slice(0, 4) === "MAIL")
            course +=
              '<a href="' +
              lines[i].slice(4) +
              '"><img class="telegram" src="/img/mail.svg"></a>';
          i++;
        }
        for (; i < l; ++i) {
          if (lines[i] === "") continue;
          // if a new course line is found exit from current course construction
          if (lines[i].slice(0, 3) === "###") break;
          else {
            // first nonempty line is found, means a new comment
            course += '<div class="comment">' + lines[i++] + " ";
            // as long as there is no empty line
            for (
              ;
              i < l && lines[i] !== "" && lines[i].slice(0, 3) !== "###";
              ++i
            ) {
              course += lines[i] + " ";
            }
            course += "</div>";
            if (i < l && lines[i].slice(0, 3) === "###") break;
          } // end of comment
        } // end of commentS
        course += "</div>";
        course += "</div>";
      } // end of course
      courses.push(course);
      course = "";
    } // end of courseS
    if (shuffle) courses = shuffleArray(courses);
    courses.forEach((a) => {
      doc += a;
    });
    let oppositeLangPath = window.location.pathname
      .split("/")
      .slice(2, window.location.pathname.length)
      .join("/");
    if (window.location.pathname.split("/")[1] == "it") {
      doc +=
        '<div class="footer">Un\'iniziativa PoliNetwork. Trova altro su <span class="accent"><a href="https://polinetwork.org">polinetwork.org</a></span>';
      doc +=
        '<br>Per commenti o suggerimenti contatta <a href="https://t.me/eliamaggioni" class="accent">@EliaMaggioni</a> su Telegram</div>';
      doc +=
        '<div"><span class="accent"><a href="/en/' +
        oppositeLangPath +
        '">Switch to EN</a></span></div>';
    } else {
      doc +=
        '<div class="footer">A PoliNetwork initiative. Find more at <span class="accent"><a href="https://polinetwork.org">polinetwork.org</a></span>';
      doc +=
        '<br>For comments or suggestions contact <a href="https://t.me/eliamaggioni" class="accent">@EliaMaggioni</a> on Telegram</div>';
      doc +=
        '<div"><span class="accent"><a href="/it/' +
        oppositeLangPath +
        '">Switch to IT</a></span></div>';
    }
    document.body.innerHTML = doc;

    // buttons to expand sections
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        var childNodes = this.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
          childNodes[i].classList.toggle("active"); // <a>
        }
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  })
  .catch((e) => alert("Error parsing the file, please contact an admin! " + e));

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
