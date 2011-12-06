function renderCanvasProperties(){
	var canvasPropertiesCode = "\n"+
	"  this.setCanvasProperties = function(){\n"+
	"    canvas.width  = "+canvas.width+";\n"+
	"    canvas.height = "+canvas.height+";\n"+
	"  }\n";
	return canvasPropertiesCode;
}
