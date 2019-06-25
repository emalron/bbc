var Editor = Editor || {};
(function(editor_) {
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
        confirm.innerHTML = "Confirm"
        menu.appendChild(confirm);

        editor.appendChild(toolbar);
    }
    
    function setEventFunctions(classID, func) {
        var list = Array.from(document.getElementsByClassName(classID));
        
        list.forEach( e => {
            e.addEventListener('click', func);
            e.addEventListener('mousedown', function(j) {
                j.preventDefault();
            });
        })
    }

    function setPlain(editor) {
        var plain = document.createElement('div');
        plain.setAttribute('class', 'plain');
        plain.setAttribute('id', 'edit');
        plain.setAttribute('contenteditable', 'true');
        plain.addEventListener('keyup', cbWrite);

        editor.appendChild(plain);
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
    
    editor_.init = initialize;
    
    editor_.setEvent = setEventFunctions;
    
})(Editor);