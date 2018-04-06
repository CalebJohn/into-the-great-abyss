#learn blender decimate
#this method does not give nice looking results
extends Node

func computeEdgeCollapseCost(u, v):
	var edgeLength = u.position.distance_to(v.position)
	var curvature = 0
	var sidefaces = []
	for i in range(u.faces.size()):
		var face = u.faces[i]
		if face.hasVertex(v):
			sidefaces.push_back(face)
	for i in range(u.faces.size()):
		var minCurvature = 1
		var face = u.faces[i]
		for j in range(sidefaces.size()):
			var sideFace = sidefaces[j]
			var dotprod = face.normal.dot(sideFace.normal)
			minCurvature = min(minCurvature, (1.001-dotprod)/2)
		curvature = max(minCurvature, curvature)
	var borders = 0
	if sidefaces.size()<2:
#		borders+=10 #doesnt really work	
		curvature = 1
	var amt = edgeLength
	return amt*randf()
	
func computeEdgeCostAtVertex(v):
	if v.neighbors.empty():
		v.collapseNeighbor = null
		v.collapseCost = -0.01
		return 0
	v.collapseCost = 100000
	v.collapseNeighbor = null
	for i in range(v.neighbors.size()):
		var collapseCost = computeEdgeCollapseCost(v, v.neighbors[i])
		if v.collapseNeighbor == null:
			v.collapseNeighbor = v.neighbors[i]
			v.collapseCost = collapseCost
			v.minCost = collapseCost
			v.totalCost = 0
			v.costCount = 0
		v.costCount +=1
		v.totalCost += collapseCost
		if collapseCost<v.minCost:
			v.collapseNeighbor = v.neighbors[i]
			v.minCost = collapseCost
	v.collapseCost = v.totalCost/v.costCount
	
func removeVertex(v, vertices):
	while not v.neighbors.empty():
		var n = v.neighbors.back()
		v.neighbors.pop_back()
		removeFromArray(n.neighbors, v)
	removeFromArray(vertices, v)
	
func removeFace(f, faces):
	removeFromArray(faces, f)
	if f.v1 !=null:
		removeFromArray(f.v1.faces, f)
	if f.v2 !=null:
		removeFromArray(f.v2.faces, f)
	if f.v3 !=null:
		removeFromArray(f.v3.faces, f)
	var vs = [f.v1, f.v2, f.v3]
	for i in range(3):
		var v1 = vs[i]
		var v2 = vs[(i+1)%3]
		if (v1==null or v2==null):
			continue
		v1.removeIfNonNeighbor(v2)
		v2.removeIfNonNeighbor(v1)

func collapse(vertices, faces, u, v):
	if (v==null):
		removeVertex(u, vertices)
		return 0
	var tmpVertices = []
	for i in range(u.neighbors.size()):
		tmpVertices.push_back(u.neighbors[i])
	for i in range(u.faces.size()-1, -1, -1):
		if u.faces[i].hasVertex(v):
			removeFace(u.faces[i], faces)
	for i in range(u.faces.size()-1, -1, -1):
		u.faces[i].replaceVertex(u, v)
	removeVertex(u, vertices)
	for i in range(tmpVertices.size()):
		computeEdgeCostAtVertex(tmpVertices[i])
	
func minimumCostEdge(vertices):
	var least = vertices.front()
	for vert in vertices:
		if vert.collapseCost<least.collapseCost:
			least = vert
	return least
	
func pushIfUnique(array, object):
	if not array.has(object):
		array.push_back(object)

func removeFromArray(array, object):
	var k = array.find(object)
	if k>-1:
		array.remove(k)

class Triangle:
	var a
	var b
	var c
	var v1
	var v2
	var v3
	var normal
	func _init(x, y, z, an, bn, cn):
		a = an
		b = bn
		c = cn
		v1 = x
		v2 = y
		v3 = z
		compute_normal()
		v1.faces.push_back(self)
		v1.addUniqueNeighbor(v2)
		v1.addUniqueNeighbor(v3)
		v2.faces.push_back(self)
		v2.addUniqueNeighbor(v1)
		v2.addUniqueNeighbor(v3)
		v3.faces.push_back(self)
		v3.addUniqueNeighbor(v1)
		v3.addUniqueNeighbor(v2)
	
	func removeFromArray(array, object):
		var k = array.find(object)
		if k>-1:
			array.remove(k)
	func compute_normal():
		var va = v1.position
		var vb = v2.position
		var vc = v3.position
		var cb = vc-vb
		var ab = va-vb
		normal = cb.cross(ab).normalized()
	func hasVertex(v):
		return v==v1 or v==v2 or v==v3
	func replaceVertex(oldv, newv):
		if oldv == v1:
			v1 = newv
		elif oldv == v2:
			v2 = newv
		elif oldv == v3:
			v3 = newv
		removeFromArray(oldv.faces, self)
		newv.faces.push_back(self)
		oldv.removeIfNonNeighbor(v1)
		v1.removeIfNonNeighbor(oldv)
		oldv.removeIfNonNeighbor(v2)
		v2.removeIfNonNeighbor(oldv)
		oldv.removeIfNonNeighbor(v3)
		v3.removeIfNonNeighbor(oldv)
		v1.addUniqueNeighbor(v2)
		v1.addUniqueNeighbor(v3)
		v2.addUniqueNeighbor(v1)
		v2.addUniqueNeighbor(v3)
		v3.addUniqueNeighbor(v1)
		v3.addUniqueNeighbor(v2)
class Vertex:
	var position
	var id
	var faces = []
	var neighbors = []
	var collapseCost = 0
	var collapseNeighbor
	var minCost
	var totalCost
	var costCount
	func pushIfUnique(array, object):
		if not array.has(object):
			array.push_back(object)
	func addUniqueNeighbor(vert):
		pushIfUnique(neighbors, vert)
	func removeIfNonNeighbor(n):
		var offset = neighbors.find(n)
		if offset == -1:
			return 0
		for face in faces:
			if face.hasVertex(n):
				return 0
		neighbors.remove(offset)
		return 1
	func _init(v, i):
		position = v
		id = i

func modify(geometry, ratio):
	var mdt = MeshDataTool.new()
	var st = SurfaceTool.new()
	st.set_material(geometry.surface_get_material(0))
	mdt.create_from_surface(geometry, 0)
	var vertices = []
#	vertices.resize(mdt.get_vertex_count())
	var faces = []
	
	var tempverts = []
	for i in range(mdt.get_vertex_count()):
		pushIfUnique(tempverts, mdt.get_vertex(i))
	for i in range(tempverts.size()):
		vertices.push_back(Vertex.new(tempverts[i], i))
	var mverts = []
	for i in range(mdt.get_vertex_count()):
		mverts.push_back(mdt.get_vertex(i))
	faces.resize(mdt.get_face_count())
	for i in range(mdt.get_face_count()):
		var a = tempverts.find(mverts[mdt.get_face_vertex(i, 0)])
		var b = tempverts.find(mverts[mdt.get_face_vertex(i, 1)])
		var c = tempverts.find(mverts[mdt.get_face_vertex(i, 2)])
		faces[i] = Triangle.new(vertices[a], vertices[b], vertices[c], a,b,c)
	for vert in vertices:
		computeEdgeCostAtVertex(vert)
	var permutation = []
	permutation.resize(vertices.size())
	var map = []
	map.resize(vertices.size())
	var z = int(vertices.size()*ratio)
	var nextVertex
	while z>0:
		z-=1
		nextVertex = minimumCostEdge(vertices)
		if nextVertex == null:
			print("out of vertices")
			break
		collapse(vertices, faces, nextVertex, nextVertex.collapseNeighbor)
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var stpos = []
	for vert in vertices:
		st.add_vertex(vert.position)
		stpos.append(vert)
	for face in faces:
		st.add_index(stpos.find(face.v1))
		st.add_index(stpos.find(face.v2))
		st.add_index(stpos.find(face.v3))
	st.generate_normals()
		
	return st.commit()
