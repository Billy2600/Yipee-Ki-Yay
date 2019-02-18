$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
    var timer; // Game timer
	
	var keys = { strafeLeft: false, strafeRight: false, forward: false, back: false, turnLeft: false, turnRight: false, fire: false };
	var currentState;
	
	// Set up game
	function Start()
	{
		// Set default state here
		currentState = new StateGameplay();
		currentState.Start();

		timer = 0;

		// Create game loop
		if(typeof gameLoop != "undefined") clearInterval(gameLoop);
		gameLoop = setInterval(Update,16.67); // Note that this is calling the Update() function
	}
	
	// Update game logic, every frame
	function Update()
	{	
		currentState.Update(timer,keys);

		// Draw scene
		Draw();
        
        timer++;
	}
	
	// Draw to canvas, every frame
	function Draw()
	{
		// Clear previous frame
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, w, h);

        currentState.Draw(ctx, w, h);
	}
	
	// Note that these are outside a function
	$(document).keydown(function(e){
		var key = e.which;
        if(key == "37") keys.turnLeft = true;
		if(key == "39") keys.turnRight = true;
		if(key == "65") keys.strafeLeft = true; // W
		if(key == "87") keys.forward = true; // A
		if(key == "83") keys.back = true; // S
		if(key == "68") keys.strafeRight = true; // D
		if(key == "17") keys.fire = true;
	})
    
    $(document).keyup(function(e){
        var key = e.which;
        if(key == "37") keys.turnLeft = false;
		if(key == "39") keys.turnRight = false;
		if(key == "65") keys.strafeLeft = false; // W
		if(key == "87") keys.forward = false; // A
		if(key == "83") keys.back = false; // S
		if(key == "68") keys.strafeRight = false; // D
		if(key == "17") keys.fire = false;
    })
	
	// BEGIN RUNNING GAME
	Start();
})