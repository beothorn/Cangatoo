function Resources(){
	
	this.resourcesURLs = new Array();
	this.loadedResources = new Object();
	
	this.addImageUrlToLoad = function(url,imageName){
		this.resourcesURLs.push({url:url,name:imageName});
	}
	
	this.load = function(percentageListener){
		var resourcesLoaded = 0;
		var resourceCount = this.resourcesURLs.length;
		
		for(var i in this.resourcesURLs){
			var image = new Image();
			image.onload = function(){
				resourcesLoaded++;
				var newPercetage = (resourcesLoaded/resourceCount)*100;
				percentageListener.updateLoadedPercentage(newPercetage);
				if(resourcesLoaded == resourceCount)
					percentageListener.loadingComplete();
			};
			image.src = this.resourcesURLs[i].url;
			this.loadedResources[this.resourcesURLs[i].name] = image;
		}
	}
	
	this.get = function(resourceName){
		if(this.loadedResources[resourceName] == null)
			throw "No such resource "+resourceName;
		return this.loadedResources[resourceName];
	}
}
