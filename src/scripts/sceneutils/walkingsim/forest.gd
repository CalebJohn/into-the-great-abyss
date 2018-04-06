##more information needs to be passed into each mesh
##for example color
##and rotation
##these values should be handled by forest
##and can be random on a tree by tree basis

##add more information to forest
##values that guide tree type
##color range
##placement
extends MultiMeshInstance

var set_positions = false
var mm
var width = 15
var height = 15
var density = 0
var gpos

func _fixed_process(delta):
	if not set_positions:
		var space = get_world().get_direct_space_state()
		for i in range(density):
			var t = Transform()
			var pos = Vector3(randf()*width, 0, randf()*height)+Vector3(gpos.x, 0, gpos.y)
#			var pos = Vector3(0, 15, 0)
			
			var result = space.intersect_ray(pos, Vector3(pos.x, 15, pos.z), [get_node("../../../actor"), get_node("../../../actor").get_children()])
			if not result.empty():
				t = t.translated(result.position-Vector3(gpos.x, 0, gpos.y))
				mm.set_instance_transform(i,t)
		mm.generate_aabb()
		set_multimesh(mm)
		set_fixed_process(false)

func plant(x, z, w, h, d):
	gpos = Vector2(x, z)
	mm = MultiMesh.new()
	var mesh = get_node("Tree/MeshInstance").get_mesh()
	mm.set_mesh(mesh)
	mm.set_instance_count(d)
	width = w
	height = h
	density = d
	set_fixed_process(true)
	

func _ready():
	pass




