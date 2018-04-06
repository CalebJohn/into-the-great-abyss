extends Control

# How long the tween takes
var speed = 1
# 0 for map and 1 for panel
var current = 0

var start
var end

func move_map(direction):
	#make tween to toggle the map/panel
	var panelTween = Tween.new()
	add_child(panelTween)
	if direction == "out":
		panelTween.interpolate_method(self, "_tween_pos", start, end, speed, Tween.TRANS_QUAD, Tween.EASE_IN_OUT)
	elif direction == "in":
		panelTween.interpolate_method(self, "_tween_pos", end, start, speed, Tween.TRANS_QUAD, Tween.EASE_IN_OUT)
	panelTween.start()
	
func _tween_pos(pos):
	set_pos(pos)

func _on_Map_switch_scene(pos):
	move_map("out")
	get_parent().get_node("CanvasLayer/Messenger").pass_message(str(pos))

func _on_Base_switch_scene():
	move_map("in")
	
func _ready():
	start = Vector2(0, 0)
	end = Vector2(-get_viewport().get_rect().size.width, 0)