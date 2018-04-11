
extends Control

##clean up shader code
##add gradient field to fade out the filter to the edges?

export(String, "Grayscale", "Invert", "Blur", "Glow", "Edge_Detect", "BCS", "Modulate") var effect

export var multipass = false
export var radius = 1.0 #Blur, Glow, Edge_Detect
export var strength = 1.0 #all
export var threshhold = 1.0 #Glow, Edge_Detect
export var BCS = Vector3(1, 1, 1) #only BCS
export var color = Color(1, 1, 1, 1) #all

func _ready():
	var mat
	if not multipass:
		mat = load("res://assets/shaders/"+effect+"Filter.tres").duplicate(true)
	else:
		var n = get_node("TextureFrame")
		mat = load("res://assets/shaders/"+effect+"XFilter.tres").duplicate(true)
		var m = load("res://assets/shaders/"+effect+"YFilter.tres").duplicate(true)
		m.set_shader_param("radius", radius)
		m.set_shader_param("strength", strength)
		m.set_shader_param("threshhold", threshhold)
		m.set_shader_param("resolution", global.size)
		m.set_shader_param("Color", color)
		m.set_shader_param("brightness", BCS.x)
		m.set_shader_param("contrast", BCS.y)
		m.set_shader_param("saturation", BCS.z)
		n.set_material(m)
		n.show()
	print(mat)
	mat.set_shader_param("radius", radius)
	mat.set_shader_param("strength", strength)
	mat.set_shader_param("threshhold", threshhold)
	mat.set_shader_param("resolution", global.size)
	mat.set_shader_param("Color", color)
	mat.set_shader_param("brightness", BCS.x)
	mat.set_shader_param("contrast", BCS.y)
	mat.set_shader_param("saturation", BCS.z)
	set_material(mat)