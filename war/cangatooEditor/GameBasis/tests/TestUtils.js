function TestUtils(){
	this.testLinesCoincidentHorizontal = function(){
		var line1 = {x1:0,y1:0,x2:10,y2:0};
		var line2 = {x1:8,y1:0,x2:45,y2:0};
		var point = lineIntersect(line1,line2);
		assertEquals(8,point.x);
		assertEquals(0,point.y);
	};
	
	this.testLinesCoincidentVertical = function(){
		var line1 = {x1:0,y1:6,x2:0,y2:40};
		var line2 = {x1:0,y1:0,x2:0,y2:10};
		var point = lineIntersect(line1,line2);
		assertEquals(0,point.x);
		assertEquals(6,point.y);
	};
	
	this.testLinesIntersection = function(){
		var line1 = {x1:0,y1:0,x2:10,y2:0};
		var line2 = {x1:5,y1:-5,x2:5,y2:15};
		var point = lineIntersect(line1,line2);
		assertEquals(5,point.x);
		assertEquals(0,point.y);
	};

	this.testLinesIntersectionOnStartPoint = function(){
		var line1 = {x1:0,y1:0,x2:10,y2:0};
		var line2 = {x1:0,y1:0,x2:-10,y2:-15};
		var point = lineIntersect(line1,line2);
		assertEquals(0,point.x);
		assertEquals(0,point.y);
	};
	
	this.testLinesIntersectionOnExactLine = function(){
		var line1 = {x1:0,y1:0,x2:0,y2:50};
		var line2 = {x1:0,y1:10,x2:10,y2:10};
		var point = lineIntersect(line1,line2);
		assertEquals(0,point.x);
		assertEquals(10,point.y);
	};
	
	this.testLinesNotIntersect = function(){
		var line1 = {x1:0,y1:0,x2:4,y2:0};
		var line2 = {x1:5,y1:-5,x2:5,y2:15};
		var point = lineIntersect(line1,line2);
		assertEquals(null,point);
	};
	
	this.testParalellLines_ShouldReturnNull = function(){
		var line1 = {x1:0,y1:0,x2:10,y2:0};
		var line2 = {x1:0,y1:1,x2:10,y2:1};
		var point = lineIntersect(line1,line2);
		assertEquals(null,point);
	};
	
	this.testLinesWithSameLineEquationButNoIntersection_ShouldReturnNull = function(){
		var line1 = {x1:0,y1:0,x2:10,y2:0};
		var line2 = {x1:11,y1:0,x2:15,y2:0};
		var point = lineIntersect(line1,line2);
		assertEquals(null,point);
	};
	
	this.testIsPointInsideRectangle = function(){
		var point = {x:1,y:1};
		var rectangle =  {x1:0,y1:0,x2:2,y2:2};
		assertTrue(isPointInsideRectangle(point,rectangle));
	};
	
	this.testIsNotPointInsideRectangle = function(){
		var point = {x:3,y:1};
		var rectangle =  {x1:0,y1:0,x2:2,y2:2};
		assertFalse(isPointInsideRectangle(point,rectangle));
	};
	
	this.testIsPointOnEdgeOfRectangleInsideRectangle = function(){
		var point = {x:1,y:0};
		var rectangle =  {x1:0,y1:0,x2:2,y2:2};
		assertTrue(isPointInsideRectangle(point,rectangle));
	};
	
	this.testRectanglesIntersection = function(){
		var selfRectangle = {x1:0,y1:0,x2:2,y2:2};
		var otherRectangle = {x1:1,y1:1,x2:3,y2:3};
		assertTrue(rectanglesIntersect(selfRectangle,otherRectangle));
	};
	
	this.testRectanglesIntersectionOnEdge = function(){
		var selfRectangle = {x1:0,y1:0,x2:1,y2:1};
		var otherRectangle = {x1:1,y1:1,x2:2,y2:2};
		assertTrue(rectanglesIntersect(selfRectangle,otherRectangle));
	};
	
	this.testRectanglesNotIntersected = function(){
		var selfRectangle = {x1:0,y1:0,x2:1,y2:1};
		var otherRectangle = {x1:2,y1:2,x2:3,y2:3};
		assertFalse(rectanglesIntersect(selfRectangle,otherRectangle));
	};
	
	this.IGNOREtestRectanglesNotIntersectedInsideYInterval = function(){
		var selfRectangle = {x1:90,y1:90,x2:140,y2:162};
		var otherRectangle = {x1:140,y1:140,x2:172,y2:252};
		assertFalse(rectanglesIntersect(selfRectangle,otherRectangle));
	};
}