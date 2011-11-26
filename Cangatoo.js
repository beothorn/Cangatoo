var include = [
	"GameBasis/src/GameLoader.js",
	"GameBasis/src/Element.js",
	"GameBasis/src/Level.js",
	"GameBasis/src/Utils.js",
	"GameBasis/src/Game.js",
	"GameBasis/src/GameUtils.js",
	"GameBasis/src/ElementFactory.js",
	"GameBasis/src/GameSetup.js"
];
var cangatooIncludes = [
	"Bindings.js",
	"GameBasis/src/GameSourceExport.js"
];

function includeJSFile(includeURL){
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = includeURL;
	$(document).append( script );
}

var gamePaused = false;
var gameCode;
var defaultGameUrl = "Demos/BouncingBalls.js";

function loadCode(newGameCode){
	gameCode = newGameCode;
}

$(document).ready(function(){
  
	for(var i in include){
		includeJSFile(include[i]);
	}
	for(var i in cangatooIncludes){
		includeJSFile(cangatooIncludes[i]);
	}
			
	new Bindings().doAllBindings();
	var canvas = $("#gameCanvas")[0];
	
	$(document).load(defaultGameUrl,function(responseText){
			eval(responseText);
			startGame(canvas);
			overrideCanvasClick(canvas);
			reloadGameEditor();
	});	
});

function reloadGameEditor(){
	
	fillFactories();
	fillEvents();
	fillCodeEditor();
	
	fillLevels();
	fillLevelEvents();
	fillLevelCodeEditor();
}

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
	factory.addElementToCreateAt(x,y);
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
	if(selectedLevel == ""){
		$("#levelEvents").empty();
		return;
	}
	var events = game.getEventsForLevel(selectedLevel);
	addStringArrayToList(events,"#levelEvents");
}

function fillLevelCodeEditor(){
	var selectedLevelName = $("#levels option:selected").text();
	if(selectedLevelName == ""){
		$("#levelCodeEditor").val("No level selected.");
		return;
	}
	var eventSelected = $("#levelEvents option:selected").text();
	var level = game.getLevelByName(selectedLevelName);
	$("#levelCodeEditor").val(eval('level.'+eventSelected).toString());
}

function writeLevelCodeToFunction(){
	var selectedLevelName = $("#levels option:selected").text();
	var eventSelected = $("#levelEvents option:selected").text();
	var code = $("#levelCodeEditor").val();
	var level = game.getLevelByName(selectedLevelName);
	var replaceFunction = "level."+eventSelected+" = "+code+";";
	eval(replaceFunction);
}

function fillFactories(){
	var factoriesNames = game.getFactoriesNames();
	addStringArrayToList(factoriesNames,"#factories");
}

function fillEvents(){
	var selectedFactory = $("#factories option:selected").text();
	if(selectedFactory == ""){
		$("#factoryEvents").empty();
		return;
	}
	var events = game.getEventsFor(selectedFactory);
	addStringArrayToList(events,"#factoryEvents");
}

function fillCodeEditor(){
	var selectedFactoryName = $("#factories option:selected").text();
	if(selectedFactoryName == ""){
		$("#factoryCodeEditor").val("No factory selected.");
		return;
	}
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
