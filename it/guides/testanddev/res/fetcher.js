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
fetch(window.location.pathname.split('/').pop().split('.')[0] + '.txt')
.then(res => res.text())
.then(data => {
    lines = data.split('\n')
    lines = lines.map(line => line.replace('\r', ''))
    l = lines.length
    doc = '<body><div class="wrapper"><h2><span class="accent">./</span>Polinetwork_Guides<span class="accent">/</span>Info<span class="accent">/</span></h2><div class="title"><h1>'
    document.title = lines[0]
    doc += lines[0]
    doc += '</h1></div>'
    i = 1

    // skips newlines after the title
    while (i < l && lines[i] === '') ++i
    doc += '<div class="subtitle">'
    while (i < l && lines[i] !== '') doc += lines[i++] + ' '
    doc += '</div>'
    // skips newlines after the subtitle
    while (i < l && lines[i] === '') ++i
    while (i < l) {
        // if a new course is beginning
        if (lines[i++].slice(0, 3) === '###') {
            doc += '<div class="course"><h3>' + lines[i-1].slice(3) + '</h3>'
            while (i < l && (lines[i].slice(0, 8) === 'TELEGRAM' || lines[i].slice(0, 8) === 'WHATSAPP' || lines[i].slice(0, 8) === 'MANIFEST'))
                if (lines[i].slice(0, 8) === 'TELEGRAM'){
                    doc += '<a href="' + lines[i-1].slice(8) + '"><img class="telegram" src="res/telegram.webp"></a>'
                    i++;
                } else if (lines[i].slice(0, 8) === 'WHATSAPP'){
                    doc += '<a href="' + lines[i-1].slice(8) + '"><img class="telegram" src="res/wa.svg"></a>'
                    i++;
                }else{
                    doc += '<a href="' + lines[i-1].slice(8) + '"><img class="manifest" src="res/manifest.png"></a>'
                    i++
                  }
            for (;i < l; ++i) {
                if (lines[i] === '') continue
                // if a new course line is found exit from current course construction
                if (lines[i].slice(0, 3) === '###') break
                else { // first nonempty line is found, means a new comment
                    doc += '<div class="comment">' + lines[i++] + ' '
                    // as long as there is no empty line
                    for (;i < l && lines[i] !== '' && lines[i].slice(0, 3) !== '###'; ++i) {
                        doc += lines[i] + ' '
                    }
                    doc += '</div>'
                    if (i < l && lines[i].slice(0, 3) === '###') break
                } // end of comment
            } // end of commentS
            doc += '</div>'
        } // end of course
    } // end of courseS
    doc += '<div class="footer">Un\'iniziativa Polinetwork. Trova altro su <span class="accent"><a href="https://polinetwork.github.io">polinetwork.github.io</a></span>'
    doc += '<br>Per commenti o suggerimenti contatta @EliaMaggioni o @LuigiFusco su Telegram</div>'
    document.body.innerHTML = doc
}).catch(e => alert('Error parsing the file, please contact an admin! ' + e))
