extends Control

signal switch_scene

func _on_ButtonGrid_child_pressed(pos):
	emit_signal("switch_scene", pos)
