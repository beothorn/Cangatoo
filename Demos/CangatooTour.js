//GAMECODE START
function New_game(){

  this.setup = function(){
    this.setCanvasProperties();
    this.setResources();
    this.setGameName();
    this.loadFactories();
    this.loadLevels();
  };

  this.setCanvasProperties = function(){
    canvas.width  = 800;
    canvas.height = 300;
  };

  this.setResources = function(){
    resources.addImageUrlToLoad("./Sprites/clickToStart.png","clickScreen");
  };

  this.setGameName = function(){
    game.gameName = "New game";
  };

  this.loadFactory_TextPresenter = function(){

    var factory_TextPresenter = new ElementFactory("TextPresenter");

    factory_TextPresenter.onDraw = function (delta,context){
      context.fillStyle    = '#00f';
      context.font = 'bold 30px sans-serif';
      if (context.strokeText) {
        context.strokeText(self.text[0], 0, 50);
      }else{
        context.fillText(self.text[0],0,50);
      }
    };

    factory_TextPresenter.onCollision = function (other,delta){
    };

    factory_TextPresenter.onCreate = function (){		
      self.width = canvas.width;
      self.height = canvas.height;
      self.text = [];
      self.text[0] = "Foo";
    };

    factory_TextPresenter.onClick = function (absoluteClickPosition){		
    };

    factory_TextPresenter.onStep = function (delta,globalGameState){
    };

    factory_TextPresenter.onAfterStep = function (delta,globalGameState){
    };

    game.addFactory(factory_TextPresenter);

    this.loadFactories = function(){
      this.loadFactory_TextPresenter();
    };

  this.loadLevel_FirstLevel = function(){
    var level_FirstLevel = new Level("FirstLevel");
    level_FirstLevel.onLoadLevel = function () {
    };
    level_FirstLevel.levelElements = [
      {"TextPresenter":[{x:0,y:0}]}
    ];
    game.addLevel(level_FirstLevel);
    game.firstLevel = level_FirstLevel;
  };

  this.loadLevels = function(){
    this.loadLevel_FirstLevel();
  };

};

setGameToLoad(new New_game());

//GAMECODE END
