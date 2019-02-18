// Gameplay state
// This is the main state for the 3D rendered gameplay loop
function StateGameplay()
{
    // Private variables
    var player = new EntityPlayer();
    var tilemap = new Tilemap();
    var renderer = new Renderer();
    var entityManager = new EntityManager();
    // Camera rectangle
    var camera = { x: 0, y: 0, w: 0, h: 0 }; // Must be same width/height as canvas

    this.Start = function()
    {
        tilemap.Load("testmap.json", entityManager);
    }

    this.Update = function(timer, keys)
    {
        // Move player 
        player.Move(tilemap, keys, timer);
        player.SetCamera(camera);

        renderer.SetWorldMap(tilemap.GetForeground());
    }

    this.Draw = function(ctx, w, h) // ctx is the canvas, w = width, h = height
    {
        // Is this the first iteration?
        camera.w = w;
        camera.h = h;
        if(camera.w == 0 || camera.h == 0) // Something went wrong
        {
            console.log("ERROR: Camera size not correctly set");
            return;
        }

        //tilemap.Draw(ctx, camera);
        //player.Draw(ctx, camera);
        renderer.Draw(ctx, w, h, player.hitbox);
        
        // hud
        var text1 = "Position: " + Math.floor(player.hitbox.x) + "," + Math.floor(player.hitbox.y);
        var text2 = "Rotation: " + player.rotation;
        var text3 = "Use WASD keys to move";
        var text4 = "";
        ctx.fillStyle = "white";
        ctx.font="15px Verdana";
        ctx.fillText(text1, 5, 15);
        ctx.fillText(text2, 5, 30);
        ctx.fillText(text3, 5, 45);
        ctx.fillText(text4, 5, 60);
    }

    this.End = function()
    {

    }
}