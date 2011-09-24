function ElementFactoriesEditor(game){
	this.game = game;

	this.getFactoriesNames = function(){
		var factories = game.getFactories();
		var factoriesNames = new Array();
		for (var i in factories){
			factoriesNames.push(factories[i].factoryName);
		}
		return factoriesNames;
	}

	this.getEventsFor = function(factoryName){
		var factories = game.getFactories();
		var factory;
		for (var i in factories){
			if(factories[i].factoryName == factoryName)
				factory = factories[i];
		}
		if(factory == null)
			throw "factory "+factoryName+" does not exist";

		var events = new Array();
		for(var property in factory){
			if(typeof(eval("factory."+property)) == 'function' && property.indexOf("on")==0)
				events.push(property);
		}
		return events;
	}

	this.getFactoryByName = function(factoryName){
		var factories = game.getFactories();
		for (var i in factories){
			if(factories[i].factoryName == factoryName)
				return factories[i];
		}
		return null;
	}
}
