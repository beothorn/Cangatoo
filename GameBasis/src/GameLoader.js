function GameLoader(){
	this.load = function(){
		var context = canvas.getContext('2d');
		context.fillStyle = "Black";
		context.fillText("Loading",17,17);
		
		var resources = new Resources();
		resources.addImageUrlToLoad("http://thisiscolossal.com/wp-content/themes/colossal/images/header-sep.jpg","foo");
		resources.addImageUrlToLoad("http://2.bp.blogspot.com/-S7nw0dcc4-A/ThsZnVLgBiI/AAAAAAAAH6c/Ftjbioxun0g/s1600/20+Wallpapers+hd.jpg","bar");
		resources.addImageUrlToLoad("http://4.bp.blogspot.com/-Is4egSSDKpg/ThsZ2CroQTI/AAAAAAAAH7A/j1naQsiCGyQ/s1600/full_auto+Wallpapers+hd.jpg","baz");
		resources.load(this);
	}
	
	this.updateLoadedPercentage = function(newPercetage){
		var context = canvas.getContext('2d');
		context.fillStyle = "Black";
		context.fillText(""+newPercetage,newPercetage,newPercetage);
	}
	
	this.loadingComplete = function(){
		startGameAfterLoading();
	}
}
