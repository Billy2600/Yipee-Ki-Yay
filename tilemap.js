// Check collision
// Returns true on collision
// Major thanks to lazyfoo
function CheckCollision(A, B)
{
    leftA = A.x;
    rightA = A.x + A.w;
    topA = A.y;
    bottomA = A.y + A.h;
    
    leftB = B.x;
    rightB = B.x + B.w;
    topB = B.y;
    bottomB = B.y + B.h;
    
    // If any of the sides from A are outside B
    if(bottomA <= topB) return false;
    if(topA >= bottomB) return false;
    if(rightA <= leftB) return false;
    if(leftA >= rightB) return false;
    // If none of the sides from A are outisde B
    return true;
}

// Convert value to valid pixel
// Certain browsers don't like if you include fractions in pixel coordinates
function GetPixel(value)
{
    return Math.max(1, Math.floor(value));
}
    
// Tilemap object
function Tilemap()
{    
    // map object
    var map;
    var tileset;
    var tilesetImg;
    var fg; // Layer number for foreground
    var bg; // Layer number for background

    this.Load = function(filename, entityManager)
    {
        
        // Required for Firefox
        $.ajaxSetup({beforeSend: function(xhr)
        {
            if (xhr.overrideMimeType)
            {
                xhr.overrideMimeType("application/json");
            }
        }});

        // Load map
        $.when(
            $.getJSON(filename),
        ).done(function(data1) {
            map = data1;
            console.log("Map loaded");
            $.getJSON(map.tilesets[0].source, function(data2) { tileset = data2 });
            console.log("Tileset loaded");
        });
    }
    
    // Check if a move is valid, must provide rect
    // Returns true on collision
    this.TryMove = function(rect)
    {
        // Find fg and bg layers if they haven't been
        if(typeof fg == "undefined" || typeof bg == "undefined")
        {
            for(var i = 0; i < map.layers.length; i++)
            {
                if(map.layers[i].name == "fg") fg = i;
                else if(map.layers[i].name == "bg") bg = i;
            }
        }
        
        var x = map.layers[fg].x, y = map.layers[fg].y;
        
        for(var i = 0; i < map.layers[fg].data.length; i++)
        {
            // Check collision
            var tempRect = {x: x, y: y, w: map.tilewidth, h: map.tileheight}; // Rectangle for tile we're on
            if(map.layers[fg].data[i] != 0 && CheckCollision(rect, tempRect))
            {
                return true;
            }
              
            // Move to next spot
            x += map.tilewidth;
            if( (x / map.tilewidth) >= map.layers[fg].width)
            {
                x = 0; // Move back
                y += map.tileheight; // Move to next row
            }
        }
        
        // TEMPORARY: Loop if out of bounds
        if( (rect.y + rect.h) > (map.height * map.tileheight) ) rect.y = 0; 
        
        return false;
    }
	
	// Draw to canvas, every frame
	this.Draw = function(ctx, camera)
	{
        // Load tilesetImg
        if(typeof tilesetImg == "undefined") // Is hopefully only done once; had to include in loop for some reason
        {
            tilesetImg = new Image();
            tilesetImg.src = tileset.image;
            console.log("tileset Image: " + tileset.image);
        }
        
        // Draw layers
        for(var i = 0; i < map.layers.length; i++)
        {
            if(map.layers[i].type == "tilelayer") this.DrawTileLayer(i, ctx, camera);
            else if(map.layers[i].type == "objectgroup") this.DrawObjectLayer(i, ctx, camera);
            else console.log("Layer #" + i + " invalid layer type");
        }
	}
    
    // Draw tile layer
    this.DrawTileLayer = function(layerNum, ctx, camera)
    {
        // Check for dimension errors in map
        if((map.layers[layerNum].width * map.layers[layerNum].height) != map.layers[layerNum].data.length)
        {
            console.log("Width/height of layer #" + layerNum + " did not match data");
            return; // Early out 
        }
        
        // Draw map
        var x = map.layers[layerNum].x, y = map.layers[layerNum].y; // Position of tile we're drawing
        
        for(var i = 0; i < map.layers[layerNum].data.length; ++i)
        {
            // Clip map to draw appropriate tile
            var tileNum = map.layers[layerNum].data[i] - 1; // Offset tile number by one
            var t = this.GetTileClip(tileNum);
            
            // Draw it out
            var tileRect = {x: x, y: y, w: map.tilewidth, h: map.tileheight };
            // Do not draw if this tile is on background and there's a tile in front
            // or if it is outside the camera
            if( tileNum > 0 && ((layerNum == bg && map.layers[fg].data[i] == 0) || layerNum == fg) && CheckCollision(camera, tileRect) )
            {
                ctx.drawImage(tilesetImg, t.x * map.tilewidth, t.y * map.tileheight, map.tilewidth, map.tileheight, x - camera.x, y - camera.y,
                    map.tilewidth, map.tileheight);
            }
            
            // Move to next spot
            x += map.tilewidth;
            if( (x / map.tilewidth) >= map.layers[layerNum].width)
            {
                x = 0; // Move back
                y += map.tileheight; // Move to next row
            }
        }
    }
    
    // Draw object layer
    this.DrawObjectLayer = function(layerNum, ctx, camera)
    {
        for(var i = 0; i < map.layers[layerNum].objects.length; i++)
        {
            var obj = map.layers[layerNum].objects[i];
            var t = this.GetTileClip(obj.gid - 1);
            
            ctx.drawImage(tilesetImg, t.x * obj.width, t.y * obj.height, obj.width, obj.height, obj.x - camera.x, obj.y - obj.height - camera.y,
                    obj.width, obj.height);
        }
    }
    
    // Get tile clip coordinates
    // Will return x and y values
    this.GetTileClip = function(tileNum)
    {
        var t = {x: 0, y: 0};
        t.x = Math.floor(tileNum % (tileset.imagewidth / map.tilewidth)); // Get x coord in image
        t.y = Math.floor(tileNum / (tileset.imagewidth / map.tilewidth)); // Get y coord
        
        return t;
    }
}