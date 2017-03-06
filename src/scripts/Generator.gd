
extends Node2D
var passnum = 0
var size = global.size
#initial frame that this is loaded at
#needed so each render pass only consumes one frame
var startFrame = 0

#runs each frame.
func _process(delta):
	##once pass one is finished start pass two
	if OS.get_frames_drawn() == startFrame + 1:
		get_node("Pass2").set_render_target_update_mode(1)
	if OS.get_frames_drawn() == startFrame + 2:
		get_node("Pass3").set_render_target_update_mode(1)
	##after running pass three stop calling _process
	if OS.get_frames_drawn() >= startFrame + 3:
		set_process(false)

func _ready():
	set_process(true)
	startFrame = OS.get_frames_drawn()
	
	## initialize size of each viewport
	get_node("Pass1").set_rect(Rect2(0, 0, global.size.x, global.size.y))
	get_node("Pass1/Heightmap").set_scale(global.size)
	get_node("Pass2").set_rect(Rect2(0, 0, global.size.x, global.size.y))
	get_node("Pass2/MapNormal").set_scale(global.size)
	get_node("Pass2/MapNormal").get_material().set_shader_param("resolution", global.size)
	get_node("Pass3").set_rect(Rect2(0, 0, global.size.x, global.size.y))
	get_node("Pass3/MapShade").set_scale(global.size)
	get_node("Pass3/MapShade").get_material().set_shader_param("resolution", global.size)
	
	var mapHeight = get_node("Pass1").get_render_target_texture()
	var mapNorm = get_node("Pass2").get_render_target_texture()
	get_node("Pass2/MapNormal").get_material().set_shader_param("heightmap", mapHeight)
	get_node("Pass3/MapShade").get_material().set_shader_param("heightmap", mapHeight)
	get_node("Pass3/MapShade").get_material().set_shader_param("normal", mapNorm)