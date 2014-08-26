#pragma strict

//z-indices
public static var LAYER_BG_COLOR : float = 0.0;


//singleton ref
public static var instance : SublayerGameDelegate = null;


//other objects
public var gm : GameManager;
public var sl : Sublayer;


//stage flow vars
public var state : int = 0;


//incoming objects
public var incomingObjectPrefab : GameObject;
public var numIncomingObjects : int = 64;
public var incomingObjectList = new IncomingObject[numIncomingObjects];


//planet
public var planet : Planet;
public var planetCenter : GameObject;
public var orbitCenter : GameObject;


//controls
public var orbitControlStrip : ButtonScript;

public var orbitRotation : float = 0.0;
public var orbitColumn : float = 0.0;

public var dropButton : ButtonScript;
public var planetDragging : boolean = false;
public var orbitDragging : boolean = false;



function onInstantiate()
{

	//set singleton reference
	instance = this;
	
	
	//set game manager instance
	gm = GameManager.instance;
	

	//set GameManager.sublayerGameComponent
	sl = gameObject.GetComponent( Sublayer );
	
	gm.sublayerGame = sl;
	

	//set updateDelegate
	sl.updateDelegate = updateSublayerGame;
	
	planet.onInstantiate();
	
	makeNewStage();


	// Make incoming object pool
	for( var i : int = 0; i < numIncomingObjects; i++ )
	{

		var incomingObjectGameObject : GameObject = GameObject.Instantiate( incomingObjectPrefab, Vector3.zero, incomingObjectPrefab.transform.rotation );

		incomingObjectList[i] = incomingObjectGameObject.GetComponent( IncomingObject );

		incomingObjectList[i].onInstantiate();

	}
	
	
	
	//buttons
	sl.addButton( orbitControlStrip );
	orbitControlStrip.onTouchDownInsideDelegate = orbitControlStripPressed;
	
}



function makeNewStage()
{

	//reset pivot points	
	planetCenter.transform.localEulerAngles.z = 0.0;
	planetCenter.transform.eulerAngles.z = 0.0;
	
	orbitCenter.transform.localEulerAngles.z = 0.0;
	orbitCenter.transform.eulerAngles.z = 0.0;
	
	
	planet.onInit();

}



//////////////////////////////////////////////////GAME FLOW and TRANSITIONS



function startGame()
{

	var io : IncomingObject = getFreeIncomingObject();

	io.onInit( IncomingObject.TYPE_ASTEROID );
    
}



/////////////////////////////////////INCOMING OBJECTS



function makeRandomIncomingObject() : IncomingObject
{

	var io : IncomingObject = getFreeIncomingObject();


	// Randomly choose type
	var randType : int = Random.Range( 0, 3 );

	io.onInit( randType );

	return io;

}



function updateIncomingObjects()
{

	for( var i : int = 0; i < numIncomingObjects; i++ )
	{
		if( incomingObjectList[i].isActive == true )
			incomingObjectList[i].updateIncomingObject();
   	}

}



function getFreeIncomingObject() : IncomingObject
{

	for( var i : int = 0; i < numIncomingObjects; i++ )
	{
		if( incomingObjectList[i].isActive == false )
			return incomingObjectList[i];
   	}

   	return null;

}



function repositionObjectsOnPlanet()
{

	for( var i : int = 0; i < numIncomingObjects; i++ )
	{

		if( incomingObjectList[i].isActive == false )
			continue;

		if( incomingObjectList[i].stuckToPlanet == true )
			incomingObjectList[i].repositionOnPlanet();

   	}

}



function incomingObjectCollisionCheck( incomingObject : IncomingObject )
{

	for( var i : int = 0; i < numIncomingObjects; i++ )
	{

		var planetSideObject : IncomingObject = incomingObjectList[i];


		// Skip inactive objects
		if( planetSideObject.isActive == false )
			continue;


		// Skip non-stuck objects
		if( planetSideObject.stuckToPlanet == false )
			continue;

		var dif : float = planetSideObject.angleOfAttachment - incomingObject.angleOfAttachment;


		// Is it closer clockwise or counter-clockwise?
		if( dif < -3.14 )
		{
			dif += 6.28;
		}
		else if( dif > 3.14 )
		{
			dif -= 6.28;
		}


		// Were they close enough for a collision?
		// TODO: dif needs to change dynamically with the increased surface area of the planet
		var threshold : float = 0.5;  // This needs to be in actual planetSide distance units instead of radians
		if( Mathf.Abs( dif ) < threshold )
		{

			handleCollision( incomingObject, planetSideObject );

		}

   	}

}



function handleCollision( incomingObject : IncomingObject, planetSideObject : IncomingObject )
{

	switch( incomingObject.type )
	{

		case IncomingObject.TYPE_ASTEROID:
			handleAsteroidCollision( incomingObject, planetSideObject );
			break;

		case IncomingObject.TYPE_COLONIST:
			handleColonistCollision( incomingObject, planetSideObject );
			break;

		case IncomingObject.TYPE_ALIEN:
			handleAlienCollision( incomingObject, planetSideObject );
			break;

		default:
			break;

	}

}



function handleAsteroidCollision( incomingObject : IncomingObject, planetSideObject : IncomingObject )
{

	incomingObject.deactivate();

	planetSideObject.deactivate();

}



function handleColonistCollision( incomingObject : IncomingObject, planetSideObject : IncomingObject )
{

	incomingObject.deactivate();

	planetSideObject.deactivate();

}



function handleAlienCollision( incomingObject : IncomingObject, planetSideObject : IncomingObject )
{

	incomingObject.deactivate();

	planetSideObject.deactivate();

}



/////////////////////////////////////EVENTS



function incomingObjectHitPlanet( incomingObject : IncomingObject )
{

	// Set angle of attachment
	incomingObject.setAngleOfAttachment();


	// Check for collision with objects that are currently stuck to the planet
	incomingObjectCollisionCheck( incomingObject );


	// If no collision occured, do something
	switch( incomingObject.type )
	{

		case IncomingObject.TYPE_ASTEROID:
			planet.increaseRadius( 10.0 );
			repositionObjectsOnPlanet();
			incomingObject.deactivate();
			break;

		case IncomingObject.TYPE_COLONIST:
			incomingObject.stickToPlanet();
			break;

		case IncomingObject.TYPE_ALIEN:
			incomingObject.stickToPlanet();
			break;

		default:
			break;

	}

	makeRandomIncomingObject();

}



/////////////////////////////////////BUTTONS



function orbitControlStripPressed()
{

	orbitDragging = true;

}



function planetControlStripPressed()
{

	planetDragging = true;

}


//////////////////////////////////////UPDATE



function updateSublayerGame()
{


	//drag to rotate circle
	if( orbitDragging == true )
	{
	
		var dif : Vector2 = InputManager.instance.lastTouchPos - InputManager.instance.currentTouchPos;
	
		var displaceX : float = dif.x * -0.2;
		
		orbitRotation += displaceX;
		
		planetCenter.transform.eulerAngles.z = orbitRotation;
		
	}


	// planet.increaseRadius(0.01);

	updateIncomingObjects();
	
}


