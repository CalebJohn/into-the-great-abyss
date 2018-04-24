
extends Node

#this may not be necessary but I think it will be nice
  #it will allow us to pass certain generator variables between scenes
  #and then we can split up and partition scenes a lot more heavily
  #e.g menu, level, base, HUD, generator as seperate scenes

#a word on Godot structure
  #any reusable entity made of multiple nodes should be treated as a scene independant of others
  #and then instanced where you want to use them as a singular node
  #we should likely accept this style and try to leverage it as best we can

#this can also be used to run code before any other scene is opened up

#seed for random numbers
#will need to play a role in gpu generation code as well
var genSeed
var fullscreen = false
var mute = false
var size
var basePosition = Vector2(0.0, 0.0)
var baseSize = Vector2(100.0, 100.0)

func _ready():
	#sets the initial seed to random value
	#TODO read initial value from save file
	#  only generate a random sead on first startup
	randomize()
	genSeed = randi()
	#set the size variable to default values defined in project settings
	size = Vector2(ProjectSettings.get_setting("display/window/size/width"), ProjectSettings.get_setting("display/window/size/height"))

