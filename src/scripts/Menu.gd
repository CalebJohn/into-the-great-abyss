
extends Control

#whether or not the sun follows the mouse
var followMouse = false
#how fast the sun catches up to the mouse
var followFactor = 30
var sunPos = Vector2(0, 600)
var background
#How long the sunrise takes
var riseTime = 2
#how long the the sunset takes
var setTime = 3

func _start(object, method):
	get_tree().change_scene("res://src/scenes/Level.tscn")

func _fixed_process(delta):
	# This is the mouse tracking code for the sun, it won't be called
	# during sunrise or sunset
	if followMouse:
		var mouse = get_viewport().get_mouse_pos()
		# This is the amount to move the sun towards the mouse cursor
		# because of the follow factor the movement of the sun towards
		# the cursor will slow down as it approaches, the larger the factor
		# the slower the sun will approach the cursor
		var delta = (mouse.y - sunPos.y) / followFactor;

		# Only move the sun if the change would be more than 1 pixel
		# this makes the sun settle into position more smoothly but it
		# means that the sun can only settle within followFactor pixels
		# of the mouse cursor
		if abs(delta) > 1:
			sunPos.y += delta;
			background.update_sun(sunPos)

#called after sun is tweened
func _free_mouse(object, method):
	followMouse = true
	sunPos = Vector2(global.size.x*0.5, 0)

func _ready():
	#a reference is kept to background so we dont have to make background a child
	background = get_parent().get_node("Background")
	#connect buttons callbacks here
	
	set_fixed_process(true)
	
	#make tween to move sun around
	var sunTween = Tween.new()
	add_child(sunTween)
	sunTween.interpolate_method(background, "update_sun", Vector2(global.size.x*0.5, global.size.y), Vector2(global.size.x*0.5, -50), riseTime, Tween.TRANS_LINEAR, Tween.EASE_IN)
	sunTween.start()
	#set callback for when tween completes
	#must be done through script because tween is made in script
	#if tween is made in editor then we could fire this signal
	sunTween.connect("tween_complete", self, "_free_mouse")
	
	#add tween to fade text
	#starts a second after the sun fades in
	set_opacity(0.0)
	var textTween = Tween.new()
	add_child(textTween)
	textTween.interpolate_property(self, "visibility/opacity", 0.0, 1.0, riseTime, Tween.TRANS_QUAD, Tween.EASE_IN_OUT, riseTime)
	textTween.start()

##Callbacks registered with connect button in editor
func _on_StartButton_pressed():
	followMouse = false
	#Tween to move sun down
	#Calls _start when finished
	var sunTween = Tween.new()
	add_child(sunTween)
	sunTween.interpolate_method(background, "update_sun", sunPos, Vector2(global.size.x*0.5, global.size.y+50), setTime, Tween.TRANS_QUART, Tween.EASE_OUT)
	sunTween.connect("tween_complete", self, "_start")
	sunTween.start()
	
	#fades the scene to black during transition
	var screenTween = Tween.new()
	add_child(screenTween)
	screenTween.interpolate_method(get_parent().get_node("Fader"), "set_color", Color(1, 1, 1, 1), Color(0, 0, 0, 1), setTime, Tween.TRANS_QUAD, Tween.EASE_IN_OUT)
	screenTween.start()
	
	#Fades text away as scene changes
	var textTween = Tween.new()
	add_child(textTween)
	textTween.interpolate_property(self, "visibility/opacity", 1.0, 0.0, 1, Tween.TRANS_QUAD, Tween.EASE_IN_OUT)
	textTween.start()

#switches from default menu to options
#utilizes groups, therefore all buttons must be in the proper group
func _on_OptionsButton_pressed():
	var nodes = get_tree().get_nodes_in_group("startMenu")
	for node in nodes:
		node.hide()
	nodes = get_tree().get_nodes_in_group("optionsMenu")
	for node in nodes:
		node.show()


func _on_QuitButton_pressed():
	get_tree().quit()


func _on_FullscreenButton_pressed():
	if global.fullscreen:
		OS.set_window_fullscreen(false)
		global.fullscreen = false
		global.size = Vector2(Globals.get("display/width"), Globals.get("display/height"))
		
	else:
		OS.set_window_fullscreen(true)
		global.fullscreen = true
		global.size = OS.get_screen_size()
	background.update_resolution()


func _on_MuteButton_pressed():
	if global.mute:
		get_node("MuteButton").set_text("MUTE: OFF")
		global.mute = false
	else:
		get_node("MuteButton").set_text("MUTE: ON")
		global.mute = true


func _on_Value_text_changed( text ):
	global.genSeed = int(text)
	#This needs to regenerate world


func _on_ReturnButton_pressed():
	var nodes = get_tree().get_nodes_in_group("startMenu")
	for node in nodes:
		node.show()
	nodes = get_tree().get_nodes_in_group("optionsMenu")
	for node in nodes:
		node.hide()
