var highestZ = 0;

function setupWindows(){
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

var wrapperDivSuffix = "WrapperDiv";
var titleBarDivSuffix = "TitleBarDiv";
var closeButtonSuffix = "CloseButton";
var hideButtonSuffix = "HideButton";
var menuVisibilityOptionSuffix = "menuShowToogle";

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
	
	var jqTitleBar = $("#"+titleBarId);
	jqTitleBar.css({
		"background":"#eeeeee",
		"width":"100%",
		"text-align":"right"
	});
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
	
	Drag.init(titleBar,wrapper);
	if(hidden){
		closeWindow(id);
	}
}

var Drag = {

		elementBeingDragged : null,
		dragging: false,

		init : function(o, oRoot)
		{
			o.root = oRoot;
			$(o).mousedown(function(e) {
				Drag.dragging = true;
				var titleBarId = e.target.id;
				var elementId = titleBarId.replace(titleBarDivSuffix,"");
				var wrapperSelector = "#"+elementId+wrapperDivSuffix;
				highestZ++;
				$(wrapperSelector).css("z-index",highestZ);
				Drag.elementBeingDragged = $(this).get(0);
				
				var o = Drag.elementBeingDragged;
				o.lastMouseX	= e.clientX;
				o.lastMouseY	= e.clientY;
			});
		
			$(document).mousemove(function(e) {
				if(!Drag.dragging)
					return;
				var o = Drag.elementBeingDragged;
				
				var ey	= e.clientY;
				var ex	= e.clientX;
				
				
				var cssTopValue = $(Drag.elementBeingDragged.root).css("top");
				var cssLeftValue = $(Drag.elementBeingDragged.root).css("left");
				
				var y = parseInt(cssTopValue.replace("px",""));
				var x = parseInt(cssLeftValue.replace("px",""));
				var nx, ny;
				
				nx = x + ex - o.lastMouseX;
				ny = y + ey - o.lastMouseY;
				
				$(Drag.elementBeingDragged.root).css("left",nx + "px");
				$(Drag.elementBeingDragged.root).css("top",ny + "px");
				
				Drag.elementBeingDragged.lastMouseX	= ex;
				Drag.elementBeingDragged.lastMouseY	= ey;
			
			});
			
			$(document).mouseup(function(e) {
				Drag.dragging = false;
				Drag.elementBeingDragged = null;
			});
			
		}
	};
