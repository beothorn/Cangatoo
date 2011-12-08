function DefaultLoaderScreen(){
	this.onUpdateLoadedPercentage = function(canvasContext, newPercetage){
		if(newPercetage == 0){
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			canvasContext.fillStyle = "Black";
			canvasContext.font = "8pt Verdana";
			canvasContext.fillStyle = "Black";
			canvasContext.fillText("Loading",0,12);
		}		
		canvasContext.clearRect(0, 12, canvas.width, canvas.height-(12*2));
		canvasContext.fillText(newPercetage+"%",0,12*2);
	};
}

function GameLoader(){
	
	this.loadListener = new DefaultLoaderScreen();
	
	this.setLoadingListener = function(loadingListener){
		this.loadListener = loadingListener;
	};
	
	this.load = function(){
		var context = canvas.getContext('2d');
		this.loadListener.onUpdateLoadedPercentage(context,0);
		resources.load(this);
	};
	
	this.updateLoadedPercentage = function(newPercetage){
		this.loadListener.onUpdateLoadedPercentage(canvas.getContext('2d'),newPercetage);
	};
	
	this.loadingComplete = function(){
		restartGame();
	};
}
