##basic Button class that displays a loading bar when loading
#and emits a signal when finished

extends ViewportContainer

signal finished
signal started
var tween
#material needs to be loaded this way otherwise uniform values are shared between all buttons
var timer_mat = preload("res://assets/shaders/TimerButtonMaterial.tres")

var text = "a" setget _set_text
var active = false
export var time = 1.0 #time it takes to load

##updates the loading bar
func update_loading_bar(progress):
	material.set_shader_param("progress", progress)

#resets loading bar and emits signal when finished
func reset_loading_bar(object, method, fin):
	material.set_shader_param("progress", 1.0)
	active = false
	if fin:
		emit_signal("finished")
	$Viewport/Button.pressed = false
	$Viewport/Button.toggle_mode = false
	
func disable_button(value):
	$Viewport.gui_disable_input = value

func _ready():
	material = timer_mat.duplicate(true)
	##initialize tween
	tween = $LoadTween
	tween.connect("tween_completed", self, "reset_loading_bar", [true])
	#pass in width and position to replace UV
	material.set_shader_param("width", rect_size.x)
	material.set_shader_param("text", $Viewport.get_texture())
	material.set_shader_param("progress", 1.0)

func _on_Button_resized():
	rect_size = $Viewport/Button.rect_size
	$Viewport.size = rect_size
	material.set_shader_param("width", rect_size.x)


func _on_Button_pressed():
	##only activates if not already loading
	if not active:
		$Viewport/Button.toggle_mode = true
		$Viewport/Button.pressed = true
		$Viewport.render_target_update_mode = Viewport.UPDATE_ALWAYS
		tween.interpolate_method(self, "update_loading_bar", 0.0, 1.0, time, Tween.TRANS_LINEAR, Tween.EASE_OUT)
		tween.start()
		active = true
		emit_signal("started")
		
func _set_text(a):
	text = a
	$Viewport/Button.text = a
