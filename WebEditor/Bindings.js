function println(string){
	 $('#console').val($('#console').val()+string+'\n'); 
}

function Bindings() {
	
	var editor = this;
	
	var loadGameCodeDiv = "Load_game_window";
	

	this.doAllBindings = function() {
		cangatoo.startGame($(gameCanvasElementId)[0]);
		this.bindMenuEvents();
		this.bindGameEditor();
		this.bindHideLinks();
		window.onerror = function (msg, url, num) {
			println(msg + ';' + url + ';' + num);
	        return true;
	    };
	    $("#clearCodeToLoad").click(function(event) {
	    	$("#codeToLoad").val("");
		});
	    $("#clearConsole").click(function(event) {
	    	$("#console").val("");
		});
		this.overrideCanvasClick();
		this.reloadGameEditor();
	};
	
	this.reloadGameEditor = function() {
		console.log("reloadGameEditor start");
		editor.reloadFactories();
		editor.reloadEvents();
		editor.reloadFactoryCodeEditor();
		
		editor.reloadLevels();
		editor.reloadLevelEvents();
		editor.reloadLevelCodeEditor();
		console.log("reloadGameEditor end");
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
		this.setSelectListTo(levelNames, "#levelGoto");
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

	this.setSelectListTo = function(stringArray, selectId){
		$(selectId).empty();
                for ( var i in stringArray) {
                        $(selectId).append('<option>' + stringArray[i] + '</option>');
                }
	}

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
			console.log("bindings.newGame():start");
			cangatoo.restart();
			editor.reloadGameEditor();
			console.log("bindings.newGame():end");
		});

		$("#loadGame").click(function(event) {
			closeWindow("Exported_javascript");
			showWindow(loadGameCodeDiv);
		});

		$("#exportGame").click(function(event) {
			showWindow("Exported_javascript");
			$("#"+loadGameCodeDiv).hide("fast");
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

		$("#restartLevel").click(function(event) {
			$("#gamePause").text("Pause");
			cangatoo.restartLevel();
		});

		$("#rPause").click(function(event) {
                        if($(this).is(':checked')){
                                cangatoo.pause();
                        }
                });

		$("#rPlay").click(function(event) {
			if($(this).is(':checked')){
				cangatoo.play();
			}
		});

		$("#rEdit").click(function(event) {
			if($(this).is(':checked')){
				cangatoo.editLevel();
			}	
		});
		
		$("#levelGoto").change(function(event){
			var levelSelected = $(this).val(); 
			game.loadLevel(levelSelected);
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
		$("#loadCode").click(function(event) {
			var codeToLoad = $("#codeToLoad").val();
			cangatoo.loadGameCode(codeToLoad);
		});
		
		$("#executeCode").click(function(event) {
			var codeToLoad = $("#codeToLoad").val();
			eval(codeToLoad);
		});
	};	
};
