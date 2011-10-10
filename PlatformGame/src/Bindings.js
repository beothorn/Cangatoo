var include = [
	"./GameBasis/src/Element.js",
	"./GameBasis/src/Utils.js",
	"./GameBasis/src/Game.js",
	"./GameBasis/src/GameUtils.js",
	"./GameBasis/src/ElementFactory.js",
	"./GameBasis/src/GameSourceExport.js",
	"./GameBasis/src/GameSetup.js"
];
var factoriesSetup = "./PlatformGame/src/FactoriesSetup.js";

function includeJSFile(includeURL){
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = includeURL;
	$(document).append( script );
}

$(document).ready(function(){
  
	for(var i in include){
		includeJSFile(include[i]);
	}
	includeJSFile(factoriesSetup);
	
	$("#exportHtml").hide();
		
	$("#hideHtml").click(function(event){
		$("#exportHtml").hide("fast");	
	});
	
  $("#exportGame").click(function(event){
  	$("#exportHtml").show("fast");
  	$("#pageOutput").val(
  		"<html>\n"+
  		"  <head>\n"+
  		"    <title>Game</title>\n"+
  		"    <script type=\"text/javascript\">\n"+
  		"      window.onload = function(){\n"+
  		"        startGame(document.getElementById(\"gameCanvas\"))\n"+
  		"      };\n");
  	
  	$('#pageOutput').val($('#pageOutput').val()+"//Game Code BEGIN");
  	
  	var gameSourceExport = new GameSourceExport();
		var factoriesSetupJavascriptCode = gameSourceExport.getJavascriptSourceForGame(game);
		$('#pageOutput').val($('#pageOutput').val()+factoriesSetupJavascriptCode);
  		
		$('#pageOutput').val($('#pageOutput').val()+"//Game Code END\n");
		
		var loadCount = 0;
  	for(var i in include){
  		$('#pageOutput').load(include[i],null,function(responseText){  
				$('#pageOutput').val($('#pageOutput').val()+responseText);
				loadCount++;
				if(loadCount == include.length){
					$('#pageOutput').val($('#pageOutput').val()+
						"    </script>\n"+
						"  </head>\n"+
						"  <body>\n"+
						"    <canvas id=\"gameCanvas\" width=\"500\" height=\"300\">\n"+
						"      Your browser does not support the canvas element.\n"+
						"    </canvas>\n"+
						"</html>");
				}
			});
  	}
  });

  $("#factories").change(function(event){
		forceAtLeastOneSelectedFactory();
  		fillEvents();
		fillCodeEditor();
  });
  
  $("#events").change(function(event){
			fillCodeEditor();
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
  
  $("#touchKeyboard").hide();
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

  
  $("#helpAboutText").hide();
  $("#helpAbout").click(function(event){
  		event.preventDefault();
  		$("#helpAboutText").show("slow");
  });
  $("#hideHelpAbout").click(function(event){
  		event.preventDefault();
  		$("#helpAboutText").hide("slow");
  });
  
  
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

  $("#factories").keydown(function(event){
  		if(event.which == 46){//delete
			game.removeFactoryByName(this.value);
			fillFactories();
       		}
  });
  
  $("#searchOrAdd").keypress(function(event){
  		if(event.which == 13){
       			var factory = new ElementFactory(this.value);
       			game.addFactory(factory);
       			fillFactories();
      }
  });

  $("#saveCode").click(function(event){
  		writeCodeToFunction();
  });
  
  $("#gameRestart").click(function(event){
  		game.restartCurrentLevel();
  });
  
  $("#gamePause").click(function(event){
  		if($("#gamePause").text()=="Pause"){
  			$("#gamePause").text("Play");
  			clearInterval(intervalID);
  		}else{
  			$("#gamePause").text("Pause");
  			startGameLoop();
  		}
  });
  
	$("#gameRestartPause").click(function(event){
			$("#gamePause").text("Play");
			game.restartCurrentLevel();
			clearInterval(intervalID);
  });
  
	var canvas = $("#gameCanvas")[0];
	
	startGame(canvas);
	
	fillFactories();
	fillEvents();
	fillCodeEditor();
});

function forceAtLeastOneSelectedFactory(){
	if ($("#factories option:selected").length == 0)
		$("#factories").prop("selectedIndex", 0)
}

function fillFactories(){
	var factoriesNames = game.getFactoriesNames();
	$("#factories").empty();
	for(var i in factoriesNames){
		$("#factories").append('<option>'+factoriesNames[i]+'</option>');		
	}
	forceAtLeastOneSelectedFactory();
}

function fillEvents(){
	var selectedFactory = $("#factories option:selected").text();
	var events = game.getEventsFor(selectedFactory);
	$("#events").empty();
	for(var i in events){
		$("#events").append('<option>'+events[i]+'</option>');
	}
}

function fillCodeEditor(){
	var selectedFactoryName = $("#factories option:selected").text();
	var eventSelected = $("#events option:selected").text();
	var factory = game.getFactoryByName(selectedFactoryName);
	$("#codeEditor").val(eval('factory.'+eventSelected).toString());
}

function writeCodeToFunction(){
	var selectedFactoryName = $("#factories option:selected").text();
	var eventSelected = $("#events option:selected").text();
	var code = $("#codeEditor").val();
	var factory = game.getFactoryByName(selectedFactoryName);
	var replaceFunction = "factory."+eventSelected+" = "+code+";";
	eval(replaceFunction);
}
