extends Node2D
#This node is necessary in order to display a 3d node in a 2d game
#I am also considering having different generaters that just plug in
#such as a 2d rough generator when first landed then better ones as you progress

#just passes off data and instructions to make scene into scene3d or scene2d node

var time = 0.5 #range of 0-2 (dawn)

func make_scene():
	$Node2D/Viewport/Spatial.regenerate()

func _ready():
	$Node2D/Viewport.size = global.size * 0.5
	make_scene()
	$Sprite.position = global.size * 0.5
	$Sprite.texture = $Node2D/Viewport.get_texture()


func _on_Scene_pressed():
	make_scene()
	visible = visible == false

