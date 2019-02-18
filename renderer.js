// This whole class is thanks to Lode Vandevenne lodev.org

// Renderer object
function Renderer()
{
    // Local variables
    var dir = { x: -1, y: 0 }; // Direction vector
    var plane = { x: 0, y: 0.66 }; // The 2d raycaster versin of camera plane
    var worldMap;

    this.SetWorldMap = function(newWorldMap)
    {
        worldMap = newWorldMap;
    }

    this.Draw = function(ctx, w, h, pos)
    {
        drawStart = 0;

        // Loop through each vertical strip of screen
        for(x = 0; x < w; x++)
        {
            // Calculate ray position and direction
            var cameraX = 2 * x / w - 1; // x-coordinate in camera space
            var rayDir = { x: dir.x + plane.x * cameraX, y: dir.y + plane.y * cameraX };

            // Which box of the map we're in
            var map = { x: Math.round(pos.x), y: Math.round(pos.y) };
            // Length of the ray form current position to next x or y-side
            var sideDist = { x: 0, y: 0 };

            // Length of ray from one x or y-side to the next one
            var deltaDist = { x: Math.abs(1 / rayDir.x), y: Math.abs(1 / rayDir.y) };
            var perpWallDist;

            // What direction to step in x or y-direction (either +1 or -1)
            var step = { x: 0, y: 0 };

            var hit = false; // Was there a wall hit?
            var side = 0; // Was NS or EW wall hit?

            // Calculate step and initial sideDist
            if(rayDir.x < 0)
            {
                step.x = -1;
                sideDist.x = (pos.x - map.x) * deltaDist.x;
            }
            else
            {
                step.x = 1;
                sideDist.x = (map.x + 1.0 - pos.x) * deltaDist.x;
            }

            if(rayDir.y < 0)
            {
                step.y = -1;
                sideDist.y = (pos.y - map.y) * deltaDist. y;
            }
            else
            {
                step.y = 1;
                sideDist.y = (map.y + 1.0 - pos.y) * deltaDist.y;
            }

            // Perform DDA
            while(hit == false)
            {
                // Jump to next map square, OR in x-direciton, OR in y-direction
                if(sideDist.x < sideDist.y)
                {
                    sideDist.x += deltaDist.x;
                    map.x += step.x;
                    side = 0;
                }
                else
                {
                    sideDist.y += deltaDist.y;
                    map.y += step.y;
                    side = 1;
                }

                // This should never happen
                if(typeof worldMap.data[map.x + (map.y * worldMap.width)] == "undefined") break;
                
                // Check if ray has hit a wall
                if(worldMap.data[map.x + (map.y * worldMap.width)] > 0) hit = true;
            }

            // Calculate distance projected on camera direction (Euclidean distance will give fisheye effect)
            if(side == 0) perpWallDist = (map.x - pos.x + (1 - step.x) / 2) / rayDir.x;
            else          perpWallDist = (map.y - pos.y + (1 - step.y) / 2) / rayDir.y;

            // Calculate the height of th eline to draw on screen
            var lineHeight = Math.round(h / perpWallDist);

            // Calculate the lowest and highest pixel to fill in current stripe
            var drawStart = -lineHeight / 2 + h / 2;
            var drawEnd = lineHeight / 2 + h / 2;

            // Choose wall color
            var color;
            switch(worldMap.data[map.x + (map.y * worldMap.width)])
            {
                case 1: color = "#8e9b90";
                case 2: color = "#93c0a4";
                case 3: color = "#b6c4a2";
                case 4: color = "#d4cdab";
                case 5: color = "#dce2bd";
                case 6: color = "#efb0a1";
                case 7: color = "#f4afb4";
                case 8: color = "#c9b7ad";
            }

            ctx.fillStyle = color;
            ctx.fillRect(x, drawStart, 1, lineHeight);
        }
    }
}