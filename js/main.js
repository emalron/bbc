var canvas;
var ctx;
var image;
var data = {};
var database = {};
var selectedImg = {};

window.onload = function() {
    canvas = document.getElementById("dis");
    ctx = canvas.getContext('2d');
    
    let path = "data/sample0.txt";
    
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            database = JSON.parse(this.responseText);
            drawGallery(database.images.length);
        }
    }
    req.open("GET", path, true);
    req.send();
    
}

var cbSelect = function(img) {
    let id = img.id;
    
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
    
    // clear textarea
    let textA = document.getElementById("text");
    textA.value = "";
    
    // selectData
    setData(database, id);
}

var cbWrite = function(text) {
    if(data != null) {
        writeText(text, data);
    }
}

var cbDone = function() {
    let img = document.getElementById("output-img");
    let canv = document.getElementById("dis");
    
    let img_data = canv.toDataURL();
    img.src = img_data;
    
    // copy the image to clipboard...
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
    
    gallery.appendChild(img);
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


var writeText = function(text, data) {
    let letters = text.split("");
    let line = 0;
    let lines = new Array(data.lineInfo.length);
    let metric = 0;
    let wid = 0;
    let unit = 0;
    let testLine;
    
    for(i=0;i<data.lineInfo.length;i++) {
        lines[i] = "";
    }
    
    while(letters.length > 0) {
        unit = ctx.measureText(letters[0]).width;
        metric = ctx.measureText(lines[line]).width + unit;
        wid = data.lineInfo[line].width;
        
        testLine = metric >= wid;
        if(testLine) {
            let j = ctx.measureText(lines[line]).width;
            if(line+1 >= lines.length) {
                lines.push = [];
                let dex = data.lineInfo;
                addLinInfo(dex, dex[line].x, dex[line-1].y, dex[line].width, 1);
            }
            line++;
            lines[line] = "";
        }
        else {
            lines[line] += letters.shift();
        }
    }
    
    showSelectedImage(data.id);
    
    ctx.fillStyle = data.fillStyle
    
    colorCheck = false;
    for(j=0; j<lines.length; j++) {
        ctx.fillText(lines[j], data.lineInfo[j].x, data.lineInfo[j].y);
    }
}

var showSelectedImage = function(id) {
    var img = new Image();
    img.src = 'img/e'+id + '.png';
    ctx.clearRect(0,0,100,100)
    ctx.drawImage(img,0,0);
}