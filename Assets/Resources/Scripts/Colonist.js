#pragma strict


static var smoothnessLevel : int = 12;
static var thickness : float = 20.0;
static var unitArcWidth : float = 0.5;

var level : int = 1;

var arcWidth : float = 0.0;

public var mesh : Mesh;

public var isActive : boolean = false;

public var incomingObjectComponent : IncomingObject = null;



function onInstantiate()
{

	mesh = gameObject.GetComponent( MeshFilter ).mesh;

}



function onInit()
{

	gameObject.SetActive( true );
	
	isActive = true;

	level = 0;

}



function onUninit()
{

	gameObject.transform.localPosition = Vector3( 0.0, 0.0, -10.0 );

	gameObject.transform.position = Vector3( 0.0, 0.0, -10.0 );
	
	gameObject.transform.localEulerAngles.z = 0.0;
	
	gameObject.transform.eulerAngles.z = 0.0;

	isActive = false;
	
	gameObject.SetActive( false );

}



function arrangeVerts()
{
	
	//make new vert and tri arrays
	var numVerts : int = smoothnessLevel * 4;
	var numTris : int = numVerts + (smoothnessLevel * 2);
	
	var newVertices = new Vector3[numVerts]; //mesh.vertices;
	var newTriangles = new int[numTris]; //mesh.triangles;


	//set vertex positions
	var minRadius : float = SublayerGameDelegate.instance.planet.radius;
	var maxRadius : float = minRadius + thickness; //outside radius of block

	arcWidth = unitArcWidth * level;
	
	// var blockLeftBound : float = incomingObjectComponent.angleOfAttachment - ( arcWidth * 0.5 );
	// var blockRightBound : float = incomingObjectComponent.angleOfAttachment + ( arcWidth * 0.5 );

	var blockLeftBound : float = arcWidth * -0.5;
	var blockRightBound : float = arcWidth * 0.5;
	
	
	//add a quad for each subdivision (smoothness level) in the block
	var subdivisionWidth : float = arcWidth / smoothnessLevel;
	
	for( var s : int = 0; s < smoothnessLevel; s++ )
	{
	
		var subdivisionLeftBound : float = blockLeftBound + (subdivisionWidth * s);
		var subdivisionRightBound : float = subdivisionLeftBound + subdivisionWidth;
	
		var startingVertIndex : int = s * 4;
	
		//bottom left vert
		// var xPos : float = Mathf.Cos( subdivisionLeftBound ) * minRadius;
		// var yPos : float = Mathf.Sin( subdivisionLeftBound ) * minRadius;
		var xPos : float = -Mathf.Sin( subdivisionLeftBound ) * minRadius;
		var yPos : float = Mathf.Cos( subdivisionLeftBound ) * minRadius;

		newVertices[startingVertIndex] = Vector3( xPos, yPos, -10.0 );
		
		
		//top left vert
		// xPos = Mathf.Cos( subdivisionLeftBound ) * maxRadius;
		// yPos = Mathf.Sin( subdivisionLeftBound ) * maxRadius;
		xPos = -Mathf.Sin( subdivisionLeftBound ) * maxRadius;
		yPos = Mathf.Cos( subdivisionLeftBound ) * maxRadius;
		newVertices[startingVertIndex + 1] = Vector3( xPos, yPos, -10.0 );
		
		
		//top right vert
		// xPos = Mathf.Cos( subdivisionRightBound ) * maxRadius;
		// yPos = Mathf.Sin( subdivisionRightBound ) * maxRadius;
		xPos = -Mathf.Sin( subdivisionRightBound ) * maxRadius;
		yPos = Mathf.Cos( subdivisionRightBound ) * maxRadius;
		newVertices[startingVertIndex + 2] = Vector3( xPos, yPos, -10.0 );
		
		
		//bottom right vert
		// xPos = Mathf.Cos( subdivisionRightBound ) * minRadius;
		// yPos = Mathf.Sin( subdivisionRightBound ) * minRadius;
		xPos = -Mathf.Sin( subdivisionRightBound ) * minRadius;
		yPos = Mathf.Cos( subdivisionRightBound ) * minRadius;
		newVertices[startingVertIndex + 3] = Vector3( xPos, yPos, -10.0 );
		
		
		//set triangles
		var startingTriIndex : int = s * 6;
		
		newTriangles[startingTriIndex + 0] = startingVertIndex + 0;
		newTriangles[startingTriIndex + 1] = startingVertIndex + 1;
		newTriangles[startingTriIndex + 2] = startingVertIndex + 2;
		newTriangles[startingTriIndex + 3] = startingVertIndex + 2;
		newTriangles[startingTriIndex + 4] = startingVertIndex + 3;
		newTriangles[startingTriIndex + 5] = startingVertIndex + 0;
		
	}	
	
	
	//clear mesh
	mesh.Clear();
	
	
	//set verts
	mesh.vertices = newVertices;
	mesh.triangles = newTriangles;


	// Color
	var color : Color = Color.gray;
	gameObject.renderer.material.SetColor( "_Color", color );
	gameObject.renderer.material.SetColor( "_SpecColor", color );
	gameObject.renderer.material.SetColor( "_Emission", color );

}



function updateBlock()
{

}



