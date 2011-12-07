function Bindings(){
	
	this.doAllBindings = function(){
		this.bindMenuEvents();
		this.bindGameEditor();
		this.bindHideLinks();
	};
	
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
			exportJSTo(game,include,function(code){$('#pageOutput').val(code);});
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
	
		$("#gameRestartLevel").click(function(event){
				this.setEditModeOff();
				game.restartCurrentLevel();
				$("#gamePause").text("Pause");
				play();
		});
		
		$("#gamePause").click(function(event){
				if($("#gamePause").text()=="Pause"){
					$("#gameState").text("Paused");					
					$("#gamePause").text("Play");
					pause();
				}else{
					this.setEditModeOff();
					$("#gameState").text("");
					$("#gamePause").text("Pause");
					play();
				}
		});
		
		$("#gameEdit").click(function(event){
				this.setEditModeOn();
				$("#gamePause").text("Play");
				game.restartCurrentLevel();
				pause();
		});
		
		$("#helpAbout").click(function(event){
				event.preventDefault();
				$("#helpAboutText").show("slow");
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
			eval(this.getOnlyGameCode(codeToLoad));
			restartGame();
			$("#loadGameCodeDiv").hide("fast");
			$("#exportHtml").hide("fast");	
		});
		
		$("#hideHelpAbout").click(function(event){
				event.preventDefault();
				$("#helpAboutText").hide("slow");
		});
	};
	
	this.getOnlyGameCode = function(code) {
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
	
	this.setEditModeOff = function(){
		editMode = false;
	};
	
	this.setEditModeOn = function(){
		editMode = true;
		$("#gameState").text("Editing");
	};
};



