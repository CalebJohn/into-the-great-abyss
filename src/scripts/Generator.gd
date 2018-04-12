#Pass 2 can be collapsed into pass one by running it directly after the heightmap
#and reading directly from screen and writing only to the yzw values
#alternatively
#pass 3 can be collapsed into pass 2 very easily
#both of these are unnessecary for now but they would provide lower memory usage
#but having three passes allows us to use the third pass as a realtime pass

extends Node2D
#initial frame that this is loaded at
#needed so each render pass only consumes one frame
var startFrame = 0
var cloudUpdateFrame = -2
##store each texture so it is available outside of the Generator
var mapHeight;
var mapNormal;
var mapTexture;
var cloudHeight;
var cloudNormal;
var cloudTexture;
var cloudMask;

#update the mask once and update the cloud layer accordingly
func apply_mask(pos):
	$Pass7.render_target_update_mode = Viewport.UPDATE_ONCE
	$Pass7/Mask.material.set_shader_param("point", pos/global.size)
	cloudUpdateFrame = Engine.get_frames_drawn()
	set_process(true)

#runs each frame.
func _process(delta):
	##once pass one is finished start pass two
	##and the same for pass 5 and 6
	if Engine.get_frames_drawn() == startFrame + 1:
		$Pass2.render_target_update_mode = Viewport.UPDATE_ONCE
		$Pass5.render_target_update_mode = Viewport.UPDATE_ONCE
	if Engine.get_frames_drawn() == startFrame + 2:
		$Pass3.render_target_update_mode = Viewport.UPDATE_ONCE
		$Pass6.render_target_update_mode = Viewport.UPDATE_ONCE
	##after running pass four stop calling _process
	if Engine.get_frames_drawn() == startFrame + 4:
		set_process(false)
	##if cloudUpdateFrame is reset then re-render the cloud layer using the
	##updated mask
	if Engine.get_frames_drawn() == cloudUpdateFrame+1:
		$Pass6.render_target_update_mode = Viewport.UPDATE_ONCE
		set_process(false)
		

func _ready():
	#set_process(true)
	startFrame = Engine.get_frames_drawn()
	## initialize size of each viewport
	##TODO do this with groups
	$Pass1.size = global.size
	$Pass1/Heightmap.scale = global.size
	$Pass1/Heightmap.material.set_shader_param("resolution", global.size)
	$Pass2.size = global.size
	$Pass2/MapNormal.scale = global.size
	$Pass2/MapNormal.material.set_shader_param("resolution", global.size)
	$Pass3.size = global.size
	$Pass3/MapShade.scale = global.size
	$Pass3/MapShade.material.set_shader_param("resolution", global.size)
	$Pass4.size = global.size
	$Pass4/CloudHeight.scale = global.size
	$Pass4/CloudHeight.material.set_shader_param("resolution", global.size)
	$Pass5.size = global.size
	$Pass5/CloudNormal.scale = global.size
	$Pass5/CloudNormal.material.set_shader_param("resolution", global.size)
	$Pass6.size = global.size
	$Pass6/CloudShade.scale = global.size
	$Pass6/CloudShade.material.set_shader_param("resolution", global.size)
	$Pass7.size = global.size
	$Pass7/Mask.scale = global.size
	##acquire references to internal texture of all viewports in order
	##to be accessed from other parts of the generator and scene
	mapHeight = $Pass1.get_texture()
	mapNormal = $Pass2.get_texture()
	mapTexture = $Pass3.get_texture()
	cloudHeight = $Pass4.get_texture()
	cloudNormal = $Pass5.get_texture()
	cloudTexture = $Pass6.get_texture()
	cloudMask = $Pass7.get_texture()

	#Unfortunatly, this needs to be set from code now
	$GroundDisplay.texture = mapTexture
	$GroundDisplay.position = global.size * 0.5
	
	$CloudDisplay.texture = cloudTexture
	$CloudDisplay.position = global.size * 0.5
	
	#pass textures to other viewports to use them as input
	$Pass2/MapNormal.material.set_shader_param("heightmap", mapHeight)
	$Pass3/MapShade.material.set_shader_param("heightmap", mapHeight)
	$Pass3/MapShade.material.set_shader_param("normal", mapNormal)
	#set up the cloud render pass
	$Pass5/CloudNormal.material.set_shader_param("heightmap", cloudHeight)
	$Pass6/CloudShade.material.set_shader_param("heightmap", mapHeight)
	$Pass6/CloudShade.material.set_shader_param("cloudmap", cloudHeight)
	$Pass6/CloudShade.material.set_shader_param("normal", cloudNormal)
	$Pass6/CloudShade.material.set_shader_param("mask", cloudMask)	
