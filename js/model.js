var Model = Model || {};
(function(model_) {
    var canv;
    var ctx;
    var editor;
    var bbc;

    function parser() {
        var nodes = Array.from(editor.childNodes);
        var output = [];
        
        recursive(nodes, output);
        return output;
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

    
    function makeColor(event) {
        var code = event.target.id;

        document.execCommand('ForeColor', false, code)
        if(editor) {
            editor.focus();
        }
        
        cbWrite();
    }
    
    model_.init = function(param) {
        canv = param.canvas;
        ctx = canv.getContext('2d');
        editor = document.getElementById(param.editor);
    }
    
    model_.parser = parser;
    
    model_.setBBC = (d) => {
        bbc = d;
    }
    
    model_.getCtx = function() {
        return ctx;
    }
    model_.getCanvas = function() {
        return canv;
    }
    
    model_.makeColor = makeColor;
    
})(Model);