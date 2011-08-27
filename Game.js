const FPS = 30;
var canvas = null;
var context2D = null;
var square = null;

window.onload = init;

var elements = new Array();

function Square(){
	this.step = function(){
	};
	this.draw = function(context){
		context.fillRect(10, 20, 200, 100);
	};
}

function init()
{
	canvas = document.getElementById('canvas');
	context2D = canvas.getContext('2d');
	setInterval(gameLoop, 1000 / FPS);
	square = new Square();
	elements.push(square);
}

function gameLoop()
{
	context2D.clearRect(0, 0, canvas.width, canvas.height);
	for (var i in elements)
	{
		elements[i].step();
	}
	for (var i in elements)
	{
		elements[i].draw(context2D);
	}
}
