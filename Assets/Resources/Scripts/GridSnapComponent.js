#pragma strict


//static vars
public static var gridCenterX : float = 0.0f;
public static var gridCenterY : float = 160.0f;
    
    
public static var numGridCols : int = 15;

public static var paddingSize : float = 64.0f;

public static var screenWidth : float = 640.0f;

public static var gridWidth : float = screenWidth - ( paddingSize * 2.0 );

public static var blockSize : float = gridWidth / numGridCols;


//instance vars
public var col : int = 0;
public var row : int = 0;




function Start ()
{
	
}




static function resetGridDimensionsForNewGridCols( _numGridCols : int )
{

	numGridCols = _numGridCols;

    gridWidth = screenWidth - ( paddingSize * 2.0 );

	blockSize = gridWidth / numGridCols;

}



static function getPositionFromGridCoords( _col : int, _row : int ) : Vector2
{

	var startX : float = gridCenterX - ( gridWidth * 0.5 );
    var startY : float = gridCenterY - ( gridWidth * 0.5 );
    
    var xpos : float = startX + ( blockSize * 0.5 ) + ( _col * blockSize );
    var ypos : float = startY +  ( blockSize * 0.5 ) + ( _row * blockSize );

	return Vector2( xpos, ypos );

}




function snapToPoint()
{

	var newPos : Vector3 = getPositionFromGridCoords( col, row );
    
    newPos.z = gameObject.transform.localPosition.z;
    
    gameObject.transform.position = newPos;
    
}