var pedido = "https://api.giphy.com/v1/gifs/search?api_key=d17731e61e7541dfbb8c85e50236db7a&limit=15&rating=PG-13&q=";
var busqueda = "cyberpunk";
var paging = "&offset=";
var page = 0;

var botNextPage, botPrevPage, botClear;
var toggls = [];
var textInput;
var gifs = [];
var video;
var divgal;
var daGif = [];
var daGifScale = 1;
var backGif;

function setup() {
	textInput = createInput(busqueda);
	textInput.position(20, 80);
	botPrevPage = createButton("Anterior");
	botPrevPage.mousePressed(function() {
		if (page <= 15) page = 0;
		else page -= 15;
		loadJSON(pedido + busqueda + paging + page, getGiphy);
	});
	botNextPage = createButton("Siguiente");
	botNextPage.mousePressed(function() {
		page += 15;
		loadJSON(pedido + busqueda + paging + page, getGiphy);
	});
	botClear = createButton("Clear Overlays");
	botClear.mousePressed(function() {
	daGif = [];
	});
	botPrevPage.position(20, textInput.height + textInput.y);
	botNextPage.position(20 + botPrevPage.width, textInput.height + textInput.y);
	botClear.position(20, botPrevPage.y + botPrevPage.height);

for (var i=0; i<3; i++) {
	var tog = createCheckbox("",i%2==0);
	tog.size(botClear.height,botClear.height);
	tog.position(botClear.x+botClear.width+10+tog.width*i,botClear.y);
	tog.addClass("togs");
	toggls.push(tog);
}

	createCanvas(displayWidth, displayHeight);

	textInput.elt.onkeydown = inputKey;
	divGal = createDiv("");
	divGal.position(0,400);
	divGal.addClass("scaled");

	loadJSON(pedido + busqueda + paging + page, getGiphy);
}

function inputKey(evt) {
	if (evt.code === "Enter") {
		busqueda = textInput.value();
		page = 0;
		loadJSON(pedido + busqueda + paging + page, getGiphy);
	}
}

function playMe(ev) {
	if(ev.button == 2){
	if (backGif) backGif.stop();
	backGif = this;
	backGif.loop();

	}
else{
	for(var i=toggls.length-1; i>=1;i--) {
		toggls[i].checked(toggls[i-1].checked());
	}
	toggls[0].checked(!toggls[0].checked());
	if (daGif[2]) daGif[2].stop();
	if (daGif[1]) daGif[2] = daGif[1];
	if (daGif[0]) daGif[1] = daGif[0];
	//blendMode(NORMAL);
	//background(0);
	this.loop();
	daGif[0] = this;
	daGifScale = min(float(width) / daGif[0].width, float(height) / daGif[0].height);}
}

function getGiphy(giphy) {
	backGif = null;
	daGif = [];
	console.log(giphy);
	var img;
	for (var i = 0; i < giphy.data.length; i++) {
		if (i < gifs.length) gifs[i].elt.src = giphy.data[i].images.original.mp4;
		else {
			img = createVideo(giphy.data[i].images.original.mp4);
			img.elt.oncontextmenu = function(){return false;};
			img.mousePressed(playMe);
		}
		divGal.child(img);
		gifs.push(img);
	}
}

function draw() {
	if (daGif.length > 0 || backGif) {
		if (backGif) {
			push();
			scale(max(width / backGif.width, height / backGif.height));
			blendMode(NORMAL);
			image(backGif, 0, 0)
			pop();
		}
			scale(daGifScale);
		for (var i = daGif.length - 1; i >= 0; i--) {
			blendMode(toggls[i].checked()?MULTIPLY:ADD);
			image(daGif[i], 0, 0);
		}
	}
	else {
		blendMode(NORMAL);
		background(255);
		fill(0);
		text( "Use right click for adding overlays (up to 3)\nUse left click to select background\nThe checkboxes control overlays blending\nON = MULTIPLY\nOFF = ADD",0,botClear.y+botClear.height+30 );
	}
}