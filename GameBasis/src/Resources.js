function Resources(){
	
	this.imageResourcesURLs = new Array();
	this.loadedResources = new Object();
	
	this.addImageUrlToLoad = function(url,imageName){
		for(var i in this.imageResourcesURLs){
			if(this.imageResourcesURLs[i].name == imageName){
				this.imageResourcesURLs[i].url = url;
				return;
			}
		}
		this.imageResourcesURLs.push({url:url,name:imageName});
	}
	
	this.load = function(percentageListener){
		var resourcesLoaded = 0;
		var resourceCount = this.imageResourcesURLs.length;
		
		for(var i in this.imageResourcesURLs){
			var image = new Image();
			image.onload = function(){
				resourcesLoaded++;
				var newPercetage = (resourcesLoaded/resourceCount)*100;
				percentageListener.updateLoadedPercentage(newPercetage);
				if(resourcesLoaded == resourceCount)
					percentageListener.loadingComplete();
			};
			image.src = this.imageResourcesURLs[i].url;
			this.loadedResources[this.imageResourcesURLs[i].name] = image;
		}
	}
	
	this.get = function(resourceName){
		if(this.loadedResources[resourceName] == null)
			throw "No such resource "+resourceName;
		return this.loadedResources[resourceName];
	}
}
