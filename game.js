
(function(){
    var canvas = document.getElementById("canvas");
    var graphics = canvas.getContext("2d");
    var ptime = 0;
    

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
    
    
    
    
    
    var asteroids = [];
    canvas.addEventListener("mousemove", function(e){
        var rect = canvas.getBoundingClientRect();
        
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    var mouse = {x: 0, y:0};
    
    function gameLoop(time){
        
        if(isNaN(time)) time = 0;
        var dt = (time - ptime)/100;
        ptime = time;
        
        update(dt);
        draw();
        requestAnimFrame(gameLoop);
    }

    function update(dt){       
        
        
    }


    function draw(){
        graphics.clearRect(0,0, canvas.width, canvas.height);

        //push
        graphics.save();//begin matrix transformation
        
        graphics.fillRect(mouse.x, mouse.y, 10, 10);

        graphics.restore();//ends matrix transformattion
        //pop
    }
    gameLoop();
})();