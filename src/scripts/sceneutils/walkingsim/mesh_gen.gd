
extends MeshInstance

var simplify = preload("res://src/scripts/sceneutils/walkingsim/simplify.gd").new()
	
func _ready():
	pass

func make_quad(material, size, res):
	pass
	
func make_sphere(material, size, lat, long):
	pass
	
func make_cylinder(material, size, lat, long):
	pass

func make_trunk(material, size, sides, capped = false):
	var arr = SurfaceTool.new()
	arr.set_material(material)
	arr.begin(Mesh.PRIMITIVE_TRIANGLES)

	arr.add_vertex(Vector3(0, -1, 0)*size)

	arr.add_vertex(Vector3(0, 1, 0)*size)
	for i in range(1, 1+sides):
		var x = sin((float(i)/float(sides))*2.0*PI)
		var y = cos((float(i)/float(sides))*2.0*PI)
		arr.add_vertex(Vector3(x, -1, y)*size)
		arr.add_vertex(Vector3(x, 1, y)*size)
	for i in range(sides):
		var ax = (i*2)+2
		var bx = (i*2+2)%(sides*2)+2
		var ay = ax+1
		var by = bx+1
		if capped:
			arr.add_index(0)
			arr.add_index(ax)
			arr.add_index(bx)
			
			arr.add_index(by)
			arr.add_index(ay)
			arr.add_index(1)
#
		arr.add_index(ay)
		arr.add_index(bx)
		arr.add_index(ax)
#
		arr.add_index(bx)
		arr.add_index(ay)
		arr.add_index(by)
	arr.generate_normals()
#	var mesh = arr.commit()
	return arr.commit()
	
func make_icosphere(material, size, res):
	var ico = load("res://src/scripts/sceneutils/walkingsim/icosphere.gd").new()
	var mesh = ico.make_icosphere(material, size, res)
	return mesh
	

func make_cube(material, size):
	var arr = SurfaceTool.new()
	arr.set_material(material)
	arr.begin(Mesh.PRIMITIVE_TRIANGLES)
	arr.add_vertex(Vector3(-1, -1, -1)*size)
	arr.add_vertex(Vector3(-1, 1, -1)*size)
	arr.add_vertex(Vector3(1, -1, -1)*size)
	arr.add_vertex(Vector3(1, 1, -1)*size)
	arr.add_vertex(Vector3(-1, -1, 1)*size)
	arr.add_vertex(Vector3(-1, 1, 1)*size)
	arr.add_vertex(Vector3(1, -1, 1)*size)
	arr.add_vertex(Vector3(1, 1, 1)*size)
	
	#front
	arr.add_index(2)
	arr.add_index(1)
	arr.add_index(0)
	arr.add_index(1)
	arr.add_index(2)
	arr.add_index(3)
	#back
	arr.add_index(4)
	arr.add_index(5)
	arr.add_index(6)
	arr.add_index(7)
	arr.add_index(6)
	arr.add_index(5)
	#left
	arr.add_index(0)
	arr.add_index(5)
	arr.add_index(4)
	arr.add_index(1)
	arr.add_index(5)
	arr.add_index(0)
	#right
	arr.add_index(3)
	arr.add_index(6)
	arr.add_index(7)
	arr.add_index(2)
	arr.add_index(6)
	arr.add_index(3)
	#up
	arr.add_index(1)
	arr.add_index(3)
	arr.add_index(5)
	arr.add_index(7)
	arr.add_index(5)
	arr.add_index(3)
	#down
	arr.add_index(6)
	arr.add_index(2)
	arr.add_index(0)
	arr.add_index(0)
	arr.add_index(4)
	arr.add_index(6)
	
	arr.generate_normals()
	var mesh = arr.commit()
	return mesh

func collapse(mesh, ratio):
	
	return simplify.modify(mesh, 1.0-ratio)
