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



/////////////////////////////////////EVENTS



function incomingObjectHitPlanet( incomingObject : IncomingObject )
{

	if( incomingObject.type == IncomingObject.TYPE_ASTEROID )
	{
		planet.increaseRadius( 10.0 );
		repositionObjectsOnPlanet();
		incomingObject.deactivate();
	}
	else
	{
		incomingObject.stickToPlanet();	
	}

	var newIncomingObject : IncomingObject = getFreeIncomingObject();
	newIncomingObject.onInit( IncomingObject.TYPE_ASTEROID );

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


