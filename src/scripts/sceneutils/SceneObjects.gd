extends Spatial

var mesh_gen = load("res://src/scripts/sceneutils/walkingsim/mesh_gen.gd").new()

func make_house(mat):
	var m = Mesh.new()
	var mdt = MeshDataTool.new()
	mdt.create_from_surface(mesh_gen.make_cube(mat, 1),0)
	mdt.commit_to_surface(m)
	mdt.create_from_surface(mesh_gen.make_cube(mat, 1),0)
	for i in range(mdt.get_vertex_count()):
		mdt.set_vertex(i, mdt.get_vertex(i)+Vector3(0.5, 2, 0.5))
	mdt.commit_to_surface(m)
	return m

func _ready():
	# Called every time the node is added to the scene.
	# Initialization here
	pass
