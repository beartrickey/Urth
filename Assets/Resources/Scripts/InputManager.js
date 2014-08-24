#pragma strict



public static var keyboardEnabled : boolean = true;


public var mouseWheelMovedLastFrame : boolean = false;

public var lastTouchPos : Vector2 = Vector2( 0.0, 0.0 );
public var currentTouchPos : Vector2 = Vector2( 0.0, 0.0 );

public static var instance : InputManager;


function Start ()
{

	instance = this;

	Screen.showCursor = true;
}



function Update ()
{
	
	lastTouchPos = currentTouchPos;
	
	switch( Application.platform )
	{
	
		case RuntimePlatform.Android:
		case RuntimePlatform.IPhonePlayer:
		case RuntimePlatform.WP8Player:
		
			//touch
			handleTouchControls();
			
			
			
		
			break;
		
		
		case RuntimePlatform.OSXPlayer:
		case RuntimePlatform.OSXEditor:
		case RuntimePlatform.WindowsPlayer:
		case RuntimePlatform.WindowsEditor:
		case RuntimePlatform.LinuxPlayer:
		
			//mouse
			handleMouseControls();
			
			
			
			//keyboard input
			handleKeyboardControls();
			
			break;
		
		
		
		default:
			break;
		
	
	}

}



function handleTouchControls()
{

	//touch began
	if( Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began )
	{
		touchBegan();
	}
	
	
	//touch moved
	if( Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Moved )
	{
		touchMoved();
	}
	
	
	//touch ended
	if( Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Ended )
	{
		touchEnded();
	}
	
}



function handleMouseControls()
{

	//mouse button pressed down this frame
	if( Input.GetMouseButtonDown(0) == true )
	{
		mouseBegan();
	}
	
	
	//mouse button down
	if( Input.GetMouseButton(0) == true )
	{
		mouseMoved();
	}
	
	
	//mouse button released
	if( Input.GetMouseButtonUp(0) == true )
	{
		mouseEnded();
	}

}




function handleKeyboardControls()
{
	
	//bail if not turned on
	if( keyboardEnabled == false )
		return;

}



function mouseBegan()
{

	var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );
	lastTouchPos = currentTouchPos = ray.origin;

	checkForButtonTouchDownInside( Input.mousePosition );
}



function mouseMoved()
{
	var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );
	currentTouchPos = ray.origin;

	checkForButtonRolloverRolloff( Input.mousePosition );
}



function mouseEnded()
{
	SublayerGameDelegate.instance.planetDragging = false;
	SublayerGameDelegate.instance.orbitDragging = false;
	checkForButtonTouchUpInside( Input.mousePosition );
}




function touchBegan()
{

	var ray : Ray = Camera.main.ScreenPointToRay( Input.GetTouch(0).position );
	lastTouchPos = currentTouchPos = ray.origin;

	checkForButtonTouchDownInside( Input.GetTouch(0).position );

}




function touchMoved()
{

	var ray : Ray = Camera.main.ScreenPointToRay( Input.GetTouch(0).position );
	currentTouchPos = ray.origin;

	checkForButtonRolloverRolloff( Input.GetTouch(0).position );

}




function touchEnded()
{
	SublayerGameDelegate.instance.planetDragging = false;
	SublayerGameDelegate.instance.orbitDragging = false;
	checkForButtonTouchUpInside( Input.GetTouch(0).position );

}



function checkForButtonTouchDownInside( _screenTouchCoords : Vector2 )
{
	
	var buttonScript : ButtonScript = checkForButtonCollision( _screenTouchCoords );
	
	
	//bail if no script available
	if( buttonScript == null )
		return;
		
		
	//click button
    buttonScript.onTouchDownInside();
	
}




function checkForButtonRolloverRolloff( _screenTouchCoords : Vector2 )
{

	var buttonScript : ButtonScript = checkForButtonCollision( _screenTouchCoords );
	
	
	//bail if no script available
	if( buttonScript == null )
		return;

}




function checkForButtonTouchUpInside( _screenTouchCoords : Vector2 )
{

	var buttonScript : ButtonScript = checkForButtonCollision( _screenTouchCoords );
	
	
	//bail if no script available
	if( buttonScript == null )
		return;
		
		
	//click button
    buttonScript.onTouchUpInside();

}




function checkForButtonCollision( _screenTouchCoords : Vector2 ) : ButtonScript
{

	//reset all buttons
	GameManager.instance.activeSublayer.resetAllButtons();
	

	var ray = Camera.main.ScreenPointToRay( _screenTouchCoords );
	
	var hitList : RaycastHit[] = Physics.RaycastAll( ray, 1000 );
	
	
	//bail if nothing hit
	if( hitList.length <= 0 )
		return;
		
	
	//loop through hit list for any buttons on screen
	for( var i : int = 0; i < hitList.length; i++ )
	{
	
		var hit : RaycastHit = hitList[i];
		
		var buttonScript : ButtonScript = hit.collider.GetComponent( ButtonScript );
		
		
		//skip if null
		if( buttonScript == null )
			continue;
			
		
		//skip if not enabled
		if( buttonScript.buttonEnabled == false )
			continue;
		
				
		//register as being down
    	buttonScript.isDown = true;
        
        		
        //return button
        return buttonScript;
        
	}
	
	
	return null;

}



