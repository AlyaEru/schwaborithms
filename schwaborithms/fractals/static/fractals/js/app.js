const xmlns="http://www.w3.org/2000/svg"

$(document).ready(function() {
	
	svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	
	svg1.setAttribute("width", "800");
	svg1.setAttribute("height", "800");
	document.getElementById("svgobj").appendChild(svg1);
	
	
	treeParams = getTreeParamsInitial()
	
	for (let input of $('.treeinputs')) {
		$(input).after('<output>' + $(input).val() + '</output>')
		$(input).on('input', function() {
			$(this).next().html($(this).val())
		});
	}
	createTree(treeParams)
	
	$('.treeinputs').change(function() {
		treeParams = getTreeParamsFromInputs()
		createTree(treeParams)
	});
});

function getTreeParamsInitial() {
	var treeParams = JSON.parse(localStorage.getItem('tree'));
	if(treeParams) {
		setTreeParamInputs(treeParams)
		return treeParams
	}
	else return getTreeParamsFromInputs()
}

function setTreeParamInputs(treeParams) {
	$('#recursions_slider').val(treeParams.numRecursions)
	$('#angle_slider').val(treeParams.angleRange.begin * 180/Math.PI)
	$('#angle_end_slider').val(treeParams.angleRange.end * 180/Math.PI)
	$('#branches_slider').val(treeParams.numBranchesRange.begin)
	$('#branches_end_slider').val(treeParams.numBranchesRange.end)
	$('#length_slider').val(treeParams.lengthMultRange.begin)
	$('#length_end_slider').val(treeParams.lengthMultRange.end)
	$('#trunkrecursions_slider').val(treeParams.trunkParams.numRecursions)
	$('#displacement_slider').val(treeParams.trunkParams.displacementRange.begin)
	$('#displacement_end_slider').val(treeParams.trunkParams.displacementRange.end)
	$('#curvature_slider').val(treeParams.trunkParams.weight)
}

function getTreeParamsFromInputs() {
	var trunkParams = new TrunkParams({
		numRecursions: Number($('#trunkrecursions_slider').val()), 
		displacementRange: new Range(
			Number($('#displacement_slider').val()), 
			Number($('#displacement_end_slider').val())
		),
		directionAlternation: 'random',
		weight: Number($('#curvature_slider').val())
	})
	var treeParams = new TreeParams({
		numRecursions: Number($('#recursions_slider').val()), 
		numBranchesRange: new Range(
			Number($('#branches_slider').val()),
			Number($('#branches_end_slider').val())
		), 
		angleRange: new Range(
			$('#angle_slider').val() * Math.PI/180, 
			$('#angle_end_slider').val() * Math.PI/180
		),
		lengthMultRange: new Range(
			parseFloat($('#length_slider').val()),
			parseFloat($('#length_end_slider').val())
		),
		alternateBranchOffset: 0,
		horizontalWeightRange: new Range(0,0),
		verticalWeightRange: new Range(1,1),
		middleMultiplier: 1, 
		trunkParams: trunkParams
	})
	return treeParams
}

function createTree(treeParams) 
{
	var line = makeLine(new Coord(400,650),new Coord(400,520));
	d3.select("svg").selectAll("*").remove()
	
	localStorage.setItem('tree', JSON.stringify(treeParams));
	//console.log(JSON.stringify(treeParams))
	tree(line, treeParams)
}

function Coord(xc, yc)
{
	this.x = xc;
	this.y = yc;
}
function Range(p1, p2)
{
	this.begin = Math.min(p1, p2)
	this.end = Math.max(p1, p2)
}

function TrunkParams({numRecursions, displacementRange, directionAlternation, weight})
{
	this.numRecursions = numRecursions
	this.displacementRange = displacementRange
	this.directionAlternation = directionAlternation
	this.weight = weight
}
function TreeParams({numRecursions, numBranchesRange, angleRange, lengthMultRange, alternateBranchOffset, horizontalWeightRange, 
verticalWeightRange, middleMultiplier, trunkParams})
{
	this.numRecursions = numRecursions
	this.numBranchesRange = numBranchesRange
	this.angleRange = angleRange
	this.lengthMultRange = lengthMultRange
	this.alternateBranchOffset = alternateBranchOffset
	this.horizontalWeightRange = horizontalWeightRange
	this.verticalWeightRange = verticalWeightRange
	this.middleMultiplier = middleMultiplier
	this.trunkParams = trunkParams
}



function mandelbrot(line, trunkParams, iteration=0)
{
	if(iteration >= trunkParams.numRecursions)
	{
		return
	}
	var dif = Lineprops.subtractPoints(line);
	var midpoint = new Coord(Number(line.getAttribute('x1'))+dif.x/2,Number(line.getAttribute('y1'))+dif.y/2)
	scale = rdm(trunkParams.displacementRange)
	if(trunkParams.directionAlternation == 'alternating')
	{
		sign = ((iteration%2==1)?-1:1)
	}
	if(trunkParams.directionAlternation == 'none')
	{
		sign = 1
	}
	if(trunkParams.directionAlternation == 'random')
	{
		sign = (rdm(new Range(-1,1))>trunkParams.weight)?-1:1
		if (Number(line.getAttribute('x1')) < Number(line.getAttribute('x2'))) {
			sign = -sign
		}
	}
	var newpoint = new Coord(midpoint.x + -1*sign*dif.y*scale, midpoint.y + sign*dif.x*scale)
	var subline1 = makeLine(Lineprops.getStart(line),new Coord(newpoint.x,newpoint.y),line.getAttribute("style"))
	var subline2 = makeLine(new Coord(newpoint.x,newpoint.y),Lineprops.getEnd(line),line.getAttribute("style"))

	mandelbrot(subline1, trunkParams, iteration + 1)
	mandelbrot(subline2, trunkParams, iteration + 1)
	line.remove()
	
	
}
//start point for start line should be the bottom of the tree
function tree(line, treeParams, iteration=0, angle=0, branchWidth = 30, numSiblings = 2)
{
	
	var numBranches = intrdm(treeParams.numBranchesRange)
	var color = iteration < treeParams.numRecursions-1 ? "#99613D" : "#59A800";
	
	var lineSize = (branchWidth*(5/8 - (numSiblings-2)/8)) * (iteration == treeParams.numRecursions ? 24 : 1)//Number(Math.pow(Math.sqrt(numBranches),(11 - 2*numBranches - iteration))) //1.5 for 2 branches
	
	line.setAttribute('style',"stroke:"+color+";stroke-linecap:round;stroke-width:"+ lineSize)
	if(iteration < treeParams.numRecursions)
	{
		
		var offsetBranch = Math.floor(rdm(new Range(0, numBranches))) //make this an array, randomize
		for(var i = 0; i < numBranches; i++)
		{
		
			var divergeAngle = rdm(treeParams.angleRange)
			
			var limbLength = Lineprops.length(line) * rdm(treeParams.lengthMultRange)
			
			//make middle branch longer:
			/*if(numBranches == 3 && i == 1)
			{
				limbLength = limbLength * treeParams.middleMultiplier
			}*/
			
			var midAngleRange = (treeParams.angleRange.end - treeParams.angleRange.begin) / 2 + treeParams.angleRange.begin
			var branchOffset = (i*2/(numBranches - 1))*midAngleRange;
			var myAngle = angle + divergeAngle - branchOffset
			
			//add vertical weighting
			//is this actually any different from making the branching angle smaller?
			//var myAngle = myAngle * rdm(treeParams.verticalWeightRange)
			//Math.atan does interesting stuff to the angle
			var branchDirectionSign = Math.sin(myAngle) > 0 ? 1 : -1
			
			//find the difference between the branch angle and horizontal,
			//	multiply by horizontal weight,
			//	and add to the branch angle
			var horizontalWeight = rdm(treeParams.horizontalWeightRange)
			var newAngle = branchDirectionSign * Math.acos(Math.cos(myAngle))
			var dif = 0
			vertbranch=false
			if (Math.abs(newAngle) < Math.PI/4)
			{
				dif = -newAngle*horizontalWeight
				vertbranch=true
			}
			else dif = (branchDirectionSign * Math.PI/2 - newAngle)*horizontalWeight
			myAngle += dif
			
			if(vertbranch) limbLength *= treeParams.middleMultiplier
			
			//make the ends of branches veer upwards
			/*if (iteration > treeParams.numRecursions - 7)
			{
				var myAngle = myAngle * (treeParams.numRecursions - iteration + 8)/15
			}*/
			//figuring out the coordinates for the end of the branch
			
			var branchStart = new Coord(Number(Lineprops.getEnd(line).x),Number(Lineprops.getEnd(line).y))
			
			if(i == offsetBranch)
			{
				branchStart.x = Number(branchStart.x) - (Math.sin(angle) * (limbLength * treeParams.alternateBranchOffset))
				branchStart.y = Number(branchStart.y) + (Math.cos(angle) * (limbLength * treeParams.alternateBranchOffset))
			
			}
			var endpt = new Coord(Number(branchStart.x) + (Math.sin(myAngle) * limbLength), Number(branchStart.y) - (Math.cos(myAngle) * limbLength))
			var branch = makeLine(branchStart,endpt)
		
			tree(branch, treeParams, iteration + 1, myAngle,lineSize,numBranches)
		
		}
		
	}
	mandelbrot(line, treeParams.trunkParams)
}

function intrdm(range)
{
	return Math.floor(range.begin + Math.random()*(range.end - range.begin+1))
}
function rdm(range)
{
	return range.begin + Math.random()*(range.end-range.begin);
}
function makeLine(start,end,style='stroke:rgb(255,0,0);stroke-width:.6')
{
	var line = document.createElementNS(xmlns, 'line');
	line.setAttributeNS(null, 'x1',start.x)
	line.setAttributeNS(null, 'y1',start.y)
	line.setAttributeNS(null, 'x2',end.x)
	line.setAttributeNS(null, 'y2',end.y)
	line.setAttributeNS(null, 'style',style);
	svg1.appendChild(line)
	return line;
}
class Lineprops {
	static length(line)
	{
		var dif = Lineprops.subtractPoints(line)
		return Math.sqrt(dif.x * dif.x + dif.y * dif.y)
	}
	static getStart(line)
	{
		var s = new Coord(line.getAttribute('x1'),line.getAttribute('y1'))
		return s;
	}
	static getEnd(line)
	{
		var s = new Coord(line.getAttribute('x2'),line.getAttribute('y2'))
		return s;
	}
	static subtractPoints(line)
	{
		var dif = new Coord (
			line.getAttribute('x2')-line.getAttribute('x1'),
			line.getAttribute('y2')-line.getAttribute('y1')
		)
		return dif;
	}
	static getSlope(line)
	{
		var dif = Lineprops.subtractPoints(line)
		return dif.y/dif.x
	}
}
/*
How my code aught to be structured -
  geometrical computation, finding next point given line length and angle and starting point
  tree parameters computation - the computation of each one should be separated
	tree parameter data - in a class with computation?
	this should also include calculating non-input parameters like tree width
  tree algorithm - the function that gets line length and angle and stuff and gives it to geometrical computation
	should be able to be recursive or whatever
  doing the svg to make the tree; needs to be able to be called by tree algorithm
	must be in js
*/

/*
Considering 3-dimensional trees -
  Consider the tree as 3-dimensional until I have to draw it
  2 considerations -
	how to represent the branch as 3d
	  length, start point may remain the same (except start point will have another dimension)
	  branch angle now has 2 parts - vertical angle and horizontal angle
	  How to choose horizontal angle? when branching, choose 1 branch randomly,
		then make other branches be optimally spaced out, with some random variation?
	how to convert the 3d representation to 2d
	  compute the end point given both branching angles, then drop the extra dimension and display
  The recursive function should not pass the tree display object (2d, SVG object)
	but the 3d tree branch object.
  There should be another function that the recursive function calls which
	converts the 3d tree branch object into the display information, doing the angle math
*/

/*
Making branch offsets better:
  make all the branches be offset randomly along the range, except one which comes out from the top
  make the branch coming from the top be straightish (and possibly thickish), primary branch
  figure out why branch offset multiplier seems a little off
*/

//weighted branches - thicker and smaller divergence angle
	//implement downward weighting -- droopy trees!