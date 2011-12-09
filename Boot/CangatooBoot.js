$(document).ready(function(){
	new CangatooBoot();
});

var gameCanvasElementId = "#gameCanvas";
var defaultGameUrl = "Demos/BouncingBalls.js";
var cangatoo;

var include = [
   "GameBasis/src/GameLoader.js",
   "GameBasis/src/Resources.js",
   "GameBasis/src/Element.js",
   "GameBasis/src/Level.js",
   "GameBasis/src/Utils.js",
   "GameBasis/src/Game.js",
   "GameBasis/src/ElementFactory.js",
   "GameBasis/src/GameSetup.js",
   "GameBasis/src/GameGlobals.js"
];


function CangatooBoot(){
	
	
	this.totalIncludes = 0;
	this.includeCount = 0;
	
	this.cangatooIncludes = [
	    "CangatooEditor/Cangatoo.js",
	    "WebEditor/Bindings.js",
	    "Export/src/GameSourceExport.js",
	    "Export/src/HeaderRenderer.js",
	    "Export/src/SetupRenderer.js",
	    "Export/src/CanvasPropertiesRenderer.js",
	    "Export/src/ResourcesRenderer.js",
	    "Export/src/GameNameRenderer.js",
	    "Export/src/FactoriesRenderer.js",
	    "Export/src/LevelsRenderer.js",	
	    "Export/src/FooterRenderer.js",
	    "Export/src/IncludesRenderer.js"
    ];
	
	this.afterIncludes = function(){
		cangatoo = new Cangatoo();
		var bindings = new Bindings();
		this.loadGameFromUrl(defaultGameUrl,bindings);
	};
	
	this.includeJSFile = function(includeURL,i){
		var context = $(gameCanvasElementId)[0].getContext('2d');
		context.fillStyle = "Black";
		context.font = "8pt Verdana";
		var y = (12*i)+12;
		context.fillText("Loading "+includeURL,0,y);
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = includeURL;
		$(document).append(script);
		this.includeCount++;
		if(this.includeCount == this.totalIncludes){
			this.afterIncludes();
		}
	};
	
	this.loadGameFromUrl = function(url,bindings){
		$(document).load(url,function(responseText){
			eval(getOnlyGameCode(responseText));
			bindings.doAllBindings();
		});
	};
	
	//todo all divs with class should turn into windows
	addWindowFrameAndSetPosition("gameCanvas",496 , 89);
	addWindowFrameAndSetPosition("menu",6,6);
	addWindowFrameAndSetPosition("factoriesTab",6 , 482);
	addWindowFrameAndSetPosition("levelsTab",969 , 482);
	
	addWindowFrameAndSetPosition("helpAboutText",0 , 0);
	addWindowFrameAndSetPosition("exportHtml",969 , 482);
	addWindowFrameAndSetPosition("loadGameCodeDiv",969 , 482);
	//
	
	this.totalIncludes = include.length+ this.cangatooIncludes.length;
	for(var i in include){
		this.includeJSFile(include[i],i);
	}
	for(var i in this.cangatooIncludes){
		this.includeJSFile(this.cangatooIncludes[i],parseInt(i)+include.length);
	}
	
	
}