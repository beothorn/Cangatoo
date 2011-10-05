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
	$("#exportJavascript").append( script );
}

$(document).ready(function(){
  
	for(var i in include){
		includeJSFile(include[i]);
	}
	includeJSFile(factoriesSetup);
	
	$("#pageOutput").hide();
		
  $("#exportJavascript").click(function(event){
		if($("#exportJavascript").text() != "Export Javascript"){
			$("#exportJavascript").text("Export Javascript");
			$("#pageOutput").hide("fast");
			return;
		}
		
		$("#exportJavascript").text("Hide export Javascript");
  	$("#pageOutput").show("fast");
  	$("#pageOutput").val(
  		"<html>\n"+
  		"  <head>\n"+
  		"    <title>Game</title>\n"+
  		"    <script type=\"text/javascript\">\n"+
  		"      window.onload = function(){\n"+
  		"        startGame(document.getElementById(\"gameCanvas\"))\n"+
  		"      };\n");
  	
  	var gameSourceExport = new GameSourceExport();
		var factoriesSetupJavascriptCode = gameSourceExport.getJavascriptSourceForGame(game);
		$('#pageOutput').val($('#pageOutput').val()+factoriesSetupJavascriptCode);
  		
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

  $("#touchKeyboard").hide();
  $("#touchControlsToogleHide").click(function(event){
  		event.preventDefault();
  		if($("#touchControlsToogleHide").text() == "Hide touch controls"){
  			$("#touchKeyboard").hide("slow");
  			$("#touchControlsToogleHide").text("Show touch controls");
  		}else{
  			$("#touchKeyboard").show("slow");
  			$("#touchControlsToogleHide").text("Hide touch controls");
  		}
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

  $("#gameEditorToogleHide").click(function(event){
  		event.preventDefault();
  		if($("#gameEditorToogleHide").text() == "Hide editor"){
  			$("#gameEditor").hide("slow");
  			$("#gameEditorToogleHide").text("Show editor");
  		}else{
  			$("#gameEditor").show("slow");
  			$("#gameEditorToogleHide").text("Hide editor");
  		}
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
  
  $("#restart").click(function(event){
  		game.restartLevel();
  });
  
  $("#playPause").click(function(event){
  		if($("#playPause").val()=="Pause"){
  			$("#playPause").val("Play");
  			clearInterval(intervalID);
  		}else{
  			$("#playPause").val("Pause");
  			startGameLoop();
  		}
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
