window.onload = init;

var game;

function init()
{
	var FPS = 30;
	game = new Game();
	
	var mainCharacter = new MainCharacter();
	game.addElement(mainCharacter);
	game.addElement(new Box(140,220,32,32));
	game.addElement(new Box(340,220,32,32));
	
	setInterval(loop, 1000 / FPS);
}

function loop(){
	game.gameLoop(keyboardState);
}
