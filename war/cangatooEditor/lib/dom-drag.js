//Based on http://www.dynamicdrive.com/dynamicindex11/domdrag/
//Public domain

var highestZ = 0;
var wrapperDivSuffix = "WrapperDiv";
var titleBarDivSuffix = "TitleBarDiv";
var bottomBarDivSuffix = "BottomBarDiv";
var closeButtonSuffix = "CloseButton";
var hideButtonSuffix = "HideButton";

var elementBeingDragged = null;
var dragging = false;

var closeButtonImage = './lib/closeButton.png';
var minimizeButtonImage = './lib/minimizeButton.png';
var restoreButtonImage = './lib/restoreButton.png';

function setupWindows(){
	
	$(document).mousemove(function(e) {
		if(!dragging){ 
			return;
		}
		var o = elementBeingDragged;
		
		var ey	= e.clientY;
		var ex	= e.clientX;
		
		var y = parseInt($(elementBeingDragged.wrapper).css("top"));
		var x = parseInt($(elementBeingDragged.wrapper).css("left"));

		var nx, ny;
		
		nx = x + ex - o.lastMouseX;
		ny = y + ey - o.lastMouseY;

		//LOG POSITION
		//console.log(nx+","+ny);

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
	bringToFront(id);
}

function readableId(id){
	var escapedId = id.replace(/_/gi, " ");
	return escapedId;
}

function closeWindow(id){
	var wrapperId = id+wrapperDivSuffix;
	$("#"+wrapperId).hide();
}

function toogleVisibility(id){	
	var minimized = $("#"+id+hideButtonSuffix).attr("src") == restoreButtonImage;
	if(minimized){
		$("#"+id).show("fast");
		$("#"+id+hideButtonSuffix).attr("src", minimizeButtonImage);
	}else{
		$("#"+id).hide("fast");
		$("#"+id+hideButtonSuffix).attr("src", restoreButtonImage);
	};
}

function setUnclosable(id){
	$("#"+id+closeButtonSuffix).remove();
}

function addBordersToElement(id){
	$("#"+id).css({
		"border-style":"outset",
		"border-width":"1px"
	});
}

function wrapElement(id){
	var wrapperId = id+wrapperDivSuffix;
	$("#"+id).wrap('<div id="'+wrapperId+'" ></div>');
	leftValue = $("#"+id).data('x');
	topValue = $("#"+id).data('y');

	if(leftValue == null)
		leftValue = "0px";
	if(topValue == null)
		topValue = "0px";

	$("#"+wrapperId).css({
		"position":"absolute",
		"left":leftValue,
		"top":topValue
	});
}

function fillTitleBar(id){
	var titleBarId = id+titleBarDivSuffix;
	var jqTitleBar = $("#"+titleBarId);
	jqTitleBar.append($("#"+id).attr("title"));
	
	var hideButtonId = id+hideButtonSuffix;
	jqTitleBar.prepend('<img id="'+hideButtonId+'"  src="'+minimizeButtonImage+'"/>');
	$("#"+hideButtonId).click(function() {
		toogleVisibility(id);
	});
	$("#"+hideButtonId).css("border-style","none");
	$("#"+hideButtonId).css("float","right");
	
	
	var closeButtonId = id+closeButtonSuffix;
	jqTitleBar.prepend('<img id="'+closeButtonId+'" src="'+closeButtonImage+'"/>');
	$("#"+closeButtonId).click(function() {
		closeWindow(id);
	});
	$("#"+closeButtonId).css("border-style","none");
	$("#"+closeButtonId).css("float","right");
}

function bringToFront(id){
	var wrapperSelector = "#"+id+wrapperDivSuffix;
	highestZ++;
	$(wrapperSelector).css("z-index",highestZ);
}

function addTitleBar(id){
	var wrapperId = id+wrapperDivSuffix;
	var titleBarId = id+titleBarDivSuffix;
	
	$("#"+wrapperId).prepend(
		'<div id="'+titleBarId+'"></div>'
	);
	var jqTitleBar = $("#"+titleBarId);
	jqTitleBar.css({
		"background":"#eeeeee",
		"right":"0",
		"text-align":"left",
		"border-top-left-radius": "10px 5px",
		"border-top-right-radius": "10px",
		"border-style": "solid",
		"border-width": "1px",
		"border-color": "#999999"
	});
	
	var bottomCollor = "d2d2d2";
	var topCollor = "dcdcdc";
	
	jqTitleBar.css('filter','progid:DXImageTransform.gMicrosoft.gradient(startColorstr=\'#'+topCollor+'\', endColorstr=\'#'+bottomCollor+'\', gradientType=1)');
	jqTitleBar.css('background-image','-webkit-gradient(linear, left top, left bottom, color-stop(0.1, #'+topCollor+'), color-stop(0.99, #'+bottomCollor+'))');
	jqTitleBar.css('background-image','-moz-linear-gradient(top, #'+topCollor+' 0%, #'+bottomCollor+' 100%)');
	jqTitleBar.css('background-image','-o-linear-gradient(top, #'+topCollor+' 0%, #'+bottomCollor+' 100%)');
	
	jqTitleBar.mousedown(function(e) {
		dragging = true;
		var titleBarId = e.target.id;
		var elementId = titleBarId.replace(titleBarDivSuffix,"");
		
		bringToFront(elementId);
		elementBeingDragged = $(this).get(0);
		
		var o = elementBeingDragged;
		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;
	});
	
	fillTitleBar(id);
	
	var wrapper = document.getElementById(wrapperId);
	var titleBar = document.getElementById(titleBarId);
	titleBar.wrapper = wrapper;
	
}

function addBottomBar(id){
	var wrapperId = id+wrapperDivSuffix;
	var bottomBarId = id+bottomBarDivSuffix;
	
	$("#"+wrapperId).append(
		'<div id="'+bottomBarId+'"></div>'
	);
	var jqTitleBar = $("#"+bottomBarId);
	jqTitleBar.css({
		"background":"#eeeeee",
		"right":"0",
		"height":"10px",
		"text-align":"left",
		"border-style": "solid",
		"border-width": "1px",
		"border-color": "#999999"
	});
	
	var bottomCollor = "d2d2d2";
	var topCollor = "dcdcdc";
	
	jqTitleBar.css('filter','progid:DXImageTransform.gMicrosoft.gradient(startColorstr=\'#'+topCollor+'\', endColorstr=\'#'+bottomCollor+'\', gradientType=1)');
	jqTitleBar.css('background-image','-webkit-gradient(linear, left top, left bottom, color-stop(0.1, #'+topCollor+'), color-stop(0.99, #'+bottomCollor+'))');
	jqTitleBar.css('background-image','-moz-linear-gradient(top, #'+topCollor+' 0%, #'+bottomCollor+' 100%)');
	jqTitleBar.css('background-image','-o-linear-gradient(top, #'+topCollor+' 0%, #'+bottomCollor+' 100%)');
	
	jqTitleBar.mousedown(function(e) {
	});
	
	var wrapper = document.getElementById(wrapperId);
	var titleBar = document.getElementById(bottomBarId);
	titleBar.wrapper = wrapper;
	
}

function wrapOnWindow(id, hidden){
	addBordersToElement(id);
	wrapElement(id);
	addTitleBar(id);
	addBottomBar(id);
	
	if(hidden){
		closeWindow(id);
	}
}
