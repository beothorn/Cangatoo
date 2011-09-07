function TestElement(){
	this.testConstructor = function(){
		var element = new Element(10,15);
		assertEquals(10,element.x);
		assertEquals(15,element.y);
	}
	
	this.testHorizontalAcceleration = function(){
		var element = new Element(10,0);
		element.xAccelerate(10);
		assertEquals(10,element.xSpeed);
		element.xAccelerate(-10);
		assertEquals(0,element.xSpeed);
	}
	
	this.testVerticalAcceleration = function(){
		var element = new Element(10,0);
		element.yAccelerate(10);
		assertEquals(10,element.ySpeed);
		element.yAccelerate(-10);
		assertEquals(0,element.ySpeed);
	}
	
	this.testHorizontalSpeedLimit = function(){
		var element = new Element(0,0);
		element.setMaxXSpeed(100);
		element.xAccelerate(1000);
		assertEquals(100,element.xSpeed);
		element.setMaxXSpeed(100);
		element.xAccelerate(-1000);
		assertEquals(-100,element.xSpeed);
	}
	
	this.testVerticalSpeedLimit = function(){
		var element = new Element(0,0);
		element.setMaxYSpeed(100);
		element.yAccelerate(1000);
		assertEquals(100,element.ySpeed);
		element.setMaxYSpeed(100);
		element.yAccelerate(-1000);
		assertEquals(-100,element.ySpeed);
	}
	
	this.testXFrictionPositiveAcceleration = function(){
		var element = new Element(0,0);
		element.xAccelerate(10);
		element.setXFriction(1);
		assertEquals(10,element.xSpeed);
		var deltaOneSecond = 1000;
		element.step(deltaOneSecond);
		assertEquals(element.x,10);
		assertEquals(element.xSpeed,9);
	}
	
	this.testXFrictionNegativeAcceleration = function(){
		var element = new Element(0,0);
		element.xAccelerate(-10);
		element.setXFriction(1);
		assertEquals(-10,element.xSpeed);
		var deltaOneSecond = 1000;
		element.step(deltaOneSecond);
		assertEquals(element.x,-10);
		assertEquals(element.xSpeed,-9);
	}
	
	this.testWrapOnBoundaries = function(){
		var element = new Element(0,0);
		element.leftLimit = 0;
		element.topLimit = 0;
		element.rightLimit = 100;
		element.bottomLimit = 200;
		element.width = 10;
		element.height = 20;
		element.xAccelerate(1000);
		element.yAccelerate(1000);
		var deltaOneSecond = 1000;
		element.step(deltaOneSecond);
		assertEquals(100-10,element.x);
		assertEquals(200-20,element.y);
	}
	
	this.testGravity = function(){
		var element = new Element(0,0);
		element.gravity = 10;
		var deltaOneSecond = 1000;
		element.step(deltaOneSecond);
		assertEquals(-10,element.ySpeed);
		element.step(deltaOneSecond);
		assertEquals(-20,element.ySpeed);
	}
}
