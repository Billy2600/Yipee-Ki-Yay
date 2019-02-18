// Player class
// Controls player character(s)
function EntityPlayer()
{
    // Public variables
    this.hitbox = {x: 100, y: 100, w: 16, h: 16}
    this.deleteMe = false;
    this.rotation = 0; // Current rotation (degrees)
    
    // Private variables
    // Physics stuff
    var xVel = 0; // X velocity
    var yVel = 0; // Y velocity
    var accel = 3; // Acceleration added per frame
    var speedLimit = 5; // Speed limit
    var rotationSpeed = 15;
    
    var tileset; // Tileset reference
    var flip; // Flip direction flag
    
    console.log("player loaded");
    
    // Move player
    this.Move = function(tilemap, keys, time)
    {
        // Attempt to move
        newPos = { x: this.hitbox.x, y: this.hitbox.y };

        // Srafe left
        if(keys.strafeLeft)
        {
            newPos.x += Math.cos((this.rotation - 180) * Math.PI / 180) * accel;
            newPos.y += Math.sin((this.rotation - 180) * Math.PI / 180) * accel;
        }

        // Strafe right
        if(keys.strafeRight)
        {
            newPos.x += Math.cos((this.rotation) * Math.PI / 180) * accel;
            newPos.y += Math.sin((this.rotation) * Math.PI / 180) * accel;
        }

        // Move forward
        if(keys.forward)
        {
            newPos.x += Math.cos((this.rotation - 90) * Math.PI / 180) * accel;
            newPos.y += Math.sin((this.rotation - 90) * Math.PI / 180) * accel;
        }

        // Move backwards
        if(keys.back)
        {
            newPos.x += Math.cos((this.rotation + 90) * Math.PI / 180) * accel;
            newPos.y += Math.sin((this.rotation + 90) * Math.PI / 180) * accel;
        }
		
        if(!tilemap.TryMove( {x: newPos.x, y: this.hitbox.y, w: this.hitbox.w, h: this.hitbox.h} ))
            this.hitbox.x = newPos.x;
        if(!tilemap.TryMove( {x: this.hitbox.x, y: newPos.y, w: this.hitbox.w, h: this.hitbox.h} ))
            this.hitbox.y = newPos.y;
    }

    this.Think = function(ctx, time)
    {

    }
    
    this.Draw = function(ctx, camera)
    {
        ctx.fillStyle = "green";
		ctx.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);

        //ctx.restore();
    }
    
    // Set camera to player position
    // Thanks again to lazyfoo
    this.SetCamera = function(camera)
    {
        // Center camera over player
        camera.x = Math.floor((this.hitbox.x + this.hitbox.w / 2) - camera.w / 2);
        camera.y = Math.floor((this.hitbox.y + this.hitbox.h / 2) - camera.h / 2);
        
        // Keep camera in bounds
        if(camera.x < 0) camera.x = 0;
        if(camera.y < 0) camera.y = 0;
    }

    this.HandleCollision = function(other)
    {
        
    }
}