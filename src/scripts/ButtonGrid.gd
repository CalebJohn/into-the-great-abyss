#Needs a lot of custom functions to manage insantiating buttons
#and to manage button sizes and whatnot
extends GridContainer

#will be emitted when a child button is pressed
signal child_pressed
#loads up the button scene to be instanced in the map
var buttonPrototype = load("res://src/scenes/MapButton.tscn")
var numWidth = 5
var numHeight = 5
var buttonSize;

#called from child when it is presed
#so far all this does is signal the generator to update the cloud mask
func _child_press(pos):
	var screenPos = Vector2(100, 100)+pos*buttonSize+buttonSize*0.5
	get_parent().get_node("Generator").apply_mask(screenPos)

func _ready():
	set_columns(numWidth)
	#set up button properties
	var button = buttonPrototype.instance()
	buttonSize = get_size()/Vector2(numWidth, numHeight)
	button.set_size(buttonSize)
	button.get_material().set_shader_param("cTexture", get_parent().get_node("Generator").cloudTexture)
	#Godot adds buttons depth first
	for i in range(numHeight):
		for j in range(numWidth):
			var newButton = button.duplicate(true)
			#meta is a string based property that can be assigned to any object
			#in our case we will use it to store the position in map coordinates
			newButton.position =  Vector2(j, i)
			add_child(newButton)
	connect("child_pressed", self, "_child_press")


