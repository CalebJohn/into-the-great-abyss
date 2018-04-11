extends Spatial


func make_house(mat):
	var cube = CubeMesh.new()
	cube.material = mat
	return cube

func _ready():
	# Called every time the node is added to the scene.
	# Initialization here
	pass

