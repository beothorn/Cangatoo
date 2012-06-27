package com.appspot.cangatoo.server;

import javax.persistence.Id;

public class Test {
	@Id String vin; // Can be Long, long, or String
    String color;
    
    public Test() {
    	this.vin = "000";
		this.color = "black";
	}
    
    public Test(String vin, String color) {
		this.vin = vin;
		this.color = color;
    }
}
