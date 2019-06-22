// needed to make module

var canvas;
var ctx;
var image;
var data = {};
var database = {};
var selectedImg = {};

// loading process

window.onload = function() {
    // set initial canvas stuffs
    canvas = document.getElementById("dis");
    ctx = canvas.getContext('2d');
    
    // editor setup
    Editor.init({cv:canvas, ct:ctx});
    
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
    Editor.setBBC(data);
}

var cbWrite = function(text) {
    if(data != null) {
        Editor.writeText(data);
    }
}

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