##basic Button class that displays a loading bar when loading
#and emits a signal when finished

extends Button

signal finished
var tween
#material needs to be loaded this way otherwise uniform values are shared between all buttons
var material = load("res://assets/shaders/TimerButtonMaterial.tres")

var active = false
export var time = 1.0 #time it takes to load

##updates the loading bar
func update_loading_bar(progress):
	get_material().set_shader_param("progress", progress)
	
#resets loading bar and emits signal when finished
func reset_loading_bar(object, method):
	get_material().set_shader_param("progress", 1.0)
	active = false
	emit_signal("finished")

func _ready():
	set_material(material.duplicate(true))
	##initialize tween
	tween = get_node("LoadTween")
	tween.connect("tween_complete", self, "reset_loading_bar")
	#pass in width and position to replace UV
	get_material().set_shader_param("posx", get_pos().x);
	get_material().set_shader_param("width", get_size().x)

##called when pressed
func _on_TimerButton_pressed():
	##only activates if not already loading
	if not active:
		tween.interpolate_method(self, "update_loading_bar", 0.0, 1.0, time, Tween.TRANS_LINEAR, Tween.EASE_OUT)
		tween.start()
		active = true