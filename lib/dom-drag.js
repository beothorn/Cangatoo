var highestZ = 0;
var wrapperDivSuffix = "WrapperDiv";
var titleBarDivSuffix = "TitleBarDiv";
var closeButtonSuffix = "CloseButton";
var hideButtonSuffix = "HideButton";
var menuVisibilityOptionSuffix = "menuShowToogle";

var elementBeingDragged = null;
var dragging = false;

function setupWindows(){
	
	$(document).mousemove(function(e) {
		if(!dragging)
			return;
		var o = elementBeingDragged;
		
		var ey	= e.clientY;
		var ex	= e.clientX;
		
		
		var cssTopValue = $(elementBeingDragged.wrapper).css("top");
		var cssLeftValue = $(elementBeingDragged.wrapper).css("left");
		
		var y = parseInt(cssTopValue.replace("px",""));
		var x = parseInt(cssLeftValue.replace("px",""));
		var nx, ny;
		
		nx = x + ex - o.lastMouseX;
		ny = y + ey - o.lastMouseY;
		
		$(elementBeingDragged.wrapper).css("left",nx + "px");
		$(elementBeingDragged.wrapper).css("top",ny + "px");
		
		elementBeingDragged.lastMouseX	= ex;
		elementBeingDragged.lastMouseY	= ey;
	});
	
	$(document).mouseup(function(e) {
		dragging = false;
		elementBeingDragged = null;
	});
	
	$(".window").each(function(){
		var id = $(this).attr('id');
		wrapOnWindow(id,false);
		$(this).css("z-index",highestZ);
	});
	
	$(".windowHidden").each(function(){
		var id = $(this).attr('id');
		wrapOnWindow(id,true);
		$(this).css("z-index",highestZ);
	});
	
	$(".windowDialog").each(function(){
		var id = $(this).attr('id');
		wrapOnWindow(id,false);
		setUnclosable(id);
		$(this).css("z-index",highestZ);
	});
}


function showWindow(id){
	var wrapperId = id+wrapperDivSuffix;
	$("#"+wrapperId).show();
	var menuVisibilityOptionId = id+menuVisibilityOptionSuffix;
	$("#"+menuVisibilityOptionId).remove();
}

function readableId(id){
	var escapedId = id.replace(/_/gi, " ");
	return escapedId;
}

function closeWindow(id){
	var menuVisibilityOptionId = id+menuVisibilityOptionSuffix;
	if( $("#"+menuVisibilityOptionId).length != 0){
		return;
	}
	var wrapperId = id+wrapperDivSuffix;
	$("#"+wrapperId).hide();
	$("#visibilityMenu").prepend('<li id="'+menuVisibilityOptionId+'"></li>');
	$("#"+menuVisibilityOptionId).append('<a">'+readableId(id)+'</a>');
	$("#"+menuVisibilityOptionId).click(function() {
		showWindow(id);
	});
}

var visibilityByElementMap = new Object();

function toogleVisibility(id){	
	var minimized = visibilityByElementMap[id];
	if(minimized){
		$("#"+id).show("fast");
		$("#"+id+hideButtonSuffix).val("_");
		visibilityByElementMap[id] = false;
	}else{
		$("#"+id).hide("fast");
		$("#"+id+hideButtonSuffix).val("O");
		visibilityByElementMap[id] = true;
	};
}

function setUnclosable(id){
	$("#"+id+closeButtonSuffix).remove();
}

function wrapOnWindow(id, hidden){
	var wrapperId = id+wrapperDivSuffix;
	var titleBarId = id+titleBarDivSuffix;
	
	var jqElement = $("#"+id); 
	jqElement.wrap('<div id="'+wrapperId+'" ></div>');
	
	var jqWrapper = $("#"+wrapperId);
	jqWrapper.css({
		"position":"absolute",
		"left":jqElement.css("left"),
		"top":jqElement.css("top"),
		"border-style":"outset",
		"border-width":"1px"
	});
	
	jqWrapper.prepend(
		'<div id="'+titleBarId+'"></div>'
	);
	
//	/* default background colour, for all layout engines that don't implement gradients */
//	background: #2a6da9;
//
//	/* gecko based browsers */
//	background: -moz-linear-gradient(top, #55aaee, #003366);
//
//	/* webkit based browsers */
//	background: -webkit-gradient(linear, left top, left bottom, from(#55aaee), to(#003366));
	
	var jqTitleBar = $("#"+titleBarId);
	jqTitleBar.css({
		"background":"#eeeeee",
		"width":"100%",
		"text-align":"right"
	});
	
	jqTitleBar.css('filter','progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#FFFFFF\', endColorstr=\'#c7c7c7\', gradientType=1)');
	jqTitleBar.css('background-image','-webkit-gradient(linear, left top, left bottom, color-stop(0.1, #FFFFFF), color-stop(0.99, #c7c7c7))');
	jqTitleBar.css('background-image','-moz-linear-gradient(top, #FFFFFF 0%, #c7c7c7 100%)');
	jqTitleBar.css('background-image','-o-linear-gradient(top, #FFFFFF 0%, #c7c7c7 100%)');
	
	
	jqTitleBar.append(readableId(id));
	var hideButtonId = id+hideButtonSuffix;
	var closeButtonId = id+closeButtonSuffix;
	jqTitleBar.append('<input id="'+hideButtonId+'" type="button" value="_"/>');
	$("#"+hideButtonId).click(function() {
		toogleVisibility(id);
	});
	jqTitleBar.append('<input id="'+closeButtonId+'" type="button" value="X"/>');
	$("#"+closeButtonId).click(function() {
		closeWindow(id);
	});
  
	var titleBar = document.getElementById(titleBarId);
	var wrapper = document.getElementById(wrapperId);
	
	
	titleBar.wrapper = wrapper;
	jqTitleBar.mousedown(function(e) {
		dragging = true;
		var titleBarId = e.target.id;
		var elementId = titleBarId.replace(titleBarDivSuffix,"");
		var wrapperSelector = "#"+elementId+wrapperDivSuffix;
		highestZ++;
		$(wrapperSelector).css("z-index",highestZ);
		elementBeingDragged = $(this).get(0);
		
		var o = elementBeingDragged;
		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;
	});
	if(hidden){
		closeWindow(id);
	}
}