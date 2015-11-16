
(function(){
    var canvas = document.getElementById("canvas");
    var graphics = canvas.getContext("2d");
    var ptime = 0;
    var copSpawnTimer = 10;

    var requestAnimFrame = (function(){
        return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || 
        function(f) {
            setTimeout(f, 1000/60);
        };
    })();
    
    /*
        Create fixed game assets (player car and road)
        Player Car
        
        Road pieces will warp up and lock in with other road piece after falling off screen.
        Road piece 1
        Road piece 2
    */
    
    //ITEM SPAWNING
    var road1 = new Sprite("imgs/road.png");
        road1.x = canvas.width/2;
        road1.y = canvas.height/2;
    var road2 = new Sprite("imgs/road.png");
        road2.x = canvas.width/2;
        road2.y = canvas.height - canvas.height - 400;

    var car = new Player();    
    var cops = [];//These will be spawned randomly in the update function.
    
    function Sprite(url){
        this.img = new Image();
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.scale = 1;     
        this.anchorx = 0;
        this.anchory = 0;
        this.hasLoaded = false;
        
        var me = this;
        
        this.img.onload = function(){
            me.anchorx = this.width/2;
            me.anchory = this.height/2;
            me.hasLoaded = true;
        };
        this.img.src = url;
        this.draw = function(g){
            if(this.hasLoaded === false) return;
            g.save();
            g.translate(this.x, this.y);
            g.rotate(this.angle);
            g.scale(this.scale, this.scale)
            g.drawImage(this.img, -this.anchorx, -this.anchory);
            g.restore();
        };
    }
    
    
    //PLAYER CLASS
        function Player(x, y){
            var obj = new Sprite("imgs/car.png");
            obj.lane = 2;
            
            obj.minY;//top of car
            obj.maxY;//bottom of car
            obj.x = x;
            obj.y = 700;
            
            
            
            obj.update = function(x, y){
                
                if(obj.lane === 1){
                    obj.x = 100;
                }
                if(obj.lane === 2){
                    obj.x = 300;
                }
                if(obj.lane === 3){
                    obj.x = 500;
                }
                obj.minY = obj.y - 50; //top edge of car
                obj.maxY = obj.y + 50; //bottom edge of car
                
                //driving sensation (looks like an old fashiod cartoon where cars chug along)
                obj.scale -= .002;
                if(obj.scale <= .96) obj.scale = 1;
                //console.log(obj.x + " : " + obj.y);
            }
            
            return obj;
        }
    
        function Cop(x, y){
            var obj = new Sprite("imgs/cop.png");            
            obj.lane = Math.floor(Math.random() * 3) + 1;
            
            obj.minY;//top of car
            obj.maxY;//bottom of car            
            obj.y = -300;
            obj.dead = false;
            
            if(obj.lane === 1){
                    obj.x = 100;
                }
                if(obj.lane === 2){
                    obj.x = 300;
                }
                if(obj.lane === 3){
                    obj.x = 500;
                }
            
            obj.update = function(x, y){
                
                
                obj.minY = obj.y - 50; //top edge of car
                obj.maxY = obj.y + 50; //bottom edge of car
                obj.y+=5;
                //driving sensation (looks like an old fashiod cartoon where cars chug along)
                obj.scale -= .002;
                if(obj.scale <= .96) obj.scale = 1;
                
                if(obj.y > 900) obj.dead = true;
            }
            
            return obj;
        }
    
    
    //MOUSE TRACKER CODE
    canvas.addEventListener("mousemove", function(e){
        var rect = canvas.getBoundingClientRect();
        
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    var mouse = {x: 0, y:0};
    
    //KEYBOARD BUTTON PRESS CODE (INSTRUCTIONS FOR PROGRAM TO DO SOMETHING DURING CERTAIN KEY PRESSES)
    function keys(keyCode){
        
        if(keyCode === 37 && car.lane != 1) car.lane--;
        if(keyCode === 39 && car.lane != 3) car.lane++;
    }
    
    //HIT DETECTION
    function hitDetection(pCar, obj){
        if(pCar.lane === obj.lane){
            if(pCar.minY < obj.maxY && pCar.maxY > obj.minY) {
                obj.dead = true;
                
            }

        
        }
    }
    
    function gameLoop(time){
        
        if(isNaN(time)) time = 0;
        var dt = (time - ptime)/100;
        ptime = time;
        
        update(dt);
        draw();
        requestAnimFrame(gameLoop);
    }

    function update(dt){    
        
        road1.y+=10;
        road2.y+=10;
        //SPAWN COPS RANDOMLY
        if(road1.y > 799 + 400) road1.y = canvas.height - canvas.height - 400;
        if(road2.y > 799 + 400) road2.y = canvas.height - canvas.height - 400;
        copSpawnTimer -= dt;
        if(copSpawnTimer <= 0){
            cops.push(new Cop());
            copSpawnTimer = 8;
        }
        //TODO: SPAWN OBSTICALS
        //TODO: SPAWN BONUS
        
        //KEYBOARD KEY DOWN TRACKER
        document.onkeydown = function(e){
            keys(e.keyCode);
        };
        
        //object updates
        car.update(mouse.x, mouse.y);
        for(var i = cops.length - 1; i >= 0; i--){
            cops[i].update();
            hitDetection(car, cops[i]);
            if(cops[i].dead) cops.splice(i, 1);
        }

        
    }


    function draw(){
        graphics.clearRect(0,0, canvas.width, canvas.height);

        //push
        graphics.save();//begin matrix transformation
        
        
        road1.draw(graphics);
        road2.draw(graphics);
        car.draw(graphics);
        for(var i = cops.length - 1; i >= 0; i--){
            cops[i].draw(graphics);
        }
        //TODO: UI SCOREBAR

        graphics.restore();//ends matrix transformattion        
        //pop
    }
    gameLoop();
})();