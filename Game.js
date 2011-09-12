window.onload = init;



function Output(){
	this.write = function(text){
		return;
		if(this.textArea==null)
			this.textArea = document.getElementById('output');
		this.textArea.innerHTML += text+"\n";  
	}
}

var output = new Output();
var game;
var intervalID;

function init(){
	game = new Game(document.getElementById('canvas'));
	var mainCharacter = new MainCharacter();
	game.addElement(mainCharacter);
	game.addElement(new Box(140,220,32,32));
	//game.addElement(new Box(340,220,32,32));
	startGameLoop();
}


function startGameLoop(){
	var FPS = 30;
	var oneSecond = 1000;
	intervalID = setInterval(loop, oneSecond / FPS);
	output.write("intervalID: "+intervalID);
}

function loop(){
	game.gameLoop();
}
