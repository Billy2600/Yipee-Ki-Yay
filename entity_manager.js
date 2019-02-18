function EntityManager()
{
	this.entities = [];

	this.Add = function(entity)
	{
		this.entities.push(entity);
	}

	this.CheckCollisions = function()
	{
		for(i = 0; i < this.entities.length; i++)
		{
			for(j = 0; j < this.entities.length; j++)
			{
				if(entities[i] == entities[j])
					continue;
			}
		}
	}

	this.Think = function()
	{
		for(i = 0; i < this.entities.length; i++)
		{
			entities[i].Think();

			if(entities[i].delteMe)
				entities.splice(i, 1);
		}
	}

	this.Draw = function()
	{
		for(i = 0; i < this.entities.length; i++)
		{
			entities[i].Draw();
		}
	}
}