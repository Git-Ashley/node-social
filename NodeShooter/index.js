


let Entity = class
{
    constructor(x, y, speed)
    {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;
        this.writable = true;
        this.type = null;
    }
}

let CircularEntity = class CircularEntity extends Entity
{
    constructor(x, y, speed, radius)
    {
        super(x, y, speed);
        this.radius = radius;
    }
}

let playerObj = class Player extends CircularEntity
{
    constructor(name, picUrl)
    {
        super(395, 395, 100, 10);
        this.name= name;
        this.type = "player";
        this.hit = 0;
        this.picUrl = picUrl;
    }
}

let Bullet = class Bullet extends CircularEntity
{
    constructor(originator, clickX, clickY)
    {
        super(0, 0, 300, 3);
        this.type = "bullet";
        this.player = originator;

        let theta;
        let diffX = clickX - originator.x;
        let diffY = originator.y - clickY;
        if(diffX >= 0)
            theta = Math.atan( diffY/diffX );
        else
            theta = Math.PI + Math.atan( diffY/diffX );
        this.y = originator.y - (originator.radius)*Math.sin(theta);
        this.x = originator.x + (originator.radius)*Math.cos(theta);
        this.dy = -(this.speed)*Math.sin(theta);
        this.dx = (this.speed)*Math.cos(theta);
    }
}

export default function(){
  return function initClient(room, ops) {
    // 0. DECLARATIONS
    let canvasInFocus = false;
    let canvasClicked = false;
    let animating = false;
    let wraf;
    let myName;
    let SELF;
    let bulletNo = 0;

    let canvasWidth = 800;
    let canvasHeight = 800;

    let keysDown = {
    	up : false,
    	down : false,
    	left : false,
    	right : false,
    	cancelAllKeys : function(){
    		this.up=false; this.down=false; this.left=false; this.right=false;
    	}
    };

    // 0.1: Game world variables
    // class player: {int x, int y, int dx, int dy}
    let entities = {};

    let cleanupTasks = [];

    function cleanup() {
      console.log('Freeing resources from NodeShooter');
      while(cleanupTasks.length)
        cleanupTasks.shift()();
      if(wraf) window.cancelAnimationFrame(wraf);
      window.onclick = null;
    }

  	room.on('START', function({entitiesOnServer, myNameOnServer}){
      console.log('booting up game');
  		myName = myNameOnServer;
  		entities = entitiesOnServer;
  		SELF = entities[myName];
  		canvasInFocus = true;
  		initGame(room);
  	});
  	room.on('player joined', function(player){
  		entities[player.name] = player;
  	});
  	room.on('player left', function(playerId){
  		delete entities[playerId];
  	});
  	room.on('move left', function(playerId){
  		let player = entities[playerId];
  		player.dx = -player.speed;
  	});
  	room.on('stop move left', function({playerId, atX, atY}){
  		let player = entities[playerId];
  		player.dx = 0;
  		player.x = atX;
  		player.y = atY;
  	});
  	room.on('move right', function(playerId){
  		let player = entities[playerId];
  		player.dx = player.speed;
  	});
  	room.on('stop move right', function({playerId, atX, atY}){
  		let player = entities[playerId];
  		player.dx = 0;
  		player.x = atX;
  		player.y = atY;
  	});
  	room.on('move up', function(playerId){
  		let player = entities[playerId];
  		player.dy = -player.speed;
  	});
  	room.on('stop move up', function({playerId, atX, atY}){
  		let player = entities[playerId];
  		player.dy = 0;
  		player.x = atX;
  		player.y = atY;
  	});
  	room.on('move down', function(playerId){
  		let player = entities[playerId];
  		player.dy = player.speed;
  	});
  	room.on('stop move down', function({playerId, atX, atY}){
  		let player = entities[playerId];
  		player.dy = 0;
  		player.x = atX;
  		player.y = atY;
  	});
  	room.on('player shot', function({bulletKey, originatorKey, clickX, clickY}){
  		let originator = entities[originatorKey];
  		entities[bulletKey] = new Bullet(originator, clickX, clickY);
  	});
  	room.on('collision', function({entityKey, destKey}){

  		let entity = entities[entityKey];
  		let dest = entities[destKey];
  		if(entity.type == 'bullet')
  		{
  			if(dest.radius > 1)
  			{
  				entity.player.radius++;
  				dest.radius--;
  			}
  			dest.hits++;
  			delete entities[entityKey];
  		}
  		else
  		{
  			if(entity.radius > 1)
  			{
  				dest.player.radius++;
  				entity.radius--;
  			}
  			entity.hits++;
  			delete entities[destKey];
  		}
  	});

    let initGame = function(room){

      const canvasElement = document.getElementById('node-shooter');

      canvasElement.onmousedown = function(e){
        e.preventDefault();
      };
    	let context = canvasElement.getContext('2d');

    	window.onclick = function() {
    		if(!canvasClicked){
    			// If canvas has just been knocked out of focus, stop animating
    			if(canvasInFocus)
    				stopAnimating();
    			canvasInFocus = false;
    		} else { // canvas has been clicked

    			// If canvas has just been brought into focus, call animate
    			if(!canvasInFocus)
    				wraf = window.requestAnimationFrame(animate);
    			canvasInFocus = true;
    			canvasClicked = false;
    		}
    	};

    	canvasElement.onclick = function(event) {
    		canvasClicked = true;

    		let x, y;

    		let canoffset = findPos(canvasElement);
    		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
    		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

    		let entityKey = "bullet|" + myName + "|" + bulletNo;
    		bulletNo++;
    		entities[entityKey] = new Bullet(SELF, x, y);
    		room.emit('player shot', {x, y});

    	};

      const onKeyDown = function (event) {

    		if(!canvasInFocus || SELF === undefined)
    			return;

        event.preventDefault();

    		let eventCode = event.charCode || event.keyCode;   // Get the Unicode value

    		switch (eventCode) {

    			case 38: // up arrow
    			case 87: // 'W'
    				if(!keysDown.up && !keysDown.down) // key has just been pressed
    				{
    					SELF.dy = -1;
    					keysDown.up = true;
    					room.emit('move up');
    				}
    				break;

    			case 40: // down arrow
    			case 83: // 'S'
    				if(!keysDown.down && !keysDown.up)
    				{
    					SELF.dy = 1;
    					keysDown.down = true;
    					room.emit('move down');
    				}
    				break;

    			case 37: // left arrow
    			case 65: // 'A'
    				if(!keysDown.left && !keysDown.right)
    				{
    					SELF.dx = -1;
    					keysDown.left = true;
    					room.emit('move left');
    				}
    				break;

    			case 39: // right arrow
    			case 68: // 'D'
    				if(!keysDown.right && !keysDown.left)
    				{
    					SELF.dx = 1;
    					keysDown.right = true;
    					room.emit('move right');
    				}
    				break;

    			default:
    			// Do nothing
    		}
    	};
    	window.addEventListener("keydown", onKeyDown, true);
      cleanupTasks.push(() => {
        window.removeEventListener("keydown", onKeyDown, true)
      });

      const onKeyUp = function (event) {
    		//if (event.defaultPrevented) {
    		//	return; // Should do nothing if the key event was already consumed.
    		//}

    		if(!canvasInFocus)
    			return;

        event.preventDefault();

    		let eventCode = event.charCode || event.keyCode;   // Get the Unicode value

    		switch (eventCode) {

    			case 38: // up arrow
    			case 87: // 'W'
    				if(keysDown.up)
    				{
    					keysDown.up = false;
    					SELF.dy = 0;
    					room.emit('stop move up');
    				}
    				break;

    			case 40: // down arrow
    			case 83: // 'S'
    				if(keysDown.down)
    				{
    					SELF.dy = 0;
    					keysDown.down = false;
    					room.emit('stop move up');
    				}
    				break;

    			case 37: // left arrow
    			case 65: // 'A'
    				if(keysDown.left)
    				{
    					SELF.dx = 0;
    					keysDown.left = false;
    					room.emit('stop move left');
    				}
    				break;

    			case 39: // right arrow
    			case 68: // 'D'
    				if(keysDown.right)
    				{
    					SELF.dx = 0;
    					keysDown.right = false;
    					room.emit('stop move right');
    				}
    				break;

    			default:
    			return; // Quit when this doesn't handle the key event.
    		}

    		// Consume the event for suppressing "double action".
    		//event.preventDefault();
    	};
    	window.addEventListener("keyup", onKeyUp, true);
      cleanupTasks.push(() => {
        window.removeEventListener("keyup", onKeyUp, true);
      });

    	let drawObj = {
    		rectangle: function (player) {
    			context.beginPath();
    			context.rect(player.x, player.y, player.radius, player.height);
    			context.fillStyle = 'black';
    			context.fill();
    			context.lineWidth = 1;
    			context.strokeStyle = 'black';
    			context.stroke();
    		},

    		circle: function (entity) {
          let radius = entity.radius;

          context.beginPath();

          /*if(entity.picUrl !== undefined && entity.picUrl){
            let thumbImg = document.createElement('img');

            thumbImg.src = entity.picUrl;
            context.arc(entity.x, entity.y, radius, 0, 2 * Math.PI, true);
            context.closePath();
            context.clip();

            context.drawImage(thumbImg, entity.x, entity.y, 50, 50);

            context.beginPath();
            context.arc(entity.x, entity.y, radius, 0, Math.PI * 2, true);
            context.clip();
            context.stroke();
          } else*/ {
            context.arc(entity.x, entity.y, radius, 0, 2 * Math.PI, false);
      	    context.fillStyle = (entity.type == "player") ? "rgb(" + 5*entity.hits + ",0,0)" : 'rgb(0,0,0)';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = (entity.type == "player") ? "rgb(" + 5*entity.hits + ",0,0)" : 'rgb(0,0,0)';;
            context.stroke();
          }

    			if(entity.hasOwnProperty("name")){ // Then it's a player entity
    				context.font = "20px Arial";
    				context.fillText(entity.name,entity.x - 10,entity.y + 30);
    			}
    		}
    	};

    	let lastTime = null;
    	function animate(time){

    		let deltaTime, multiplier;

    		if(lastTime === null || lastTime === undefined)
    		{
    			multiplier = 0.5;
    		} else {
    			deltaTime = time - lastTime;
    			multiplier = (deltaTime/1000);
    		}

    		// test not drawing players who don't move. will they disappear when not moving?
    		// but I have to clear the Rect... >_>
    		// Draw other players

    		context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    		for (let entityId in entities) {
    		  if (entities.hasOwnProperty(entityId)) {
      			let entity = entities[entityId];
      			let speedX;
      			let speedY;
      			if(entity.type == 'player' && entity.dy !== 0 && entity.dx !== 0)
      			{
      				speedX = Math.sqrt(0.5*(entity.speed)*(entity.speed))*((entity.dx)/Math.abs(entity.dx));
      				speedY = Math.sqrt(0.5*(entity.speed)*(entity.speed))*((entity.dy)/Math.abs(entity.dy));
      			}
      			else
      			{
      				speedX = entity.dx;
      				speedY = entity.dy;
      			}
      			entity.y += multiplier*speedY;
      			entity.x += multiplier*speedX;

      			if(entity.x > canvasWidth)
      			{
      				if(entity.type == 'bullet')
      					delete entities[entityId];
      				entity.x = canvasWidth;
      			}
      			else if (entity.x < 0 && entity.type == 'player')
      			{
      				if(entity.type == 'bullet')
      					delete entities[entityId];
      				entity.x = 0;
      			}

      			if(entity.y > canvasHeight)
      			{
      				if(entity.type == 'bullet')
      					delete entities[entityId];
      				entity.y = canvasHeight;
      			}
      			else if(entity.y < 0 && entity.type == 'player')
      			{
      				if(entity.type == 'bullet')
      					delete entities[entityId];
      				entity.y = 0;
      			}
      			drawObj.circle(entity);
    		  }
    		}

    		lastTime = time;
    		wraf = window.requestAnimationFrame(animate);
    	};

    	function stopAnimating(){
    		window.cancelAnimationFrame(wraf);
    		keysDown.cancelAllKeys();
    		lastTime = null;
    	};
    	wraf = window.requestAnimationFrame(animate);

      // helper function for finding true coordinates of an element.
      function findPos(obj) {
    	  let curleft = 0;
        let curtop = 0;
        if (obj.offsetParent) {
          do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
          } while (obj = obj.offsetParent);
          return {left: curleft, top: curtop};
        }
      }
    };
    return {cleanup};
  };
}
