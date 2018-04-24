extends Spatial

#should handle broad scene elements
#elements should include different sorts of features
	#some would always be present, others only sometimes
#including:
	# buildings
	# terrain
	# trees
	# rocks
	# shrubbery
	# clouds
	# water
# camera/scene should highlight a certain element
# for example, there may be a high level directive to show a town
	# this will make the scene construct more buildings
	# and aim the camera at them in a way that shows many
	# while buildings may be present in other scenes they will not be focussed on


var terrain = load("res://src/scripts/sceneutils/Terrain.gd")
var objects = load("res://src/scripts/sceneutils/SceneObjects.gd").new()


func place_house(pos):
	var mat = SpatialMaterial.new()
	var mesh = MeshInstance.new()
	mesh.set_mesh(objects.make_house(mat))
	mesh.translate(pos)
	add_child(mesh)

func regenerate():
	var ground = terrain.new()
	add_child(ground)
	var pos = Vector2(randf()*2-1, randf()*2-1)
	pos = Vector3(pos.x, ground.height(pos)+1, pos.y)+Vector3(0, 0, -10)
	place_house(pos)
	
	
func _ready():
	set_process(true)
	
	pass
	#ground:417634
	#white:dddddd
	#ambient:a4d2cc
	#sky:98d6ec
	
func _process(delta):
	if Input.is_action_pressed("scene_forward"):
		$Camera.translate(Vector3(0,0,-1))
	if Input.is_action_pressed("scene_left"):
		$Camera.rotate_y(0.01)
	if Input.is_action_pressed("scene_back"):
		$Camera.translate(Vector3(0,0,1))
	if Input.is_action_pressed("scene_right"):
		$Camera.rotate_y(-0.01)
	if Input.is_action_pressed("scene_up"):
		$Camera.translate(Vector3(0,1,0))
	if Input.is_action_pressed("scene_down"):
		$Camera.translate(Vector3(0,-1,0))

