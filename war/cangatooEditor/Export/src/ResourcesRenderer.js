function renderResources(){
	
	var resourcesToLoad = "\n"+
	"  this.setResources = function(){\n";
	var imageResources = resources.imageResourcesURLs;
	for(var i in imageResources){
		var imageResource = imageResources[i];
		resourcesToLoad += "    resources.addImageUrlToLoad(\""+imageResource.url+"\",\""+imageResource.name+"\");\n";
	}	
	resourcesToLoad += "  };\n";
	return resourcesToLoad;
}
