
extends Node2D
var passnum = 0
var size = global.size
var startFrame = 0

func _process(delta):
	##once pass one is finished start pass two
	if OS.get_frames_drawn() == startFrame + 1:
		get_node("Pass2").set_render_target_update_mode(1)
	if OS.get_frames_drawn() == startFrame + 2:
		get_node("Pass3").set_render_target_update_mode(1)

func _ready():
	set_process(true)
	startFrame = OS.get_frames_drawn()
	var mapHeight = get_node("Pass1").get_render_target_texture()
	var mapNorm = get_node("Pass2").get_render_target_texture()
	get_node("Pass2/MapNormal").get_material().set_shader_param("heightmap", mapHeight)
	get_node("Pass3/MapShade").get_material().set_shader_param("heightmap", mapHeight)
	get_node("Pass3/MapShade").get_material().set_shader_param("normal", mapNorm)