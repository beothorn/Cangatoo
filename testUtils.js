function TestUtils(){
	this.testLinesCoincidentHorizontal = function(){
		var point = lineIntersect(0,0,10,0,8,0,45,0);
		assertEquals(8,point.x);
		assertEquals(0,point.y);
	}
	
	this.testLinesCoincidentVertical = function(){
		var point = lineIntersect(0,6,0,40,0,0,0,10);
		assertEquals(0,point.x);
		assertEquals(6,point.y);
	}
	
	this.testLinesIntersection = function(){
		var point = lineIntersect(0,0,10,0,5,-5,5,15);
		assertEquals(5,point.x);
		assertEquals(0,point.y);
	}
	
	this.testParalellLines_ShouldReturnNull = function(){
		var point = lineIntersect(0,0,10,0,0,1,10,1);
		assertEquals(null,point);
	}
	
	this.testLinesWithSameLineEquationButNoIntersection_ShouldReturnNull = function(){
		var point = lineIntersect(0,0,10,0,11,0,15,0);
		assertEquals(null,point);
	}
}