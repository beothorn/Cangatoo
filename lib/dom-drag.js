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
	jqElement.css({ 
		"position":"absolute",
		"border-style":"outset",
		"border-width":"1px"
	});
	
	var jqWrapper = $("#"+wrapperId);
	jqWrapper.css({
		"left":$("#"+id).css("left"),
		"top":$("#"+id).css("top")
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

		obj : null,

		init : function(o, oRoot)
		{
			o.onmousedown	= Drag.start;
			o.root = oRoot && oRoot != null ? oRoot : o ;
			
		},

		start : function(e)
		{
			var titleBarId = e.target.id;
			var elementId = titleBarId.replace(titleBarDivSuffix,"");
			var wrapperSelector = "#"+elementId+wrapperDivSuffix;
			highestZ++;
			$(wrapperSelector).css("z-index",highestZ);
			
			console.log("start");
			
			var o = Drag.obj = this;
			e = Drag.fixE(e);

			o.lastMouseX	= e.clientX;
			o.lastMouseY	= e.clientY;

			document.onmousemove	= Drag.drag;
			document.onmouseup		= Drag.end;

			return false;
		},

		drag : function(e)
		{
			e = Drag.fixE(e);
			var o = Drag.obj;

			console.log("drag ");
			var ey	= e.clientY;
			var ex	= e.clientX;
			console.log("ex "+ex+" ey "+ey);
			var y = parseInt(o.root.style.top.replace("px",""));
			var x = parseInt(o.root.style.left.replace("px",""));
			var nx, ny;

			console.log("x "+x+" ex "+ex+" o.lastMouseX "+o.lastMouseX);
			nx = x + ex - o.lastMouseX;
			ny = y + ey - o.lastMouseY;

			
			console.log("nx "+nx+" ny "+ny);
			Drag.obj.root.style["left"] = nx + "px";
			Drag.obj.root.style["top"] = ny + "px";
			Drag.obj.lastMouseX	= ex;
			Drag.obj.lastMouseY	= ey;

			return false;
		},

		end : function()
		{
			document.onmousemove = null;
			document.onmouseup   = null;
			Drag.obj = null;
		},

		fixE : function(e)
		{
			if (typeof e == 'undefined') e = window.event;
			if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
			if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
			return e;
		}
	};
