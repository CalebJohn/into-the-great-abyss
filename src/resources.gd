extends Node

# For now this is initialized with magic values, 
# In the future these resource types will be procedural
var types = {
	Metal = ResourceType.new(0.7, 0.7, 0.5),
	Biological = ResourceType.new(0.4, 0.3, 0.01),
	Mineral = ResourceType.new(0.9, 0.8, 0.9),
	Liquid = ResourceType.new(0.1, 0.5, 0.3)
}

func _ready():
	pass

# We store the properties of the material in here
class ResourceType:
	var hardness #How hard the material is
	var energy #How much energy can be extracted from the material
	var activation #How easy it is to extract energy from material
	func _init(h, e, a):
		hardness = h
		energy = e
		activation = a