function Resources(){
	
	this.resourcesURLs = new Array();
	this.loadedResourcesMap;
	
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
			console.log(this.resourcesURLs[i].url);
			image.src = this.resourcesURLs[i].url;
		}
	}
}
