function GameSetup(){
	
	this.doBeforeStart = function(drawCanvas){
		canvas = drawCanvas;
		document.onkeydown = function(event){
			if(event.keyCode == KeyEvent.DOM_VK_LEFT)
				globalGameState.left = true;
			if(event.keyCode == KeyEvent.DOM_VK_RIGHT)
				globalGameState.right = true;
			if(event.keyCode == KeyEvent.DOM_VK_UP)
				globalGameState.up = true;
			if(event.keyCode == KeyEvent.DOM_VK_DOWN)
				globalGameState.down = true;
		};
		
		document.onkeyup = function(event){
			if(event.keyCode == KeyEvent.DOM_VK_LEFT)
				globalGameState.left = false;
			if(event.keyCode == KeyEvent.DOM_VK_RIGHT)
				globalGameState.right = false;
			if(event.keyCode == KeyEvent.DOM_VK_UP)
				globalGameState.up = false;
			if(event.keyCode == KeyEvent.DOM_VK_DOWN)
				globalGameState.down = false;
		};
		
		canvas.onmousedown  = function(event){
			var x = event.layerX - canvas.offsetLeft;
			var y = event.layerY - canvas.offsetTop;
			globalGameState.click = {x:x,y:y};
		};
		
		canvas.oncontextmenu = function(e){return false;};
		
		canvas.onmousemove = function(event){
			var x = event.layerX - canvas.offsetLeft;
			var y = event.layerY - canvas.offsetTop;
			mouse.x = x;
			mouse.y = y;
		};
		
		game = new Game();
		gameCode.setup();
	};
	
	this.restartGame = function(){
		game.clear();
		gameCode.setup();
		game.reset();
		play();
	};
}
