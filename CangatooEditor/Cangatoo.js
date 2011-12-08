$(document).ready(function(){	
	canvas = $("#gameCanvas")[0];
	loadIncludes();	
});

function afterIncludes(){
	var cangatoo = new Cangatoo();
	new Bindings(cangatoo).doAllBindings();
	var defaultGameUrl = "Demos/BouncingBalls.js";
	loadGameFromUrl(defaultGameUrl,cangatoo);
}

var editMode = false;
var totalIncludes = 0;
var includeCount = 0;

function stringToFunction(code){
	var replaceFunction = null;
	console.log(code);
	eval("replaceFunction = "+code);
	return replaceFunction;
};

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
   	"CangatooEditor/Bindings.js",
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


function includeJSFile(includeURL,i){
   	var context = canvas.getContext('2d');
   	context.fillStyle = "Black";
   	context.font = "8pt Verdana";
   	var y = (12*i)+12;
   	context.fillText("Loading "+includeURL,0,y);
   	var script = document.createElement( 'script' );
   	script.type = 'text/javascript';
   	script.src = includeURL;
   	$(document).append(script);
   	includeCount++;
   	if(includeCount == totalIncludes){
   		afterIncludes();
   	}
};

function loadIncludes(doAfterLoading){
	totalIncludes = include.length+ cangatooIncludes.length;
	for(var i in include){
   		includeJSFile(include[i],i);
   	}
   	for(var i in cangatooIncludes){
   		includeJSFile(cangatooIncludes[i],parseInt(i)+include.length);
   	}
};

function getOnlyGameCode(code) {
	var customCodeStart = "//GAMECODE START";
	var customCodeEnd   = "//GAMECODE END";
	var s = code;
	var i = s.indexOf(customCodeStart);
	if (i >= 0) {
		s = s.substring(i + customCodeStart.length);
	}
	i = s.indexOf(customCodeEnd);
	if (i >= 0) {
		s = s.substring(0, i);
	}
	return s;
};

function setGameToLoad(newGameCode){
	gameCode = newGameCode;
}

function loadGameFromUrl(url,cangatoo){
	$(document).load(url,function(responseText){
		eval(getOnlyGameCode(responseText));
		startGame(canvas);
		cangatoo.overrideCanvasClick();
		cangatoo.reloadGameEditor();
	});
}

function Cangatoo(userInterface){
	
	var cangatoo = this;
	
	this.reloadGameEditor = function(){
		this.fillFactories();
		this.fillEvents();
		this.fillCodeEditor();
		
		this.fillLevels();
		this.fillLevelEvents();
		this.fillLevelCodeEditor();
	};
	
	
	this.overrideCanvasClick = function(){
		canvas.onmousedown  = function(event){
			console.log("cangatoo "+cangatoo);
			var x = event.layerX - canvas.offsetLeft;
			var y = event.layerY - canvas.offsetTop;
			if(gamePaused){
				if(event.button == 0){
					cangatoo.addElementFromSelectedFactory(x,y);
				}
				if(event.button == 2){
					cangatoo.removeElement(x,y);
				}
			}else{
				globalGameState.click = {x:x,y:y};
			};
		};
	};
	
	this.forceAtLeastOneSelectedOn = function(listId){
		if ($(listId+" option:selected").length == 0)
			$(listId).prop("selectedIndex", 0);
	};
	
	this.addElementFromSelectedFactory = function(x,y){
		var selectedFactory = $("#factories option:selected").text();
		var factory = game.getFactoryByName(selectedFactory);
		if(editMode){
			factory.addElementToCreateAt(x,y);
		}else{
			factory.addElementAt(x,y);
		}
		game.redraw();
	};
	
	this.removeElement = function(x,y){
		var elementToRemove = game.getObjectOnPoint(x,y);
		level.removeElementFromLevelCreation(elementToRemove);
		kill(elementToRemove);
		game.redraw();
	};
	
	this.addStringArrayToList = function(stringArray,listId){
		$(listId).empty();
		for(var i in stringArray){
			$(listId).append('<option>'+stringArray[i]+'</option>');		
		}
		this.forceAtLeastOneSelectedOn(listId);
	};
	
	this.fillLevels = function(){
		var levelNames = game.getLevelNames();
		this.addStringArrayToList(levelNames,"#levels");
	};
	
	this.fillLevelEvents = function(){
		var selectedLevel = $("#levels option:selected").text();
		if(selectedLevel == ""){
			$("#levelEvents").empty();
			return;
		}
		var events = game.getEventsForLevel(selectedLevel);
		this.addStringArrayToList(events,"#levelEvents");
	};
	
	this.fillLevelCodeEditor = function(){
		var selectedLevelName = $("#levels option:selected").text();
		if(selectedLevelName == ""){
			$("#levelCodeEditor").val("No level selected.");
			return;
		}
		var eventSelected = $("#levelEvents option:selected").text();
		var level = game.getLevelByName(selectedLevelName);
		$("#levelCodeEditor").val(level[eventSelected].toString());
	};
	
	this.writeLevelCodeToFunction = function(){
		var selectedLevelName = $("#levels option:selected").text();
		var eventSelected = $("#levelEvents option:selected").text();
		var code = $("#levelCodeEditor").val();
		var level = game.getLevelByName(selectedLevelName);
		var replaceFunction = stringToFunction(code);
		level[eventSelected] = replaceFunction;
	};
	
	this.fillFactories = function(){
		var factoriesNames = game.getFactoriesNames();
		this.addStringArrayToList(factoriesNames,"#factories");
	};
	
	this.fillEvents = function(){
		var selectedFactory = $("#factories option:selected").text();
		if(selectedFactory == ""){
			$("#factoryEvents").empty();
			return;
		}
		var events = game.getEventsFor(selectedFactory);
		this.addStringArrayToList(events,"#factoryEvents");
	};
	
	this.fillCodeEditor = function(){
		var selectedFactoryName = $("#factories option:selected").text();
		if(selectedFactoryName == ""){
			$("#factoryCodeEditor").val("No factory selected.");
			return;
		}
		var eventSelected = $("#factoryEvents option:selected").text();
		var factory = game.getFactoryByName(selectedFactoryName);
		$("#factoryCodeEditor").val(factory[eventSelected].toString());
	};
	
	this.writeCodeToFunction = function(){
		var selectedFactoryName = $("#factories option:selected").text();
		var eventSelected = $("#factoryEvents option:selected").text();
		var code = $("#factoryCodeEditor").val();
		var factory = game.getFactoryByName(selectedFactoryName);
		var replaceFunction = stringToFunction(code);
		factory[eventSelected] = replaceFunction;
	};
}