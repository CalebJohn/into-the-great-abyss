
extends Control

#adds a message and updates the button text to notify player
func pass_message(message):
	$Messages.add_text(message)
	$Messages.newline()
	$Messages.newline()
	if not $Messages.visible:
		$Switch.text = "NEW MESSAGE"

func _ready():
	pass_message("Your ship has crashed, you are all alone on an unexplored planet. Good luck")
	#always show the newest message
	$Messages.set_scroll_follow(true)

func _on_Switch_pressed():
	$Switch.text = "MESSAGES"
	#toggle the visibility of the messages
	$Messages.visible = $Messages.visible == false

