extends Node2D

var numWidth = 6.0
var numHeight = 6.0

#Draws one quad for each region
#the corners roughly line up with the map buttons
func _draw():
	for y in range(numWidth):
		for x in range(numHeight):
			var points = PoolVector2Array()
			var colors = PoolColorArray()
			var p1 = Vector2(x / numWidth, y / numHeight)
			var p2 = Vector2((x + 1) / numWidth, y / numHeight)
			var p3 = Vector2((x + 1) / numWidth, (y + 1) / numHeight)
			var p4 = Vector2(x / numWidth, (y + 1) / numHeight)
			points.append(p1)
			points.append(p2)
			points.append(p3)
			points.append(p4)
			colors.append(get_color(p1))
			colors.append(get_color(p2))
			colors.append(get_color(p3))
			colors.append(get_color(p4))
			draw_polygon(points, colors)

func _ready():
	pass
	
func get_color(pos):
	#If on an edge, copy color from inside
	if pos.x == 0:
		pos.x += 1/numWidth
		
	if pos.y == 0:
		pos.y += 1/numHeight
		
	if pos.x == 1:
		pos.x -= 1/numWidth
		
	if pos.y == 1:
		pos.y -= 1/numHeight
	
	#set seed based on position 
	#TODO add global seed into the mix
	seed((str(pos.x)+str(pos.y)).hash())
	randf()
	return Color(randf(), randf(), randf())
