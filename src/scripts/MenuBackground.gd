
extends Polygon2D


#updates size of polygon as well as the shader resolution uniform
func update_resolution():
	material.set_shader_param("resolution", global.size)
	scale = global.size
	
#updates sun position in shader
func update_sun(pos):
	material.set_shader_param("mouse", pos)

func _ready():
	update_resolution()



