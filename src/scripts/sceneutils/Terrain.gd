
extends Spatial

var roughness = 0.5
var groundMat

var noise = load("res://src/scripts/sceneutils/noise.gd").new()

func height(pos):
	return -5.0+5.0*pow(noise.fbmsimplex(pos),3)+5.0*noise.cliffNoise(pos*0.05)

func _ready():
	groundMat = SpatialMaterial.new()
	groundMat.albedo_color = Color(65/255.0, 120/255.0, 52/255.0)
	#groundMat.params_diffuse_mode = SpatialMaterial.DIFFUSE_TOON

	set_process(false)
	#var width = 15
	#var length = 15
	#for i in range(-5, 5):
		#for j in range(-10, 0):
			#var res = 10.0
			#add_plane(i*width, j*length, width, length, res)
	add_plane(-100, -200, 200, 200, 100)

func crand(pos, m):
	var offset = Vector2()
	offset.x = (float(p[(int(pos.y)+p[int(pos.x)%256])%256])/256.0)*1.0-0.5
	offset.y = (float(p[(int(pos.x)+p[int(pos.y)%256])%256])/256.0)*1.0-0.5
	return pos+offset*m*Vector2(roughness, roughness)

func add_plane(x, z, w, l, res):
	var st = SurfaceTool.new()
	st.set_material(groundMat)
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var wr = w/res
	var lr = l/res
	var num = 0

	for i in range(res+1):
		for j in range(res+1):
			var pos = crand(Vector2(i*wr+x, j*lr+z), wr)
			var h = height(pos)
			h += (float(p[(int(pos.x*2.0)+p[int(pos.y*4)%256])%256])/256.0)*roughness
			st.add_vertex(Vector3(pos.x-x, h, pos.y-z))
			num+=1
			if i>0 && j>0:
				var base = num-1
				var i0 = base
				var i1 = base-1
				var i2 = base-res-1
				var i3 = base-res-2
				st.add_index(i0)
				st.add_index(i2)
				st.add_index(i1)
				st.add_index(i2)
				st.add_index(i3)
				st.add_index(i1)
	st.generate_normals()
	var mesh = st.commit()
	var chunk = MeshInstance.new()
	chunk.set_mesh(st.commit())
	chunk.set_translation(Vector3(x, 0, z))
	chunk.material_override = groundMat
	add_child(chunk)
	
	
var p = [151,160,137,91,90,15,
   131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
   190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
   88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
   77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
   102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
   135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
   5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
   223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
   129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
   251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
   49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
   138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]



