function Level(levelName){
	this.levelName = levelName;
	this.levelElements = new Array();
	
	this.removeElementFromLevelCreation = function(element){
		if( this.levelElements.length == 0)
			return;
		for(var i in this.levelElements){
			for(var factoryName in this.levelElements[i]){
				if(factoryName==element.factory.factoryName){
					var creationPositions = this.levelElements[i][factoryName];
					for(var positionIndex in creationPositions){
						if(creationPositions[positionIndex].x == element.x && creationPositions[positionIndex].y == element.y){
							this.levelElements[i][factoryName].splice(positionIndex,1);
						}
					}
				}
			}
		}
	};
	
	this.onLoadLevel = function(){
		/**
		* The event onLoadLevel is called when the level is created
		* Here you want to set initial values, lifes, scores etc.
		**/
	};
}