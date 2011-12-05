function renderIncludes(includeList,includeCallBack){
	var includesJavaScriptCode = "";
	var includeCount = 0;
	for(var i in includeList){
		$(document).load(include[i],null,function(responseText){
			includesJavaScriptCode += responseText;
			includeCount++;
			if(includeCount == includeList.length){
				includeCallBack(includesJavaScriptCode);
			}
		});
	};
}
