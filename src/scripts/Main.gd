
extends Control

func _fixed_process(delta):
	var escape = Input.is_action_pressed("exit")
	if escape:
		get_tree().quit()

func _ready():
	set_fixed_process(true)


