function convertGameNameToVariable(gameName){
	var newGameName = gameName;
	newGameName = newGameName.replace(" ", "_" );
	if(newGameName.indexOf( " " ) != -1){
		newGameName = convertGameNameToVariable(gameName);
	}
	return newGameName;
}

function exportJSTo(game,includeList,callBack){
	var renderedGameHeader = renderHeader();
	var renderedSetupFunction = renderSetup();
	var renderedCanvasFunction = renderCanvasProperties();
	var renderedResourcesFunction = renderResources();
	var renderedGameNameFunction = renderGameName();
	var renderedLoadForEachFactory = renderLoadForEachFactory();
	var renderedLoadFactories = renderLoadFactories();
	var renderedLoadForEachLevel = renderLoadForEachLevel();
	var renderedLoadLevels = renderLoadLevels();
	var renderedFooter = renderFooter();
	
	var renderedGameCode = 
				renderedGameHeader+
				renderedSetupFunction+
				renderedCanvasFunction+
				renderedResourcesFunction+
				renderedGameNameFunction+
				renderedLoadForEachFactory+
				renderedLoadFactories+
				renderedLoadForEachLevel+
				renderedLoadLevels+
				renderedFooter;
				
	renderIncludes(includeList,function(includesJavaScriptCode){
			callBack(renderedGameCode+includesJavaScriptCode);
	});
}
