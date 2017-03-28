
extends Control

#adds a message and updates the button text to notify player
func pass_message(message):
	get_node("Messages").add_text(message)
	get_node("Messages").newline()
	get_node("Messages").newline()
	if get_node("Messages").is_hidden():
		get_node("Switch").set_text("NEW MESSAGE")

func _ready():
	#always show the newest message
	get_node("Messages").set_scroll_follow(true)

func _on_Switch_pressed():
	var c = get_node("Messages")
	get_node("Switch").set_text("MESSAGES")
	#toggle the visibility of the messages
	if c.is_hidden():
		c.show()
	else:
		c.hide()
