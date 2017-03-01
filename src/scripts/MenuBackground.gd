
extends Polygon2D

func _fixed_process(delta):
	var mat = get_material()
	mat.set_shader_param("mouse", get_viewport().get_mouse_pos())

func _ready():
	set_fixed_process(true)


