extends Node

var arr = SurfaceTool.new()
var index = 0
var middleCache = {}
var size
var vertices = []

func _ready():
	# Called every time the node is added to the scene.
	# Initialization here
	pass
	
class Triangle:
	var v1
	var v2
	var v3
	func _init(x, y, z):
		v1 = x
		v2 = y
		v3 = z
		
func add_vertex(p, off = 0.7):
#	var q = Vector3(1, 0, 0)
#	if q ==p:
#		q = Vector3(0,1,0)
#	var perp = p.cross(q)
#	p += Vector3(randf()-0.5, randf()-0.5, randf()-0.5)*perp
	vertices.append(p.normalized())#*(1.0-off*0.5+off*randf()))
	index += 1
	return index-1
	

func getMiddle(a, b):
	var less = a < b 
	var si = b
	var gi = a
	if less:
		si = a
		gi = b
	if (middleCache.has(Vector2(si, gi))):
		return middleCache[Vector2(si, gi)]
	var p1 = vertices[si]
	var p2 = vertices[gi]
	var p3 = (p1+p2)/Vector3(2.0, 2.0, 2.0)
	var i = add_vertex(p3, 0.3)
	middleCache[Vector2(si,gi)] = i
		
	return i


func make_icosphere(material, s, res):
	var t = 1.618033988749894
	size = s
	
	arr.set_material(material)
	arr.begin(4)
	add_vertex(Vector3(-1, t, 0))
	add_vertex(Vector3(1, t, 0))
	add_vertex(Vector3(-1, -t, 0))
	add_vertex(Vector3(1, -t, 0))
	
	add_vertex(Vector3(0, -1, t))
	add_vertex(Vector3(0, 1, t))
	add_vertex(Vector3(0, -1, -t))
	add_vertex(Vector3(0, 1, -t))
	
	add_vertex(Vector3(t, 0, -1))
	add_vertex(Vector3(t, 0, 1))
	add_vertex(Vector3(-t, 0, -1))
	add_vertex(Vector3(-t, 0, 1))
	var faces = Array()
	
	var indices = [ 0, 11, 5, 
        0, 5, 1, 
        0, 1, 7, 
        0, 7, 10, 
        0, 10, 11,

        1, 5, 9,
        5, 11, 4,
        11, 10, 2,
        10, 7, 6,
        7, 1, 8,

        3, 9, 4,
        3, 4, 2,
        3, 2, 6,
        3, 6, 8,
        3, 8, 9,
        
        4, 9, 5,
        2, 4, 11,
        6, 2, 10,
        8, 6, 7,
        9, 8, 1]
	for i in range(0, indices.size(), 3):
		faces.append(Triangle.new(indices[i], indices[i+1], indices[i+2]))
	
	for i in range(res):
		var faces2 = Array()
		for tri in faces:
			var a = getMiddle(tri.v1, tri.v2)
			var b = getMiddle(tri.v2, tri.v3)
			var c = getMiddle(tri.v3, tri.v1)
			faces2.append(Triangle.new(tri.v1, a, c))
			faces2.append(Triangle.new(tri.v2, b, a))
			faces2.append(Triangle.new(tri.v3, c, b))
			faces2.append(Triangle.new(a, b, c))
		faces = faces2
	for vert in vertices:
		arr.add_vertex(vert)
	for tri in faces:
		arr.add_index(tri.v3)
		arr.add_index(tri.v2)
		arr.add_index(tri.v1)
		
	arr.generate_normals()
	var mesh = arr.commit()
	var mdt = MeshDataTool.new()
	mdt.create_from_surface(mesh, 0)
	mesh.surface_remove(0)
	for i in range(mdt.get_vertex_count()):
		mdt.set_vertex(i, mdt.get_vertex(i).normalized()*size)
	mdt.commit_to_surface(mesh)
	return mesh