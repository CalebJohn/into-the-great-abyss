extends Node2D
#This node is necessary in order to display a 3d node in a 2d game
#I am also considering having different generaters that just plug in
#such as a 2d rough generator when first landed then better ones as you progress

#just passes off data and instructions to make scene into scene3d or scene2d node

func make_scene():
	get_node("Node2D/Viewport/Spatial").regenerate()


func _ready():
	pass


func _on_Scene_pressed():
	make_scene()
	if is_visible():
		hide()
	else:
		show()
