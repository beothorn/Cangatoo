var game;
var intervalID;

var down  = 	40;
var right = 	39;
var up    = 	38;
var left  = 	37;

var globalGameState = {
	left:false,
	right:false,
	up:false,
	down:false
}

$(document).ready(function(){
  
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
		
  $(document).keydown(function(event){
	if(event.keyCode == left)
		globalGameState.left = true;
	if(event.keyCode == right)
		globalGameState.right = true;
	if(event.keyCode == up)
		globalGameState.up = true;
	if(event.keyCode == down)
		globalGameState.down = true;
	});
		
	$(document).keyup(function(event){
		if(event.keyCode == left)
			globalGameState.left = false;
		if(event.keyCode == right)
			globalGameState.right = false;
		if(event.keyCode == up)
			globalGameState.up = false;
		if(event.keyCode == down)
			globalGameState.down = false;
	});
	
	game = new Game($("#gameCanvas")[0]);
	
	setupFactory_MainCharacter(game);
	setupFactory_Box(game);
	
	fillFactories();
	fillEvents();
	fillCodeEditor();
	
	game.restartLevel();
	
	startGameLoop();
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

function startGameLoop(){
	var FPS = 30;
	var oneSecond = 1000;
	intervalID = setInterval(loop, oneSecond / FPS);
}

function loop(){
	game.gameLoop(globalGameState);
}
