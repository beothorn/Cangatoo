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
		assertEquals(element.x,9);
		assertEquals(element.xSpeed,9);
	}
	
	this.testXFrictionNegativeAcceleration = function(){
		var element = new Element(0,0);
		element.xAccelerate(-10);
		element.setXFriction(1);
		assertEquals(-10,element.xSpeed);
		var deltaOneSecond = 1000;
		element.step(deltaOneSecond);
		assertEquals(element.x,-9);
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
		assertEquals(10,element.ySpeed);
		element.step(deltaOneSecond);
		assertEquals(20,element.ySpeed);
	}
	
	this.testNotCollisionFromUp = function(){
		var element1 = new Element(1,0);
		element1.width = 10;
		element1.height = 10;
		var element2 = new Element(0,11);
		element2.width = 10;
		element2.height = 50;
		element1.yAccelerate(-10);
		var deltaOneSecond = 1000;
		element1.step(deltaOneSecond);
		element1.resolveCollisionWith(element2,deltaOneSecond);
		assertEquals(-10,element1.y);
		assertEquals(-10,element1.ySpeed);
	}
	
	this.testCollisionNoBounceFromUp = function(){
		var element1 = new Element(1,0);
		element1.width = 10;
		element1.height = 10;
		element1.elasticity =0;
		var element2 = new Element(0,11);
		element2.width = 10;
		element2.height = 50;
		element1.yAccelerate(10);
		var deltaOneSecond = 1000;
		element1.step(deltaOneSecond);
		element1.resolveCollisionWith(element2,deltaOneSecond);
		assertEquals(0,element1.y);
		assertEquals(0,element1.ySpeed);
	}
	
	this.testCollisionBouncingFromDown = function(){
		var element1 = new Element(1,0);
		element1.width = 10;
		element1.height = 10;
		var element2 = new Element(0,11);
		element2.width = 10;
		element2.height = 50;
		element2.elasticity =1;
		element2.yAccelerate(-10);
		var deltaOneSecond = 1000;
		element2.step(deltaOneSecond);
		element2.resolveCollisionWith(element1,deltaOneSecond);
		assertEquals(20,element2.y);
		assertEquals(10,element2.ySpeed);
	}
	
	this.testCollisionNoBounceFromLeftFloatLocation = function(){
		var element1 = new Element(0,1);
		element1.width = 10;
		element1.height = 10;
		element1.elasticity = 0;
		var element2 = new Element(10,0);
		element2.width = 10;
		element2.height = 10;
		element1.xAccelerate(5);
		var deltaOneSecond = 1000;
		element1.step(deltaOneSecond);
		element1.resolveCollisionWith(element2,deltaOneSecond);
		assertEquals(-1,element1.x);
		assertEquals(0,element1.xSpeed);
	}
	
	this.testCollisionNoBounceFromLeftFloatSpeed = function(){
		var element1 = new Element(0,1);
		element1.width = 10;
		element1.height = 10;
		element1.elasticity = 0;
		var element2 = new Element(10,0);
		element2.width = 10;
		element2.height = 10;
		element1.xAccelerate(5.1);
		var deltaOneSecond = 1000;
		element1.step(deltaOneSecond);
		element1.resolveCollisionWith(element2,deltaOneSecond);
		assertEquals(-1,element1.x);
		assertEquals(0,element1.xSpeed);
	}
	
	this.testCollisionBouncingFromLeft = function(){
		var element1 = new Element(0,1);
		element1.width = 10;
		element1.height = 10;
		element1.elasticity =1;
		var element2 = new Element(11,0);
		element2.width = 10;
		element2.height = 10;
		element1.xAccelerate(10);
		var deltaOneSecond = 1000;
		element1.step(deltaOneSecond);
		element1.resolveCollisionWith(element2,deltaOneSecond);
		assertEquals(-9,element1.x);
		assertEquals(-10,element1.xSpeed);
	}
	
	this.testCollisionBouncingFromRight = function(){
		var element1 = new Element(0,1);
		element1.width = 10;
		element1.height = 10;
		var element2 = new Element(11,0);
		element2.width = 10;
		element2.height = 10;
		element2.elasticity =1;
		element2.xAccelerate(-10);
		var deltaOneSecond = 1000;
		element2.step(deltaOneSecond);
		element2.resolveCollisionWith(element1,deltaOneSecond);
		assertEquals(20,element2.x);
		assertEquals(10,element2.xSpeed);
	}
	
	this.testShouldNotCollideFromLeft = function(){
		var element1 = new Element(0,0);
		element1.width = 10;
		element1.height = 10;
		var element2 = new Element(11,0);
		element2.width = 10;
		element2.height = 10;
		element1.xAccelerate(-10);
		var deltaOneSecond = 1000;
		element1.step(deltaOneSecond);
		element1.resolveCollisionWith(element1,deltaOneSecond);
		element1.resolveCollisionWith(element2,deltaOneSecond);
		assertEquals(-10,element1.x);
		assertEquals(-10,element1.xSpeed);
	}
}
