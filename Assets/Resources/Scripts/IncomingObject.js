#pragma strict

public static var baseSpeed : float = 1.0;
public static var startingDistance : float = 1000.0;
public static var slgd : SublayerGameDelegate = null;

public var incomingAngle : float = 0.0; // Radians. From what angle is it heading towards the planet?
public var angleOfAttachment : float = 0.0; // Radians. Where along perimeter of planet is this object attached?


public var velocity : Vector2 = Vector2.zero;

public var isActive : boolean = false;

public var stuckToPlanet : boolean = false;


function onInstantiate()
{
	
	slgd = SublayerGameDelegate.instance;
	gameObject.SetActive( false );

}



function onInit()
{

	//activate
	isActive = true;
	gameObject.SetActive( true );

	gameObject.transform.parent = null;

	stuckToPlanet = false;


	// Random incoming angle
	incomingAngle = Random.Range( 0.0, 6.28 );


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

	// Stick to planet
	gameObject.transform.parent = slgd.planetCenter.transform;
	stuckToPlanet = true;


	// Figure out angle of attachment
	var planetAngle : float = slgd.planetCenter.transform.eulerAngles.z * Mathf.Deg2Rad;
	Debug.Log( 'planetAngle: ' + planetAngle );

	angleOfAttachment = incomingAngle - planetAngle;


	//wrap angle
	if( angleOfAttachment < 0.0 )
		angleOfAttachment += 6.28;

	Debug.Log( 'angleOfAttachment: ' + angleOfAttachment );

}



function repositionOnPlanet()
{

	var xcomp : float = -Mathf.Sin( angleOfAttachment );
	var ycomp : float = Mathf.Cos( angleOfAttachment );

	gameObject.transform.localPosition = Vector3( xcomp, ycomp, 0.0 ) * slgd.planet.radius;

}






