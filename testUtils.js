function TestUtils(){
	this.testLinesCoincidentHorizontal = function(){
		var line1 = {x1:0,y1:0,x2:10,y2:0};
		var line2 = {x1:8,y1:0,x2:45,y2:0};
		var point = lineIntersect(line1,line2);
		assertEquals(8,point.x);
		assertEquals(0,point.y);
	}
	
	this.testLinesCoincidentVertical = function(){
		var line1 = {x1:0,y1:6,x2:0,y2:40};
		var line2 = {x1:0,y1:0,x2:0,y2:10};
		var point = lineIntersect(line1,line2);
		assertEquals(0,point.x);
		assertEquals(6,point.y);
	}
	
	this.testLinesIntersection = function(){
		var line1 = {x1:0,y1:0,x2:10,y2:0};
		var line2 = {x1:5,y1:-5,x2:5,y2:15};
		var point = lineIntersect(line1,line2);
		assertEquals(5,point.x);
		assertEquals(0,point.y);
	}
	
	this.testLinesNotIntersect = function(){
		var line1 = {x1:0,y1:0,x2:4,y2:0};
		var line2 = {x1:5,y1:-5,x2:5,y2:15};
		var point = lineIntersect(line1,line2);
		assertEquals(null,point);
	}
	
	this.testParalellLines_ShouldReturnNull = function(){
		var line1 = {x1:0,y1:0,x2:10,y2:0};
		var line2 = {x1:0,y1:1,x2:10,y2:1};
		var point = lineIntersect(line1,line2);
		assertEquals(null,point);
	}
	
	this.testLinesWithSameLineEquationButNoIntersection_ShouldReturnNull = function(){
		var line1 = {x1:0,y1:0,x2:10,y2:0};
		var line2 = {x1:11,y1:0,x2:15,y2:0};
		var point = lineIntersect(line1,line2);
		assertEquals(null,point);
	}
}