function renderResources(){
	var resourcesToLoad = "\n"+
	"  this.setResources = function(){\n"+
	"    resources.addImageUrlToLoad(\"./Sprites/3dRedBall.png\",\"redBall\");\n"+
	"    resources.addImageUrlToLoad(\"./Sprites/clickToStart.png\",\"clickScreen\");\n"+
	"    resources.addImageUrlToLoad(\"./Sprites/testBackground.png\",\"background\");\n"+
	"    resources.addImageUrlToLoad(\"./Sprites/mainChar.png\",\"mainChar\");\n"+
	"  }\n";
	return resourcesToLoad;
}
