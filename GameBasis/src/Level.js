function Level(levelName){
	this.levelName = levelName;

	this.removeElementFromLevelCreation(element){
		if( this.levelElements == null)
			return;
		for(var i in this.levelElements){
			for(var factoryName in this.levelElements[i]){
				if(factoryName==element.factory.factoryName){
					var index = this.levelElements[i][factoryName].indexOf({x:element.x,y:element.y});
					this.levelElements[i][factoryName].splice(index,1);
				}
			}
		}
	}
	
	this.backgroundImage = function(){
		return null;
	}
	
	this.onLoadLevel = function(){
		/**
		* The event onLoadLevel is called when the level is created
		* Here you want to set initial values, lifes, scores etc.
		**/
	}
}