function addCell(row,text){
	var cell = document.createElement("td");
  cell.appendChild(document.createTextNode(text));
  row.appendChild(cell);
}

function addLine(testName,result,color){ 
	var tableElement = document.getElementById("testResults");
  var row = document.createElement("tr");
  row.bgColor = color;
  
  addCell(row,testName);
  addCell(row,result);  
  
  tableElement.appendChild(row);
}

function runTestsFor(testClass){
	var testClassName = testClass.constructor.name;
	addLine(testClassName + " tests","Result","white");
	for(var property in testClass){
		if(typeof(eval("testClass."+property)) == 'function' && property.indexOf("test")==0){
			currentMethod = testClassName+">>"+property;
			try
			{
				eval("testClass."+property+"()");
				addLine(currentMethod,"OK","green");
			}catch(err)
			{
				addLine(currentMethod,err,"red");
			}
		}
	}
}		

function assertTrue(actual){
	if(!actual)
		throw "Should be true but was false.";
}

function assertFalse(actual){
	if(actual)
		throw "Should be false but was true.";
}

function assertEquals(expected,actual){
	if(expected!=actual)
		throw "Should be "+ expected +" but was "+ actual;
}
