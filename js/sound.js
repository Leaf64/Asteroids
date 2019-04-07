Sound = 
{
	active:false,
	init:function()
	{
		Sound.fx = new Howl({
			src:['audio/asteroids.'+(Modernizr.audio.m4a ? 'm4a' : 'ogg')],
			sprite: {
				bum1:[0,1100],
				bum2:[1125,1000],
				laser:[2150,290],
				win:[2475,575],
				thrust:[3100,290]
			},
			onload:Sound.loaded
		});
	},
	loaded:function()
	{
		Sound.active = true;
	},
	play:function(s)
	{
		if(Sound.active)
		{
			Sound.fx.play(s);
		}
	}
	
};