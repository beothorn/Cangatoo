window.onload = init;

function Output(){
	this.write = function(text){
		return;
		if(this.textArea==null)
			this.textArea = document.getElementById('output');
		this.textArea.innerHTML += text+"\n";  
	}
}

var down  = 	40;
var right = 	39;
var up    = 	38;
var left  = 	37;

function KeyboardState(){
	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
}

var globalGameState = new KeyboardState();

document.onkeydown = function(event){
	if(event.keyCode == left)
		globalGameState.left = true;
	if(event.keyCode == right)
		globalGameState.right = true;
	if(event.keyCode == up)
		globalGameState.up = true;
	if(event.keyCode == down)
		globalGameState.down = true;
}
	
document.onkeyup = function(event){
  if(event.keyCode == left)
		globalGameState.left = false;
	if(event.keyCode == right)
		globalGameState.right = false;
	if(event.keyCode == up)
		globalGameState.up = false;
	if(event.keyCode == down)
		globalGameState.down = false;
}

var output = new Output();
var game;
var factoriesEditor;
var intervalID;

function init(){
	game = new Game(document.getElementById('canvas'));
	factoriesEditor = new ElementFactoriesEditor(game);

	var mainCharacter = new MainCharacter();
	game.addFactory(mainCharacter);
	var boxFactory = new BoxFactory();
	//boxFactory.addElementAt(140,220);
	//boxFactory.addElementAt(300,200);
	//boxFactory.addElementAt(200,100);
	game.addFactory(boxFactory);
	
	game.factoryTest = new ElementFactory("TestBoxes",32,32);
	game.factoryTest.addElementAt(140,220);
	game.addFactory(game.factoryTest);

	fillElementsDropDown();
	loadElementEvents();
	fillCodeEditor()

	startGameLoop();
}

function loadElementEvents(){
	var factoriesDropDown = document.getElementById("elements");
	//factoriesDropDown.options.remove(1);
	var selectedFactory = factoriesDropDown.value;
	var events = factoriesEditor.getEventsFor(selectedFactory);

	var eventsDropDown = document.getElementById("events");
	for(var i in events){
		var option = document.createElement("option");
		eventsDropDown.appendChild(option);
		option.appendChild(document.createTextNode(events[i]));
	}
}

function fillElementsDropDown(){
	var factoriesDropDown = document.getElementById("elements");

	var factoriesNames = factoriesEditor.getFactoriesNames();
	for(var i in factoriesNames){
		var option = document.createElement("option");
		factoriesDropDown.appendChild(option);
		option.appendChild(document.createTextNode(factoriesNames[i]));
	}
}

function fillCodeEditor(){
	var factoriesDropDown = document.getElementById("elements");
	var eventsDropDown = document.getElementById("events");
	var codeEditor = document.getElementById("codeEditor");
	var factory = factoriesEditor.getFactoryByName(factoriesDropDown.value);
	codeEditor.innerHTML = eval('factory.'+eventsDropDown.value).toString();
}

function startGameLoop(){
	var FPS = 30;
	var oneSecond = 1000;
	intervalID = setInterval(loop, oneSecond / FPS);
	output.write("intervalID: "+intervalID);
}

function loop(){
	game.gameLoop(globalGameState);
}
