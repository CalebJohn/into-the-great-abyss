
extends LineEdit

#just need this to set the default placeholder value
#this value will be used if no new one is specified
#will eventually read from save file
func _ready():
	set_placeholder(str(global.genSeed))



