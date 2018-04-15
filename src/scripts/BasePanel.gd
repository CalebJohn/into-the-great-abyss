extends Control

signal switch_scene

var timer_button = load("res://src/scenes/TimerButton.tscn")

func _ready():
	#First add buttons to gather the resource manually
	#TODO Time to gather should be based off properties
	for key in resources.types:
		var new_button = timer_button.instance()
		new_button.text = "Gather " + key
		new_button.time = 10.0
		new_button.connect("finished", self, "resource_gather", [key])
		$GatherButtons.add_child(new_button)
	#Then buttons to process each material
	#TODO time to process should be based off properties
	for key in resources.types:
		var new_button = timer_button.instance()
		new_button.text = "Process " + key
		new_button.time = 4.0
		new_button.connect("finished", self, "resource_process", [key])
		$ProcessButtons.add_child(new_button)

func _on_Button_pressed():
	emit_signal("switch_scene")


func _on_Scene_pressed():
	if get_node("SceneView").is_visible():
		get_node("Scene").set_text("Generate Scene")
	else:
		get_node("Scene").set_text("Hide Scene")

func resource_gather(key):
	print("gathered " + key)
	
func resource_process(key):
	print("processed " + key)
