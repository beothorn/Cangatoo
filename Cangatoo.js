var include = [
	"Bindings.js",
	"GameBasis/src/Element.js",
	"GameBasis/src/Utils.js",
	"GameBasis/src/Game.js",
	"GameBasis/src/GameUtils.js",
	"GameBasis/src/ElementFactory.js",
	"GameBasis/src/GameSourceExport.js",
	"GameBasis/src/GameSetup.js"
];
var factoriesSetup = "Demos/BouncingBalls.js";

function includeJSFile(includeURL){
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = includeURL;
	$(document).append( script );
}

var gamePaused = false;

$(document).ready(function(){
  
	for(var i in include){
		includeJSFile(include[i]);
	}
	includeJSFile(factoriesSetup);
			
	new Bindings().doAllBindings();
  
	var canvas = $("#gameCanvas")[0];
	
	startGame(canvas);
	overrideCanvasClick(canvas);
	
	fillFactories();
	fillEvents();
	fillCodeEditor();
	
	fillLevels();
	fillLevelEvents();
	fillLevelCodeEditor();
});

function pause(){
	gamePaused = true;
	clearInterval(intervalID);
}

function play(){
	gamePaused = false;
	startGameLoop();
}

function overrideCanvasClick(canvas){
	canvas.onclick  = function(event){
  	var x = event.layerX - canvas.offsetLeft;
  	var y = event.layerY - canvas.offsetTop;
  	if(gamePaused){
  		console.log("Add element at x:"+x+" y:"+y);
  		addElementFromSelectedFactory(x,y);
  	}else{
  		canvasClick({x:x,y:y});
  	};
  };
}

function forceAtLeastOneSelectedOn(listId){
	if ($(listId+" option:selected").length == 0)
		$(listId).prop("selectedIndex", 0)
}

function addElementFromSelectedFactory(x,y){
	var selectedFactory = $("#factories option:selected").text();
	var factory = game.getFactoryByName(selectedFactory);
	factory.addElementAt(x,y);
	game.redraw();
}

function addStringArrayToList(stringArray,listId){
	$(listId).empty();
	for(var i in stringArray){
		$(listId).append('<option>'+stringArray[i]+'</option>');		
	}
	forceAtLeastOneSelectedOn(listId);
}

function fillLevels(){
	var levelNames = game.getLevelNames();
	addStringArrayToList(levelNames,"#levels");
}

function fillLevelEvents(){
	var selectedLevel = $("#levels option:selected").text();
	var events = game.getEventsForLevel(selectedLevel);
	addStringArrayToList(events,"#levelEvents");
}

function fillLevelCodeEditor(){
	var selectedLevelName = $("#levels option:selected").text();
	var eventSelected = $("#levelEvents option:selected").text();
	var level = game.getLevelByName(selectedLevelName);
	$("#levelCodeEditor").val(eval('level.'+eventSelected).toString());
}

function fillFactories(){
	var factoriesNames = game.getFactoriesNames();
	addStringArrayToList(factoriesNames,"#factories");
}

function fillEvents(){
	var selectedFactory = $("#factories option:selected").text();
	var events = game.getEventsFor(selectedFactory);
	addStringArrayToList(events,"#factoryEvents");
}

function fillCodeEditor(){
	var selectedFactoryName = $("#factories option:selected").text();
	var eventSelected = $("#factoryEvents option:selected").text();
	var factory = game.getFactoryByName(selectedFactoryName);
	$("#factoryCodeEditor").val(eval('factory.'+eventSelected).toString());
}

function writeCodeToFunction(){
	var selectedFactoryName = $("#factories option:selected").text();
	var eventSelected = $("#factoryEvents option:selected").text();
	var code = $("#factoryCodeEditor").val();
	var factory = game.getFactoryByName(selectedFactoryName);
	var replaceFunction = "factory."+eventSelected+" = "+code+";";
	eval(replaceFunction);
}
