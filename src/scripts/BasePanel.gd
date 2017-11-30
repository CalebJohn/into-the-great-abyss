extends Control

signal switch_scene

func _on_Button_pressed():
	emit_signal("switch_scene")


func _on_Scene_pressed():
	if get_node("SceneView").is_visible():
		get_node("Scene").set_text("Generate Scene")
	else:
		get_node("Scene").set_text("Hide Scene")
