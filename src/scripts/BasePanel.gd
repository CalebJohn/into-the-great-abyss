extends Control

signal switch_scene

func _on_Button_pressed():
	emit_signal("switch_scene")
