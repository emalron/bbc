// needed to make module

var data = {};
var database = {};
var selectedImg = {};

// loading process

window.onload = function() {
    // set initial canvas stuffs
    var canv = document.getElementById("dis");
    
    // editor setup
    Editor.init();
    Editor.setEvent("cButton", Model.makeColor);
    
    // set Model;
    Model.init({canvas: canv, editor: "edit"})
    
    // setup database
    let path = "data/sample0.txt";
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            database = JSON.parse(this.responseText);
            drawGallery(database.images.length);
            setImagesToLocalStorage();
            makeBaker();
        }
    }
    req.open("GET", path, true);
    req.send();
}

function drawGallery(nums) {
    let gallery = document.getElementById("gallery");
    
    for(i=0;i<nums;i++) {
        addImage(gallery, i);
    }
}

function addImage(gallery, id) {
    var img = document.createElement("img");
    img.src = "img/o" + id + ".png";
    img.id = id;
    img.setAttribute("onclick", 'cbSelect(this)')
    img.setAttribute("class", 'gallery-img')
    
    gallery.appendChild(img);
}

function setImagesToLocalStorage() {
    for(let i=0;i<database.images.length;i++) {
        getImage(i)
        .then(extractURL);
    }
}

function getImage(i) {
    return new Promise(function(resolve, reject) {
        let image = new Image();
        let path = 'img/e' + i + '.png';
        
        image.src = path;
        
        let data = {
            index: i,
            image: image
        }
        
        image.addEventListener('load', ()=>{
            resolve(data);
        });
    });
}

function extractURL(param) {
    var ctx = Model.getCtx();
    var canvas = Model.getCanvas();
    
    ctx.drawImage(param.image,0,0);
    let url = canvas.toDataURL();
    ctx.clearRect(0,0,100,100);
    
    localStorage.setItem(param.index, url);
}

function makeBaker() {
    var baker = document.getElementsByClassName('baker')[0];
    baker.innerHTML = "Click to bake image";
    baker.addEventListener('click', cbDone);
}


var cbSelect = function(img) {
    let id = img.id;
    let canvas = Model.getCanvas();
    let ctx = Model.getCtx();
    
    if(selectedImg.id != undefined) {
        let pid = selectedImg.id;
        selectedImg.src = "img/o" + pid +".png";
    }
    selectedImg = img;
    selectedImg.src = "img/w" + id + ".png";
    
    let origin = document.getElementById("original-img");
    
    origin.src = "img/o" + id + ".png";
    
    // set canvas setting
    canvas.width = selectedImg.width;
    canvas.height = selectedImg.height;
    ctx.font = "11px 굴림";
    
    // selectData
    setData(database, id);
    Model.setBBC(data);
    document.getElementById("edit").focus();
    if(data != null) {
        var text = Model.parser(); 
        colorT(text, data);
    } 
}

var cbWrite = function(text) {
    if(data != null) {
        var text = Model.parser();
        
        colorT(text, data);
    }
}

function colorT(arr, data) {
    let ctx = Model.getCtx();
    
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
        } // end of 
    }
} // end of colorT

var cbDone = function() {
    if(selectedImg.id != undefined) {
        let img = document.getElementById("output-img");
        let canv = document.getElementById("dis");

        let img_data = canv.toDataURL();
        img.src = img_data;

        // copy the image to clipboard...

        gtag('event', 'bake', {
            'event_category': 'work done',
            'event_label': selectedImg.id
        });
    }
}


var setData = function(jsonData, id) {
    data = jsonData.images[id];
    let lineInfo = [];
    
    data.boxes.forEach(box=> {
        for(i=0;i<box.line;i++) {
            addLinInfo(lineInfo, box.x, box.y, box.width, i);
        }
    })
    
    data["lineInfo"] = lineInfo;
}

function addLinInfo(array, x, y, width, i) {
    array.push(
            {
                x: x,
                y: y + 12 + (10 + 5)*i,
                line: i,
                width: width
            });
}
