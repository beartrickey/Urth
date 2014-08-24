#pragma strict


////ENUMS



////VARIABLES

//camera and screen
public var camera2D : tk2dCamera;

public var aspectRatio : float = 0.0;


//game state
public static var gameState : int = 0;


//sub layers:
public var sublayerGamePrefab : GameObject;
public var sublayerGame : Sublayer;


public var activeSublayer: Sublayer = null;


//managers


//singleton ref
public static var instance : GameManager;




function Start ()
{

	instance = this;


	Debug.Log("GameManager.Start");


	//don't delete GameManager when going between scenes
	GameObject.DontDestroyOnLoad( this );
	
	
	//limit frame rate to 60 hertz
	Application.targetFrameRate = 60.0;
	
	
	//figure out screen dimensions
	setScreenDimensions();
	
	
	//instantiate game sublayer
	var sublayerGameGameObject : GameObject = Instantiate( sublayerGamePrefab, Vector3.zero, sublayerGamePrefab.transform.rotation ) as GameObject;
	sublayerGameGameObject.GetComponent( SublayerGameDelegate ).onInstantiate();
	
	//set active sublayer
	activeSublayer = sublayerGame;
	
	
	
	//instantiate managers
	//var bmGameObject : GameObject = Instantiate( bmPrefab, Vector3.zero, bmPrefab.transform.rotation ) as GameObject;
	//blockManagerComponent = bmGameObject.GetComponent( BlockManagerComponent );
	//blockManagerComponent.onInstantiate();


	
	//HACK start game
	SublayerGameDelegate.instance.startGame();
	
}




function setScreenDimensions()
{
	
	//device screen resolution
	var screenWidth : float = Screen.currentResolution.width;
	var screenHeight : float = Screen.currentResolution.height;
	
	var currentNativeResolutionWidth : float = camera2D.NativeResolution.x;
	var currentNativeResolutionHeight : float = camera2D.NativeResolution.y;
	
	
	//force window resolution for desktop
	if( Application.platform == RuntimePlatform.OSXPlayer ||
		Application.platform == RuntimePlatform.OSXEditor ||
		Application.platform == RuntimePlatform.WindowsPlayer ||
		Application.platform == RuntimePlatform.WindowsEditor ||
		Application.platform == RuntimePlatform.LinuxPlayer )
	{
	
		Screen.SetResolution( 640, 960, false );
		
		screenWidth = 640;
		screenHeight = 960;
		
	}
	
	
	//what is the device screen aspect ratio compared to the base aspect ratio?
	aspectRatio = screenWidth / screenHeight;
    var baseAspectRatio : float = currentNativeResolutionWidth / currentNativeResolutionHeight;
    
    var scaleDif : float = 1.0;
    
    //Which edge will fit first when scaling? The top edge or side edge?
    if( aspectRatio < baseAspectRatio )
    {
    
        //layer sides will be flush with screen sides
        scaleDif = screenWidth / currentNativeResolutionWidth;
        
    }
    else
    {
    
    	//layer top and bottom will be flush with screen top and bottom
    	scaleDif = screenHeight / currentNativeResolutionHeight;
    	
    }

	
	//adjust camera's ortho size
	var currentOrthoSize : float = camera2D.CameraSettings.orthographicSize;
	var newOrthoSize : float =  currentOrthoSize / scaleDif;
	
	camera2D.CameraSettings.orthographicSize = newOrthoSize;

}



function Update ()
{

	//active layer update
	if( activeSublayer != null )
	{
		activeSublayer.sublayerUpdate();
	}
	
}


