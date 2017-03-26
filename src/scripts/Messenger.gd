
extends Control

var index = 0

func pass_message(message):
	var node = Label.new()
	node.set_text(message)
	get_node("VBoxContainer/VBoxContainer").add_child(node)
	var s = (get_node("VBoxContainer").get_v_scroll())
	get_node("VBoxContainer").set_v_scroll(s+30)


func _ready():
	# Called every time the node is added to the scene.
	# Initialization here
	pass


func _on_Button_pressed():
	get_node("VBoxContainer").show()
	pass_message("neeew"+str(index))
	index += 1
	