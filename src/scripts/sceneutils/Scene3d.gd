extends Spatial

func regenerate():
	var pos = Vector2(randf()*2-1, randf()*2-1)
	get_node("TestCube").translate(Vector3(pos.x, 0.0, pos.y))

func _ready():
	pass
	#ground:417634
	#white:dddddd
	#ambient:a4d2cc
	#sky:98d6ec
