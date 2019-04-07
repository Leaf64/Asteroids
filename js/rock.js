
Rock.count = 0;
Rock.all = {};
Rock.data = [
	{r:0.025, speed: 0.0005,   minAngle:60, maxAngle:90},
	{r:0.08,  speed: 0.00025,  minAngle:50, maxAngle:70},
	{r:0.2,   speed: 0.00006,  minAngle:30, maxAngle:45}
];

function Rock(size, x, y)
{
	Rock.count++;
	this.id = Rock.count;
	Rock.all[this.id] = this;
		
	this.size = size!==undefined ? size : 2;
	this.x = (x !== undefined ? x : (VAR.rand(0,1) ? VAR.rand(0,3)/10 : VAR.rand(7,10)/10)*VAR.W);
	this.y = (y !== undefined ? y : (VAR.rand(0,1) ? VAR.rand(0,3)/10 : VAR.rand(7,10)/10)*VAR.H);
	
	this.r = Rock.data[this.size].r;
	
	this.modX = Rock.data[this.size].speed*VAR.rand(1,10)*(VAR.rand(0,1) ? 1 : -1);
	this.modY = Rock.data[this.size].speed*VAR.rand(1,10)*(VAR.rand(0,1) ? 1 : -1);
	
	this.points = [];
	var a = 0;
	while(a<360)
	{
		a+= VAR.rand(Rock.data[this.size].minAngle,Rock.data[this.size].maxAngle);
		this.points.push({
			x:Math.sin(Math.PI/180*a)*this.r, 
			y:Math.cos(Math.PI/180*a)*this.r
		});
	}
}
Rock.prototype.hitTest = function(x,y)
{
	if(x>this.x-this.r*VAR.d && x<this.x+this.r*VAR.d &&
	   y>this.y-this.r*VAR.d && y<this.y+this.r*VAR.d)
	   {
		   Game.hit_ctx.clearRect(this.x-this.r*VAR.d, this.y-this.r*VAR.d, this.r*2*VAR.d, this.r*2*VAR.d )
		   Game.hit_ctx.beginPath();
		   for(var i=0; i<this.points.length; i++)
			{
			Game.hit_ctx[i==0 ? 'moveTo' : 'lineTo'](this.points[i].x*VAR.d+this.x, this.points[i].y*VAR.d+this.y);
			}
			Game.hit_ctx.closePath();
			Game.hit_ctx.fill();
		   if(Game.hit_ctx.getImageData(x,y,1,1).data[0]==255)
			{
			return true;
			} 
	   }
	return false;
}
Rock.prototype.draw = function()
{
	this.x += this.modX*VAR.d;
	this.y += this.modY*VAR.d;
	
	if(this.x+this.r*VAR.d<0) {
		this.x+=VAR.W+(this.r*2*VAR.d);
	} else if (this.x-this.r*VAR.d>VAR.W) {
		this.x-=VAR.W+(this.r*2*VAR.d);
	}
	
	if(this.y+this.r*VAR.d<0) {
		this.y+=VAR.H+(this.r*2*VAR.d);
	} else if (this.y-this.r*VAR.d>VAR.H) {
		this.y-=VAR.H+(this.r*2*VAR.d);
	}
	

	
	Game.ctx.beginPath();
	for(var i=0; i<this.points.length; i++)
	{
		Game.ctx[i==0 ? 'moveTo' : 'lineTo'](this.points[i].x*VAR.d+this.x, this.points[i].y*VAR.d+this.y);
		
		Game.hit_ctx[i==0 ? 'moveTo' : 'lineTo'](this.points[i].x*VAR.d+this.x, this.points[i].y*VAR.d+this.y);
	}

	
	Game.ctx.closePath();
	Game.ctx.stroke();
};
Rock.prototype.remove =  function()
{
	Sound.play('bum'+VAR.rand(1,2));
	if(this.size>0)
	{
		for(var i=0, j = VAR.rand(3,5); i<j ; i++)
		{
			new Rock(this.size-1, this.x, this.y);
		}
	}
	Dot.add(this.x, this.y);
	delete Rock.all[this.id];
}

Rock.draw = function()
{
	Rock.num = 0;
	for(var r in Rock.all)
	{
		Rock.num++;
		Rock.all[r].draw();
	}
	if(Rock.num==0 && !Game.success)
	{
		Game.success = true;
		Sound.play('win');
	}
};