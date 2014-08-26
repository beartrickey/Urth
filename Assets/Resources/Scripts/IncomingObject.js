#pragma strict

public static var baseSpeed : float = 5.0;
public static var startingDistance : float = 1500.0;
public static var slgd : SublayerGameDelegate = null;

public static var TYPE_ASTEROID : int = 0;
public static var TYPE_ALIEN : int = 1;
public static var TYPE_COLONIST : int = 2;
public static var TYPE_WEAPON : int = 3;

public var type : int = TYPE_ASTEROID;

public var incomingAngle : float = 0.0; // Radians. From what angle is it heading towards the planet?
public var angleOfAttachment : float = 0.0; // Radians. Where along perimeter of planet is this object attached?


public var velocity : Vector2 = Vector2.zero;

public var isActive : boolean = false;

public var stuckToPlanet : boolean = false;

public var sprite : tk2dSprite = null;


function onInstantiate()
{
	
	sprite = gameObject.GetComponent( tk2dSprite );
	slgd = SublayerGameDelegate.instance;
	gameObject.SetActive( false );

}



function onInit( _type : int )
{

	//activate
	isActive = true;
	gameObject.SetActive( true );

	gameObject.transform.parent = null;

	stuckToPlanet = false;


	//change texture based on type
	type = _type;
	if( type == TYPE_ASTEROID )
		sprite.SetSprite( 'circle' );
	else if( type == TYPE_COLONIST )
		sprite.SetSprite( 'rectangle' );
	else if( type == TYPE_ALIEN )
		sprite.SetSprite( 'triangle' );

	// Random incoming angle
	// incomingAngle = Random.Range( 0.0, 6.28 );
	var fanArc : float = 0.785;  // The wider the fanArc, the more difficult the game gets. (Objects start coming from the side of the screen)
	incomingAngle = Random.Range( -fanArc, fanArc );
	if( incomingAngle < 0.0 )
		incomingAngle += 6.28;


	// Reset graphic rotation
	gameObject.transform.eulerAngles.z = incomingAngle * Mathf.Rad2Deg;


	// Reset position
	var xcomp : float = -Mathf.Sin( incomingAngle );
	var ycomp : float = Mathf.Cos( incomingAngle );

	gameObject.transform.position = slgd.orbitCenter.transform.position + ( Vector3( xcomp, ycomp, 0.0 ) * startingDistance );


	// Velocity
	velocity = Vector2( xcomp, ycomp ) * baseSpeed * -1;
		
}



function deactivate()
{

	isActive = false;
	
	gameObject.SetActive( false );

}



function updateIncomingObject()
{

	// Move toward planet
	moveTowardPlanet();

}



function moveTowardPlanet()
{

	//skip if already stuck on planet
	if( stuckToPlanet == true )
		return;

	gameObject.transform.position += velocity;
	

	// Collision detection
	var distance : float = Vector2.Distance( slgd.planetCenter.transform.position, gameObject.transform.position );
	
	if( distance < slgd.planet.radius )
	{
		slgd.incomingObjectHitPlanet( this );
	}

}



///////////////////////////////////////EVENTS


function hitPlanet()
{

	

}



function setAngleOfAttachment() : float
{

	var planetAngle : float = slgd.planetCenter.transform.eulerAngles.z * Mathf.Deg2Rad;

	angleOfAttachment = incomingAngle - planetAngle;


	//wrap angle
	if( angleOfAttachment < 0.0 )
		angleOfAttachment += 6.28;

}



function stickToPlanet()
{

	// Stick to planet
	gameObject.transform.parent = slgd.planetCenter.transform;
	stuckToPlanet = true;
	
}



function repositionOnPlanet()
{

	var xcomp : float = -Mathf.Sin( angleOfAttachment );
	var ycomp : float = Mathf.Cos( angleOfAttachment );

	gameObject.transform.localPosition = Vector3( xcomp, ycomp, 0.0 ) * slgd.planet.radius;

}






