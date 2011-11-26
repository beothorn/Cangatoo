function GameLoader(){
	this.load = function(){
		console.log("loaded");
		var context = canvas.getContext('2d');
		context.fillStyle = "Black";
		context.fillText("Loading",17,17);
		setTimeout(startGameAfterLoading,500);
	}
}
