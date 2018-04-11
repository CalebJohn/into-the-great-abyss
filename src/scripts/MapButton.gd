#I dont love the style of the buttons right now but this is placeholder
#Maybe do something that runs edge detection on the clouds?
#or just shows through the clouds to the ground a bit?

extends TextureButton

var position


func _ready():
	#the alpha value of the buttons
	material.set_shader_param("tint", 0.4)



func _on_MapButton_pressed():
	get_parent().emit_signal("child_pressed", position)

func _on_MapButton_mouse_enter():
	material.set_shader_param("id", get_parent().get_position()+get_position())
	material.set_shader_param("buttonSize", get_parent().buttonSize)
	material.set_shader_param("resolution", global.size)
