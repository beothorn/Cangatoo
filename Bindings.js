function Bindings(){
	
	this.doAllBindings = function(){
		this.bindMenuEvents();
		this.bindTouchKeys();
		this.bindGameEditor();
		this.bindHideLinks();
	}
	
	this.bindMenuEvents = function(){
		$("#gameCanvas").oncontextmenu=function(){return false;};

		$("#newGame").click(function(event){
				game.newGame();
				reloadGameEditor();
		});
		
		$("#loadGame").click(function(event){
			$("#exportHtml").hide("fast");	
			$("#loadGameCodeDiv").show("fast");
		});
		
		$("#exportGame").click(function(event){
			$("#loadGameCodeDiv").hide("fast");
			$("#exportHtml").show("fast");
			exportJSTo(game,$('#pageOutput'),include);
		});
		
		$("#viewEditor").click(function(event){
			var checkedShowString =  String.fromCharCode(10003)+" Editor";
			var uncheckedShowString =  "\u00A0\u00A0 Editor";
			
			event.preventDefault();
			if($("#viewEditor").text() == checkedShowString){
				$("#gameEditor").hide("slow");
				$("#viewEditor").text(uncheckedShowString);
			}else{
				$("#gameEditor").show("slow");
				$("#viewEditor").text(checkedShowString);
			}
		});
		
		$("#viewTouchButtons").click(function(event){
				var checkedShowString =  String.fromCharCode(10003)+" Touch buttons";
				var uncheckedShowString =  "\u00A0\u00A0 Touch buttons";
				
				event.preventDefault();
				if($("#viewTouchButtons").text() == checkedShowString){
					$("#touchKeyboard").hide("slow");
					$("#viewTouchButtons").text(uncheckedShowString);
				}else{
					$("#touchKeyboard").show("slow");
					$("#viewTouchButtons").text(checkedShowString);
				}
		});
	
		$("#gameRestartLevel").click(function(event){
				editMode = false;
				game.restartCurrentLevel();
				$("#gamePause").text("Pause");
				play();
		});
		
		$("#gamePause").click(function(event){
				if($("#gamePause").text()=="Pause"){
					$("#gamePause").text("Play");
					pause();
				}else{
					editMode = false;
					$("#gamePause").text("Pause");
					play();
				}
		});
		
		$("#gameEdit").click(function(event){
				editMode = true;
				$("#gamePause").text("Play");
				game.restartCurrentLevel();
				pause();
		});
		
		$("#helpAbout").click(function(event){
				event.preventDefault();
				$("#helpAboutText").show("slow");
		});
	};
	
	this.bindTouchKeys = function(){
	  $("#upBtn").mouseover(function(event){
	  		keyDown(up);
		});
			
		$("#upBtn").mouseout(function(event){
			keyUp(up);
		});
		
		$("#downBtn").mouseover(function(event){
			keyDown(down);
		});
			
		$("#downBtn").mouseout(function(event){
			keyUp(down);
		});
		
		$("#leftBtn").mouseover(function(event){
			keyDown(left);
		});
			
		$("#leftBtn").mouseout(function(event){
			keyUp(left);
		});
		
		$("#rightBtn").mouseover(function(event){
			keyDown(right);
		});
			
		$("#rightBtn").mouseout(function(event){
			keyUp(right);
		});
	};
	
	this.bindGameEditor = function(){
		$("#factories").change(function(event){
			forceAtLeastOneSelectedOn("#factories");
			fillEvents();
			fillCodeEditor();
		});
		
		$("#factoryEvents").change(function(event){
				fillCodeEditor();
		});
		
		$("#searchOrAddFactory").keypress(function(event){
				if(event.which == 13){
					var factory = new ElementFactory(this.value);
					game.addFactory(factory);
					fillFactories();
				}
		});
		
		$("#factories").keydown(function(event){
				if(event.which == 46){//delete
					game.removeFactoryByName(this.value);
					fillFactories();
				}
		});
	
		$("#saveFactoryCode").click(function(event){
				writeCodeToFunction();
		});
		
		$("#levels").change(function(event){
			forceAtLeastOneSelectedOn("#levels");
			fillLevelEvents();
			fillLevelCodeEditor();
		});
		
		$("#levelEvents").change(function(event){
				fillLevelCodeEditor();
		});
		
		$("#searchOrAddLevel").keypress(function(event){
				if(event.which == 13){
					var level = new Level(this.value);
					game.addLevel(level);
					fillLevels();
				}
		});
		
		$("#saveLevelCode").click(function(event){
				writeLevelCodeToFunction();
		});
	};
	
	this.bindHideLinks = function(){
		$("#hideHtml").click(function(event){
			$("#exportHtml").hide("fast");	
		});
		
		$("#loadCode").click(function(event){
			var codeToLoad = $("#codeToLoad").val(); 
			eval(getOnlyGameCode(codeToLoad));
			restartGame();
			$("#loadGameCodeDiv").hide("fast");
			$("#exportHtml").hide("fast");	
		});
		
		$("#hideHelpAbout").click(function(event){
				event.preventDefault();
				$("#helpAboutText").hide("slow");
		});
	}
}

function getOnlyGameCode(code) {
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
}
