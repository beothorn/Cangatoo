var include = [
	"GameBasis/src/GameLoader.js",
	"GameBasis/src/Resources.js",
	"GameBasis/src/Element.js",
	"GameBasis/src/Level.js",
	"GameBasis/src/Utils.js",
	"GameBasis/src/Game.js",
	"GameBasis/src/ElementFactory.js",
	"GameBasis/src/GameSetup.js",
	"GameBasis/src/GameGlobals.js"
];

var cangatooIncludes = [
	"Bindings.js",
	"Export/src/GameSourceExport.js",
	"Export/src/HeaderRenderer.js",
	"Export/src/SetupRenderer.js",
	"Export/src/CanvasPropertiesRenderer.js",
	"Export/src/ResourcesRenderer.js",
	"Export/src/GameNameRenderer.js",
	"Export/src/FactoriesRenderer.js",
	"Export/src/LevelsRenderer.js",	
	"Export/src/FooterRenderer.js",
	"Export/src/IncludesRenderer.js"
];

//Globals
var editMode = false;
var defaultGameUrl = "Demos/BouncingBalls.js";
//--end globals

function includeJSFile(includeURL,i){
	var canvas = $("#gameCanvas")[0];
	var context = canvas.getContext('2d');
	context.fillStyle = "Black";
	context.font = "8pt Verdana";
	var y = (12*i)+12;
	context.fillText("Loading "+includeURL,0,y);
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = includeURL;
	$(document).append( script );
}

$(document).ready(function(){
		
  var canvas = $("#gameCanvas")[0];
  
	for(var i in include){
		includeJSFile(include[i],i);
	}
	for(var i in cangatooIncludes){
		includeJSFile(cangatooIncludes[i],parseInt(i)+include.length);
	}
			
	new Bindings().doAllBindings();
	
	
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

function overrideCanvasClick(canvas){
	canvas.onmousedown  = function(event){
  	var x = event.layerX - canvas.offsetLeft;
  	var y = event.layerY - canvas.offsetTop;
  	if(gamePaused){
  		if(event.button == 0){
  			addElementFromSelectedFactory(x,y);
  		}
  		if(event.button == 2){
  			removeElement(x,y);
  		}
  	}else{
  		globalGameState.click = {x:x,y:y};
  	};
  };
  
}

function forceAtLeastOneSelectedOn(listId){
	if ($(listId+" option:selected").length == 0)
		$(listId).prop("selectedIndex", 0);
}

function addElementFromSelectedFactory(x,y){
	var selectedFactory = $("#factories option:selected").text();
	var factory = game.getFactoryByName(selectedFactory);
	if(editMode){
		factory.addElementToCreateAt(x,y);
	}else{
		factory.addElementAt(x,y);
	}
	game.redraw();
}

function removeElement(x,y){
	var elementToRemove = game.getObjectOnPoint(x,y);
	level.removeElementFromLevelCreation(elementToRemove);
	kill(elementToRemove);
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
	$("#levelCodeEditor").val(level[eventSelected].toString());
}

function writeLevelCodeToFunction(){
	var selectedLevelName = $("#levels option:selected").text();
	var eventSelected = $("#levelEvents option:selected").text();
	var code = $("#levelCodeEditor").val();
	var level = game.getLevelByName(selectedLevelName);
	var replaceFunction = stringToFunction(code);
	level[eventSelected] = replaceFunction;
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
	$("#factoryCodeEditor").val(factory[eventSelected].toString());
}

function writeCodeToFunction(){
	var selectedFactoryName = $("#factories option:selected").text();
	var eventSelected = $("#factoryEvents option:selected").text();
	var code = $("#factoryCodeEditor").val();
	var factory = game.getFactoryByName(selectedFactoryName);
	var replaceFunction = stringToFunction(code);
	factory[eventSelected] = replaceFunction;
}

function stringToFunction(code){
	var replaceFunction = null;
	console.log(code);
	eval("replaceFunction = "+code);
	return replaceFunction;
};