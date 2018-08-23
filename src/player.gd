extends Node

var resourceStock = {}
var gatherers = {}
var processors = {}
var productionEfficiency = 2

func _ready():
	for key in resources.types:
		resourceStock[key] = 0
		gatherers[key] = 1
		processors[key] = 1