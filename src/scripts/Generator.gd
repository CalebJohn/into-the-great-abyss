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
	get_node("Pass7").set_render_target_update_mode(1)
	get_node("Pass7/Mask").get_material().set_shader_param("point", pos/global.size)
	cloudUpdateFrame = OS.get_frames_drawn()
	set_process(true)

#runs each frame.
func _process(delta):
	##once pass one is finished start pass two
	##and the same for pass 5 and 6
	if OS.get_frames_drawn() == startFrame + 1:
		get_node("Pass2").set_render_target_update_mode(1)
		get_node("Pass5").set_render_target_update_mode(1)
	if OS.get_frames_drawn() == startFrame + 2:
		get_node("Pass3").set_render_target_update_mode(1)
		get_node("Pass6").set_render_target_update_mode(1)
	##after running pass four stop calling _process
	if OS.get_frames_drawn() == startFrame + 4:
		set_process(false)
	##if cloudUpdateFrame is reset then re-render the cloud layer using the
	##updated mask
	if OS.get_frames_drawn() == cloudUpdateFrame+1:
		get_node("Pass6").set_render_target_update_mode(1)
		set_process(false)
		

func _ready():
	set_process(true)
	startFrame = OS.get_frames_drawn()
	
	## initialize size of each viewport
	##TODO do this with groups
	get_node("Pass1").set_rect(Rect2(0, 0, global.size.x, global.size.y))
	get_node("Pass1/Heightmap").set_scale(global.size)
	get_node("Pass2").set_rect(Rect2(0, 0, global.size.x, global.size.y))
	get_node("Pass2/MapNormal").set_scale(global.size)
	get_node("Pass2/MapNormal").get_material().set_shader_param("resolution", global.size)
	get_node("Pass3").set_rect(Rect2(0, 0, global.size.x, global.size.y))
	get_node("Pass3/MapShade").set_scale(global.size)
	get_node("Pass3/MapShade").get_material().set_shader_param("resolution", global.size)
	get_node("Pass4").set_rect(Rect2(0, 0, global.size.x, global.size.y))
	get_node("Pass4/CloudHeight").set_scale(global.size)
	get_node("Pass4/CloudHeight").get_material().set_shader_param("resolution", global.size)
	get_node("Pass5").set_rect(Rect2(0, 0, global.size.x, global.size.y))
	get_node("Pass5/CloudNormal").set_scale(global.size)
	get_node("Pass5/CloudNormal").get_material().set_shader_param("resolution", global.size)
	get_node("Pass6").set_rect(Rect2(0, 0, global.size.x, global.size.y))
	get_node("Pass6/CloudShade").set_scale(global.size)
	get_node("Pass6/CloudShade").get_material().set_shader_param("resolution", global.size)
	
	##acquire references to internal texture of all viewports in order
	##to be accessed from other parts of the generator and scene
	mapHeight = get_node("Pass1").get_render_target_texture()
	mapNormal = get_node("Pass2").get_render_target_texture()
	mapTexture = get_node("Pass3").get_render_target_texture()
	cloudHeight = get_node("Pass4").get_render_target_texture()
	cloudNormal = get_node("Pass5").get_render_target_texture()
	cloudTexture = get_node("Pass6").get_render_target_texture()
	cloudMask = get_node("Pass7").get_render_target_texture()
	
	#pass textures to other viewports to use them as input
	get_node("Pass2/MapNormal").get_material().set_shader_param("heightmap", mapHeight)
	get_node("Pass3/MapShade").get_material().set_shader_param("heightmap", mapHeight)
	get_node("Pass3/MapShade").get_material().set_shader_param("normal", mapNormal)
	#set up the cloud render pass
	get_node("Pass5/CloudNormal").get_material().set_shader_param("heightmap", cloudHeight)
	get_node("Pass6/CloudShade").get_material().set_shader_param("heightmap", mapHeight)
	get_node("Pass6/CloudShade").get_material().set_shader_param("cloudmap", cloudHeight)
	get_node("Pass6/CloudShade").get_material().set_shader_param("normal", cloudNormal)
	get_node("Pass6/CloudShade").get_material().set_shader_param("mask", cloudMask)
	