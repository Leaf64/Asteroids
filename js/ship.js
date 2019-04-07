function Ship()
{
	this.r = 0.04;
	this.rear_a = 50;
	this.a = 0;
	
	this.x = VAR.W/2;
	this.y = VAR.H/2;
	
	this.points = [ {}, {}, {} ];
	
	this.rotationSpeed = 7;
	
	this.modX = 0;
	this.modY = 0;
	
	this.acc = 0.001;
	this.maxMod = 0.019;
}

Ship.prototype.hitTest = function()
{
	for(var i=0; i<this.points.length; i++)
	{
		for(var r in Rock.all)
		{
			if(Rock.all[r].hitTest(this.points[i].x, this.points[i].y))
			{
				Rock.all[r].remove();
				return true;
			}
		}
	}
	return false;
}

Ship.prototype.draw = function()
{
	if(!this.destroyed)
	{
	if(this.hitTest())
	{
		this.destroyed = true;
		Game.stop();
	}
	else
	{
	if(Game.key_37 || Game.key_39)
	{
		this.a = this.a + this.rotationSpeed*( Game.key_37 ? -1 : 1);
	}
	
	if(Game.key_38)
	{
		if(this.modX >= 0)
		{
			this.modX = Math.min(this.maxMod*VAR.d, this.modX+Math.sin(Math.PI/180*this.a)*this.acc*VAR.d);
		}else if(this.modX <=0)
		{
			this.modX = Math.max(-this.maxMod*VAR.d, this.modX+Math.sin(Math.PI/180*this.a)*this.acc*VAR.d);
		}
		if(this.modY >= 0)
		{
			this.modY = Math.min(this.maxMod*VAR.d, this.modY-Math.cos(Math.PI/180*this.a)*this.acc*VAR.d);
		}
		else if(this.modY <=0)
		{
			this.modY = Math.max(-this.maxMod*VAR.d, this.modY-Math.cos(Math.PI/180*this.a)*this.acc*VAR.d);
		}
	} else
	{
		this.modX = this.modX*0.98;
		this.modX = Math.abs(this.modX)<0.1 ? 0 : this.modX;
		this.modY = this.modY*0.98;
		this.modY = Math.abs(this.modY)<0.1 ? 0 : this.modY;
		
	}
	
	
	this.x += this.modX;
	this.y += this.modY;
	Game.ctx.beginPath();
	for(var i =0; i<3; i++)
	{
		this.tmp_a = i===0 ? this.a : (this.a+180+(i==1 ? this.rear_a : -this.rear_a));
		this.tmp_r = i===0 ? this.r : this.r*0.6;
		this.points[i].x = Math.sin(Math.PI/180*this.tmp_a)*this.tmp_r*VAR.d+this.x;
		this.points[i].y = -Math.cos(Math.PI/180*this.tmp_a)*this.tmp_r*VAR.d+this.y;
		
		
		Game.ctx[i===0 ? 'moveTo' : 'lineTo'](this.points[i].x, this.points[i].y);
	}
	Game.ctx.closePath();
	Game.ctx.stroke();
	
	if(Game.key_38 && this.draw_thrust)
	{
		this.draw_thrust = false;;
	Game.ctx.beginPath();
		for(var i =0; i<3; i++)
		{
			this.tmp_a = i!=1 ? this.a+180+(i===0 ? -this.rear_a+14 : this.rear_a-14) : this.a+180;
			this.tmp_r = i==1 ? this.r : this.r*0.5;
			Game.ctx[i==0 ? 'moveTo' : 'lineTo'](
				Math.sin(Math.PI/180*this.tmp_a)*this.tmp_r*VAR.d+this.x,
				-Math.cos(Math.PI/180*this.tmp_a)*this.tmp_r*VAR.d+this.y
			);
		
		}
		Game.ctx.stroke();
	}else if (Game.key_38 && !this.draw_thrust){
		this.draw_thrust = true;
	}
	
	if(Game.key_38 && (!Game.thrust_sound || Game.thrust_sound<=0))
	{
		Game.thrust_sound = 60;
		Sound.play('thrust');
	} else if(Game.key_38 && Game.thrust_sound)
	{
		Game.thrust_sound -= 1000/VAR.fps;
	} else if(!Game.key_38)
	{
		Game.thrust_sound = false;
	}
	if(this.points[0].x<0 && this.points[1].x<0 && this.points[2].x<0)
	{
		this.x+=VAR.W - Math.min(this.points[0].x, this.points[1].x, this.points[2].x);
	} else if(this.points[0].x>VAR.W && this.points[1].x>VAR.W && this.points[2].x>VAR.W)
	{
		this.x-=VAR.W - (VAR.W - Math.max(this.points[0].x, this.points[1].x, this.points[2].x) );
	}
	
	if(this.points[0].y<0 && this.points[1].y<0 && this.points[2].y<0)
	{
		this.y+=VAR.H - Math.min(this.points[0].y, this.points[1].y, this.points[2].y);
	} else if(this.points[0].y>VAR.H && this.points[1].y>VAR.H && this.points[2].y>VAR.H)
	{
		this.y-=VAR.H - (VAR.H - Math.max(this.points[0].y, this.points[1].y, this.points[2].y) );
	}
	}
	}
};