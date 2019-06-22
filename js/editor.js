var Editor = Editor || {};
(function(editor_) {
    var canv;
    var ctx;
    var bbc;
    var editor;
    
    function initialize() {
        editor = document.getElementsByClassName("editor")[0];
        setToolbar(editor);
        setPlain(editor);
    }

    function setToolbar(editor) {
        var toolbar = document.createElement('div');
        var menu = document.createElement('ul');
        var colors = ['black', 'white', 'red', 'green', 'blue', 'yellow'];

        toolbar.setAttribute('class', 'toolbar');

        menu.setAttribute('id', 'menu');
        toolbar.appendChild(menu);

        colors.forEach((e) => {
            var list = document.createElement('li');
            list.setAttribute('id', e)
            list.setAttribute('class', 'cButton');
            list.addEventListener('click', makeColor);
            list.addEventListener('mousedown', function(e) {
                e.preventDefault();
            })
            list.innerHTML = 'T';

            menu.appendChild(list);
        })

        let reverse = document.createElement('li');
        reverse.setAttribute('class', 'cButton');
        reverse.innerHTML = 'Reverse Background';
        reverse.addEventListener('click', reverseBackground);
        menu.appendChild(reverse);

        let confirm = document.createElement('li');
        confirm.setAttribute('class', 'cButton');
        confirm.addEventListener('click', parser);
        confirm.innerHTML = "Confirm"
        menu.appendChild(confirm);

        editor.appendChild(toolbar);
    }

    function setPlain(editor) {
        var plain = document.createElement('div');
        plain.setAttribute('class', 'plain');
        plain.setAttribute('id', 'edit');
        plain.setAttribute('contenteditable', 'true');
        plain.addEventListener('keyup', cbWrite);

        editor.appendChild(plain);
    }

    function makeColor(event) {
        var doc = document.getElementById('edit');
        var code = event.target.id;

        console.log(code);
        document.execCommand('ForeColor', false, code)
        if(doc) {
            doc.focus();
        }
        
        parser();
    }

    function reverseBackground() {
        var plain = document.getElementById('edit');
        var style = window.getComputedStyle(plain);
        var bgColor = style['background-color']

        if(bgColor == 'rgb(255, 255, 255)') {
            plain.style.backgroundColor = 'black';
        }
        else {
            plain.style.backgroundColor = 'white';
        }
    }

    function parser() {
        var nodes = Array.from(document.getElementById('edit').childNodes);
        var output = [];
        
        recursive(nodes, output);
        if(bbc)
            colorT(output, bbc);
    }

    function recursive(input, output) {
        if(input.length == 0) {
            return 0;
        }
        
        else {
            let cur = input.shift();
            
            if(cur.nodeType == 3) {
                output.push({text:cur.textContent, color: ""});
            }
            else {
                switch(cur.tagName) {
                    case 'FONT':
                        output.push({text:cur.textContent, color: cur.color});
                        break;
                        
                    case 'BR':
                        output.push({text: '', color: ""});
                        break;
                        
                    case 'DIV':
                        let depth = Array.from(cur.childNodes);
                        
                        if(output.length != 0) {
                            output.push({text: '\r\n', color: ""});
                        }
                        recursive(depth, output);
                        
                        break;
                        
                    case 'SPAN':
                        let depth2 = Array.from(cur.childNodes);
                        recursive(depth2, output);
                        break;
                } // end of the switch
            } // end of second else
            
            recursive(input, output);
            
        } // end of first else
    } // end of recursive function

    function colorT(arr, data) {
        let id = data.id;
        let bgImg = new Image();
        let pos = {x: data.lineInfo[0].x, y: data.lineInfo[0].y}
        let newline_pattern = /\n/;
        
        bgImg.src = localStorage[id];
        
        bgImg.onload = () => {
            ctx.clearRect(0,0,300,300);
            ctx.drawImage(bgImg, 0, 0);
            
            for(let i=0; i< arr.length; i++) {
                var textColor = arr[i].color || data.fillStyle;
                console.log(arr[i]);
                for(let j=0; j <arr[i].text.length; j++) {
                    var letter = arr[i].text[j];
                    
                    var isNewLine = newline_pattern.test(letter);
                    if(isNewLine) {
                        pos.y += 15;
                        pos.x = data.lineInfo[0].x;
                    }
                    else {
                        ctx.fillStyle = textColor;
                        ctx.font = "11px 굴림";
                        ctx.fillText(letter,pos.x,pos.y);
                        pos.x += ctx.measureText(letter).width;
                    }
                }
            }
        }
    }
    
    editor_.init = function(param) {
        canv = param.cv;
        ctx = param.ct;
        
        initialize();
    }
    
    editor_.setBBC = function(d) {
        bbc = d;
    }
    
    editor_.writeText = function(de) {
        parser(de);
    }
    
})(Editor);