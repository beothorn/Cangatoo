$(document).ready(function(){
	new CangatooBoot();
});

var gameCanvasElementId = "#gameCanvas";

var bindings;

function CangatooBoot(){
	
	this.totalIncludes = 0;
	this.includeCount = 0;
	
	this.include = [
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
	
	this.cangatooIncludes = [
	    "CangatooEditor/Cangatoo.js",
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
	
	this.afterIncludes = function(){
		var defaultGameUrl = "Demos/BouncingBalls.js";
		bindings = new Bindings();
		this.loadGameFromUrl(defaultGameUrl,bindings);
	};
	
	this.includeJSFile = function(includeURL,i){
		var context = $(gameCanvasElementId)[0].getContext('2d');
		context.fillStyle = "Black";
		context.font = "8pt Verdana";
		var y = (12*i)+12;
		context.fillText("Loading "+includeURL,0,y);
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = includeURL;
		$(document).append(script);
		this.includeCount++;
		if(this.includeCount == this.totalIncludes){
			this.afterIncludes();
		}
	};
	
	
	this.loadGameFromUrl = function(url,bindings){
		$(document).load(url,function(responseText){
			eval(getOnlyGameCode(responseText));
			bindings.doAllBindings();
		});
	};
	
	this.totalIncludes = this.include.length+ this.cangatooIncludes.length;
	for(var i in this.include){
		this.includeJSFile(this.include[i],i);
	}
	for(var i in this.cangatooIncludes){
		this.includeJSFile(this.cangatooIncludes[i],parseInt(i)+this.include.length);
	}
}


function Bindings() {

	var cangatoo = new Cangatoo();
	var editor = this;

	this.doAllBindings = function() {
		cangatoo.startGame($(gameCanvasElementId)[0]);
		this.bindMenuEvents();
		this.bindGameEditor();
		this.bindHideLinks();
		this.overrideCanvasClick();
		this.reloadGameEditor();
	};
	
	this.reloadGameEditor = function() {
		editor.reloadFactories();
		editor.reloadEvents();
		editor.reloadFactoryCodeEditor();
		
		editor.reloadLevels();
		editor.reloadLevelEvents();
		editor.reloadLevelCodeEditor();
	};

	this.reloadFactories = function() {
		var factoriesNames = cangatoo.getFactoriesNames();
		this.setListTo(factoriesNames, "#factories");
	};

	this.reloadEvents = function(){
		var selectedFactory = $("#factories option:selected").text();
		if(selectedFactory == ""){
			$("#factoryEvents").empty();
			return;
		}
		var events = cangatoo.getFactoryEvents(selectedFactory);
		this.setListTo(events,"#factoryEvents");
	};
	
	this.reloadFactoryCodeEditor = function(){
		var selectedFactoryName = $("#factories option:selected").text();
		if(selectedFactoryName == ""){
			$("#factoryCodeEditor").val("No factory selected.");
			return;
		}
		var eventSelected = $("#factoryEvents option:selected").text();
		var eventCode = cangatoo.getFactoryEventCode(selectedFactoryName,eventSelected);
		$("#factoryCodeEditor").val(eventCode);
	};
	
	this.reloadLevels = function(){
		var levelNames = cangatoo.getLevels();
		this.setListTo(levelNames, "#levels");
	};
	
	this.reloadLevelEvents = function(){
		var selectedLevel = $("#levels option:selected").text();
		if(selectedLevel == ""){
			$("#levelEvents").empty();
			return;
		}
		var selectedLevelEvents = cangatoo.getLevelEvents(selectedLevel);
		this.setListTo(selectedLevelEvents, "#levelEvents");
	};
	
	this.reloadLevelCodeEditor = function(){
		var selectedLevelName = $("#levels option:selected").text();
		if (selectedLevelName == "") {
			$("#levelCodeEditor").val("No level selected.");
			return;
		}
		var eventSelected = $("#levelEvents option:selected").text();
		var eventCode = cangatoo.getLevelEventCode(selectedLevelName, eventSelected);
		$("#levelCodeEditor").val(eventCode);
	};

	this.overrideCanvasClick = function() {// should pass to cangatoo
		$(gameCanvasElementId)[0].onmousedown = function(event) {
			var x = event.layerX - $(gameCanvasElementId)[0].offsetLeft;
			var y = event.layerY - $(gameCanvasElementId)[0].offsetTop;
			if (gamePaused) {
				if (event.button == 0) {
					var selectedFactory = $("#factories option:selected").text();
					cangatoo.addElementFromFactory(x, y,selectedFactory);
				}
				if (event.button == 2) {
					cangatoo.removeElement(x, y);
				}
			} else {
				globalGameState.click = {
					x : x,
					y : y
				};
			}
			;
		};
	};

	this.forceAtLeastOneSelectedOn = function(listId) {
		if ($(listId + " option:selected").length == 0)
			$(listId).prop("selectedIndex", 0);
	};

	this.setListTo = function(stringArray, listId) {
		$(listId).empty();
		for ( var i in stringArray) {
			$(listId).append('<option>' + stringArray[i] + '</option>');
		}
		this.forceAtLeastOneSelectedOn(listId);
	};

	this.bindMenuEvents = function() {
		$(gameCanvasElementId).oncontextmenu = function() {
			return false;
		};

		$("#newGame").click(function(event) {
			cangatoo.newGame();
			editor.reloadGameEditor();
		});

		$("#loadGame").click(function(event) {
			$("#exportHtml").hide("fast");
			$("#loadGameCodeDiv").show("fast");
		});

		$("#exportGame").click(function(event) {
			$("#loadGameCodeDiv").hide("fast");
			$("#exportHtml").show("fast");
			exportJSTo(game, include, function(code) {
				$('#pageOutput').val(code);
			});
		});

		$("#viewEditor").click(function(event) {
			var checkedShowString = String.fromCharCode(10003) + " Editor";
			var uncheckedShowString = "\u00A0\u00A0 Editor";

			event.preventDefault();
			if ($("#viewEditor").text() == checkedShowString) {
				$("#gameEditor").hide("slow");
				$("#viewEditor").text(uncheckedShowString);
			} else {
				$("#gameEditor").show("slow");
				$("#viewEditor").text(checkedShowString);
			}
		});

		$("#gameRestartLevel").click(function(event) {
			$("#gamePause").text("Pause");
			cangatoo.restartLevel();
		});

		$("#gamePause").click(function(event) {
			if ($("#gamePause").text() == "Pause") {
				$("#gameState").text("Paused");
				$("#gamePause").text("Play");
				cangatoo.pause();
			} else {
				$("#gameState").text("");
				$("#gamePause").text("Pause");
				cangatoo.play();
			}
		});

		$("#gameEdit").click(function(event) {
			$("#gameState").text("Editing");
			$("#gamePause").text("Play");
			cangatoo.editLevel();			
		});

		$("#helpAbout").click(function(event) {
			event.preventDefault();
			$("#helpAboutText").show("slow");
		});
	};

	this.bindGameEditor = function() {
		$("#factories").change(function(event) {
			editor.forceAtLeastOneSelectedOn("#factories");
			editor.reloadEvents();
			editor.reloadFactoryCodeEditor();
		});

		$("#factoryEvents").change(function(event) {
			editor.reloadFactoryCodeEditor();
		});

		$("#searchOrAddFactory").keypress(function(event) {
			if (event.which == 13) {
				var factoryName = this.value;
				cangatoo.addFactory(factoryName);
				editor.reloadFactories();
			}
		});

		$("#factories").keydown(function(event) {
			if (event.which == 46) {// delete
				var factoryName = this.value;
				cangatoo.removeFactory(factoryName);
				editor.reloadFactories();
			}
		});

		$("#saveFactoryCode").click(function(event) {
			var selectedFactoryName = $("#factories option:selected").text();
			var eventSelected = $("#factoryEvents option:selected").text();
			var code = $("#factoryCodeEditor").val();
			cangatoo.setFactoryEventCode(selectedFactoryName,eventSelected,code);
		});

		$("#levels").change(function(event) {
			editor.forceAtLeastOneSelectedOn("#factories");
			editor.reloadLevelEvents();
			editor.reloadLevelCodeEditor();
		});

		$("#levelEvents").change(function(event) {
			editor.reloadLevelEvents();
		});

		$("#searchOrAddLevel").keypress(function(event) {
			if (event.which == 13) {
				var levelName = this.value;
				cangatoo.addLevel(levelName);
				editor.reloadLevels();
			}
		});

		$("#saveLevelCode").click(function(event) {
			var selectedLevelName = $("#levels option:selected").text();
			var eventSelected = $("#levelEvents option:selected").text();
			var code = $("#levelCodeEditor").val();
			cangatoo.setLevelEventCode(selectedLevelName, eventSelected, code);
		});
	};

	this.bindHideLinks = function() {
		$("#hideHtml").click(function(event) {
			$("#exportHtml").hide("fast");
		});

		$("#loadCode").click(function(event) {
			var codeToLoad = $("#codeToLoad").val();
			cangatoo.loadGameCode(codeToLoad);
			$("#loadGameCodeDiv").hide("fast");
			$("#exportHtml").hide("fast");
		});

		$("#hideHelpAbout").click(function(event) {
			event.preventDefault();
			$("#helpAboutText").hide("slow");
		});
	};
};