function Bindings(cangatoo){
		
	this.doAllBindings = function(){
		this.bindMenuEvents();
		this.bindGameEditor();
		this.bindHideLinks();
	};
	
	this.bindMenuEvents = function(){
		$("#gameCanvas").oncontextmenu=function(){
			return false;
		};

		$("#newGame").click(function(event){
				game.newGame();
				cangatoo.reloadGameEditor();
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
				editMode = false;
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
					editMode = false;
					$("#gameState").text("");
					$("#gamePause").text("Pause");
					play();
				}
		});
		
		$("#gameEdit").click(function(event){
				editMode = true;
				$("#gameState").text("Editing");
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
			cangatoo.forceAtLeastOneSelectedOn("#factories");
			cangatoo.fillEvents();
			cangatoo.fillCodeEditor();
		});
		
		$("#factoryEvents").change(function(event){
			cangatoo.fillCodeEditor();
		});
		
		$("#searchOrAddFactory").keypress(function(event){
				if(event.which == 13){
					var factory = new ElementFactory(this.value);
					game.addFactory(factory);
					cangatoo.fillFactories();
				}
		});
		
		$("#factories").keydown(function(event){
				if(event.which == 46){//delete
					game.removeFactoryByName(this.value);
					cangatoo.fillFactories();
				}
		});
	
		$("#saveFactoryCode").click(function(event){
			cangatoo.writeCodeToFunction();
		});
		
		$("#levels").change(function(event){
			cangatoo.forceAtLeastOneSelectedOn("#levels");
			cangatoo.fillLevelEvents();
			cangatoo.fillLevelCodeEditor();
		});
		
		$("#levelEvents").change(function(event){
			cangatoo.fillLevelCodeEditor();
		});
		
		$("#searchOrAddLevel").keypress(function(event){
				if(event.which == 13){
					var level = new Level(this.value);
					game.addLevel(level);
					cangatoo.fillLevels();
				}
		});
		
		$("#saveLevelCode").click(function(event){
			cangatoo.writeLevelCodeToFunction();
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
	};
};