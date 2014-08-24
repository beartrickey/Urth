#pragma strict


public var mesh : Mesh;

public static var instance : ResultWave;

public var slgd : SublayerGameDelegate;



function Start ()
{

	instance = this;

	mesh = gameObject.GetComponent( MeshFilter ).mesh;
	
	slgd = SublayerGameDelegate.instance;

}


/*
function drawResultWave( _drone : Drone )
{
	
	//clear mesh
	mesh.Clear();
	
	
	//add extra face
	var newVertices = new Vector3[2000];
	var newTriangles = new int[6000];
	var newNormals = new Vector3[2000];


	//set vertex positions
	for( var i = 0; i < 1000; i++ )
	{
		
		var startingY : float = 0.0;//slgd.oscilloscopeCenter.position.y;
		
		var yDif : float = _drone.waveDifList[i];
		var e : Vector3 = _drone.enemyWaveData.wavePoints[i];
		
		var topVert : Vector3 = Vector3( e.x, yDif + startingY, 0.0 );
		var bottomVert : Vector3 = Vector3( e.x, startingY, 0.0 );
		
		var topVertIndex : int = i * 2;
		var bottomVertIndex : int = topVertIndex + 1;
		
		newVertices[topVertIndex] = topVert;
		newVertices[bottomVertIndex] = bottomVert;
	
	}
	

	//set triangles
	var numTriangleIndices : int = 0;
	for( var t : int = 0; t < 1998; t++ )
	{
	
		var v1 : int;
		var v2 : int;
		var v3 : int;
	
		if( t % 2 == 0 )
		{
			v1 = t;
			v2 = t + 2;
			v3 = t + 1;
		}
		else
		{
			v1 = t + 1;
			v2 = t + 2;
			v3 = t;
		}
		
		newTriangles[numTriangleIndices] = v1;
		newTriangles[numTriangleIndices + 1] = v2;
		newTriangles[numTriangleIndices + 2] = v3;
		
		numTriangleIndices += 3;
	}
	
		
	//set normals
	for( i = 0; i < 2000; i++ )
	{
		newNormals[i] = Vector3( 0.0, 0.0, -1.0 );
	}
	
	
	mesh.vertices = newVertices;
	mesh.normals = newNormals;
	mesh.triangles = newTriangles;

}

*/
