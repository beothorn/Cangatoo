function DefaultLoaderScreen(){
	this.onUpdateLoadedPercentage = function(canvasContext, newPercetage){
		canvasContext.fillStyle = "Black";
		canvasContext.fillText(""+newPercetage,newPercetage,newPercetage);
	}
}

function GameLoader(){
	
	this.loadListener = new DefaultLoaderScreen();
	
	this.setLoadingListener = function(loadingListener){
		this.loadListener = loadingListener;
	}
	
	this.load = function(){
		var context = canvas.getContext('2d');
		context.fillStyle = "Black";
		context.fillText("Loading",17,17);
		resources.load(this);
	}
	
	this.updateLoadedPercentage = function(newPercetage){
		this.loadListener.onUpdateLoadedPercentage(canvas.getContext('2d'),newPercetage);
	}
	
	this.loadingComplete = function(){
		startGameAfterLoading();
	}
}
