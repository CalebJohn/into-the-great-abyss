
extends Polygon2D

var mat

#updates size of polygon as well as the shader resolution uniform
func update_resolution(fullscreen):
	mat.set_shader_param("resolution", global.size)
	var polygon = Vector2Array()
	polygon.append(Vector2(0, 0))
	polygon.append(Vector2(global.size.x, 0))
	polygon.append(global.size)
	polygon.append(Vector2(0, global.size.y))
	set_polygon(polygon)
	
#updates sun position in shader
func update_sun(pos):
	mat.set_shader_param("mouse", pos)

func _ready():
	mat = get_material()


