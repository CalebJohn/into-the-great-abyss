#I dont love the style of the buttons right now but this is placeholder
#Maybe do something that runs edge detection on the clouds?
#or just shows through the clouds to the ground a bit?

extends TextureButton

#resize texture to button size
func _resize():
	set_texture_scale(get_size())

#callback for when clicked
func _clicked():
	get_parent().emit_signal("child_pressed", get_meta("position"))

#change the look of the button when the mouse is over it
func _mouse_over():
	get_material().set_shader_param("id", get_parent().get_pos()+get_pos())
	get_material().set_shader_param("buttonSize", get_parent().buttonSize)
	get_material().set_shader_param("resolution", global.size)

func _ready():
	set_texture_scale(get_size())
	#the alpha value of the buttons
	get_material().set_shader_param("tint", 0.4)
	#connect various callbacks for mouse
	connect("resized", self, "_resize")
	connect("pressed", self, "_clicked")
	connect("mouse_enter", self, "_mouse_over")


