
extends Control

#right now this is in the root node of both Menu and Level
#We may want to give each their own script in the future

var riseTime = 1

func _physics_process(delta):
	#Check if exit button is pressed
	#this is configured in project settings
	var escape = Input.is_action_pressed("exit")
	if escape:
		get_tree().quit()

func _ready():
	pass



