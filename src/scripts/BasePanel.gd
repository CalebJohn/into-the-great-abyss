extends Control

signal switch_scene

var timer_button = load("res://src/scenes/TimerButton.tscn")

func _ready():
	#First add buttons to gather the resource manually
	#TODO Time to gather should be based off properties
	for key in resources.types:
		var new_button = timer_button.instance()
		new_button.name = key
		new_button.text = "Gather " + key
		new_button.time = 10.0
		new_button.connect("finished", self, "resource_gather", [key])
		$Production/GatherButtons.add_child(new_button)
	#Then buttons to process each material
	#TODO time to process should be based off properties
	for key in resources.types:
		var new_button = timer_button.instance()
		new_button.name = key
		new_button.text = "Process " + key
		new_button.time = 4.0
		new_button.connect("started", self, "resource_process_start", [key])
		new_button.connect("finished", self, "resource_process", [key])
		$Production/ProcessButtons.add_child(new_button)
	#Labels to display the stock of each resource
	for key in player.resourceStock:
		var new_label = Label.new()
		new_label.name = key
		new_label.text = key + ": " + str(player.resourceStock[key])
		$ResourceStock.add_child(new_label)

func update_resource(key):
	$ResourceStock.get_node(key).text = key + ": " + str(player.resourceStock[key])
	
func _on_Button_pressed():
	emit_signal("switch_scene")


func _on_Scene_pressed():
	if get_node("SceneView").is_visible():
		get_node("Scene").set_text("Generate Scene")
	else:
		get_node("Scene").set_text("Hide Scene")

func resource_gather(key):
	#Gathers a single unit of resource
	player.resourceStock[key] += player.gatherers[key]
	update_resource(key)
	
func resource_process_start(key):
	#remove require materials for processing
	#Each processor uses 1 material and produces player.productionEfficiency amount
	if player.resourceStock[key] >= player.processors[key]:
		player.resourceStock[key] -= player.processors[key]
		update_resource(key)
	else:
		$Production/ProcessButtons.get_node(key).tween.stop_all()
		$Production/ProcessButtons.get_node(key).reset_loading_bar(false, null, false)
	
	
func resource_process(key):
	#processing just using a material to increase the amount
	#you already have
	player.resourceStock[key] += player.productionEfficiency * player.processors[key]
	update_resource(key)
	
func disable_buttons(node):
	for child in node.get_children():
		for c in child.get_children():
			c.disable_button(true)
			
func enable_buttons(node):
	for child in node.get_children():
		for c in child.get_children():
			c.disable_button(false)

func _on_ProductionButton_pressed():
	$Building.hide()
	disable_buttons($Building)
	$Production.show()
	enable_buttons($Production)
	

func _on_BuildingButton_pressed():
	$Building.show()
	enable_buttons($Building)
	$Production.hide()
	disable_buttons($Production)

