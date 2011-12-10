/**************************************************
 * dom-drag.js
 * 09.25.2001
 * www.youngpup.net
 * Script featured on Dynamic Drive (http://www.dynamicdrive.com) 12.08.2005
 * Changed by beothorn on 12.08.2011
 **************************************************
 * 10.28.2001 - fixed minor bug where events
 * sometimes fired off the handle, not the root.
 **************************************************/


function setupWindows(){
	$(".window").each(function(){
		var id = $(this).attr('id');
		wrapOnWindow(id,false);
	});
	
	$(".windowHidden").each(function(){
		var id = $(this).attr('id');
		wrapOnWindow(id,true);
	});
	
	$(".windowDialog").each(function(){
		var id = $(this).attr('id');
		wrapOnWindow(id,false);
		setUnclosable(id);
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
	
	$("#"+id).wrap('<div id="'+wrapperId+'" style="position:absolute;border-bottom-color: #000000;border-style: outset;border-width=1px;" />');
	
	if(hidden){
		closeWindow(id);
	}
	
	$("#"+wrapperId).css("left",$("#"+id).css("left"));
	$("#"+wrapperId).css("top",$("#"+id).css("top"));
	
	$("#"+wrapperId).prepend(
		'<div id="'+titleBarId+'" style="background:#eeeeee;width:100%; text-align: right;"></div>'
	);
	
	var jqTitleBar = $("#"+titleBarId); 
	
	jqTitleBar.append(readableId(id));
	jqTitleBar.append('<input id="'+id+hideButtonSuffix+'" type="button" value="_" onClick="toogleVisibility(\''+id+'\')"/>');
	jqTitleBar.append('<input id="'+id+closeButtonSuffix+'" type="button" value="X" onClick="closeWindow(\''+id+'\')"/>');
  
	var titleBar = document.getElementById(titleBarId);
	var wrapper = document.getElementById(wrapperId);
	
	
	Drag.init(titleBar,wrapper);
}

var Drag = {

	obj : null,

	init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
	{
		o.onmousedown	= Drag.start;

		o.hmode			= bSwapHorzRef ? false : true ;
		o.vmode			= bSwapVertRef ? false : true ;

		o.root = oRoot && oRoot != null ? oRoot : o ;

		if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
		if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";
		if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
		if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

		o.minX	= typeof minX != 'undefined' ? minX : null;
		o.minY	= typeof minY != 'undefined' ? minY : null;
		o.maxX	= typeof maxX != 'undefined' ? maxX : null;
		o.maxY	= typeof maxY != 'undefined' ? maxY : null;

		o.xMapper = fXMapper ? fXMapper : null;
		o.yMapper = fYMapper ? fYMapper : null;

		o.root.onDragStart	= new Function();
		o.root.onDragEnd	= new Function();
		o.root.onDrag		= new Function();
	},

	start : function(e)
	{
		var o = Drag.obj = this;
		e = Drag.fixE(e);
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		o.root.onDragStart(x, y);

		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;

		if (o.hmode) {
			if (o.minX != null)	o.minMouseX	= e.clientX - x + o.minX;
			if (o.maxX != null)	o.maxMouseX	= o.minMouseX + o.maxX - o.minX;
		} else {
			if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
			if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
		}

		if (o.vmode) {
			if (o.minY != null)	o.minMouseY	= e.clientY - y + o.minY;
			if (o.maxY != null)	o.maxMouseY	= o.minMouseY + o.maxY - o.minY;
		} else {
			if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
			if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
		}

		document.onmousemove	= Drag.drag;
		document.onmouseup		= Drag.end;

		return false;
	},

	drag : function(e)
	{
		e = Drag.fixE(e);
		var o = Drag.obj;

		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		var nx, ny;

		if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
		if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
		if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
		if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

		nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
		ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

		if(o.xMapper){
			nx = o.xMapper(y);
		}else{
			if(o.yMapper){
				ny = o.yMapper(x);
			}
		}

		Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
		Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
		Drag.obj.lastMouseX	= ex;
		Drag.obj.lastMouseY	= ey;

		Drag.obj.root.onDrag(nx, ny);
		return false;
	},

	end : function()
	{
		document.onmousemove = null;
		document.onmouseup   = null;
		var endX = parseInt(Drag.obj.root.style[Drag.obj.hmode ? "left" : "right"]);
		var endY = parseInt(Drag.obj.root.style[Drag.obj.vmode ? "top" : "bottom"]);
		Drag.obj.root.onDragEnd(endX,endY);
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
