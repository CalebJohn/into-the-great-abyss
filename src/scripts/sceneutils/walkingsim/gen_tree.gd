##experiment with
##collapse deformation

##vertex offset
	##by noise
	##random
	##extrude along normal
	##look into blender material for values
		##color
		##specular etc.
extends MeshInstance

var gen = preload("res://mesh_gen.gd").new()



func _ready():
	var material = FixedMaterial.new()
	material.set_parameter(FixedMaterial.PARAM_DIFFUSE, Color(0.4, 0.6+randf()*0.4, 0.4))
	material.set_light_shader(FixedMaterial.LIGHT_SHADER_TOON)
	
	var trunk_material = FixedMaterial.new()
	trunk_material.set_parameter(FixedMaterial.PARAM_DIFFUSE, Color(0.5, 0.2, 0.2))
	trunk_material.set_light_shader(FixedMaterial.LIGHT_SHADER_TOON)
	var mesh = Mesh.new()
	var crown = gen.make_icosphere(material, Vector3(1, 2, 1), 1)
	var trunk = gen.make_trunk(trunk_material, Vector3(0.2, 2, 0.2), 7)
	crown = gen.collapse(crown, 0.5)
	var mdt = MeshDataTool.new()
	mdt.create_from_surface(crown, 0)
	#taper the crown and lift into air
	for i in range(mdt.get_vertex_count()):
		var v = mdt.get_vertex(i)
		var r = -(v.y*0.25+0.5)
		v = Vector3(v.x+v.x*r, v.y+4, v.z+v.z*r)
		mdt.set_vertex(i, v)
	mdt.commit_to_surface(mesh)
	
	var tmdt = MeshDataTool.new()
	tmdt.create_from_surface(trunk, 0)
	for i in range(tmdt.get_vertex_count()):
		tmdt.set_vertex(i, tmdt.get_vertex(i)+Vector3(0.0, 2, 0.0))
	tmdt.commit_to_surface(mesh)
	set_mesh(mesh)

