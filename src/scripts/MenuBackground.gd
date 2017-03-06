
extends Polygon2D

var mat

#updates size of polygon as well as the shader resolution uniform
func update_resolution():
	mat.set_shader_param("resolution", global.size)
	set_scale(global.size)
	
#updates sun position in shader
func update_sun(pos):
	mat.set_shader_param("mouse", pos)

func _ready():
	mat = get_material()
	update_resolution()


