#pragma strict


public var buttonEnabled : boolean = true;


public var onTouchDownInsideDelegate : function() = null;
public var onTouchUpInsideDelegate : function() = null;
public var onButtonRepeatDelegate : function() = null;

public var spriteComponent : tk2dSprite;

public var upTextureId : int = -1;
public var downTextureId : int = -1;


public var buttonRepeatCounterMax : int = 6;
public var buttonRepeatCounter : int = buttonRepeatCounterMax;
public var buttonRepeatAccelThreshold : int = 6;


public var isDown : boolean = false;
public var wasDownLastFrame : boolean = false;
public var framesHeldDown : int = 0;


public var onPressSFX : AudioSource = null;
public var onReleaseSFX : AudioSource = null;
public var onTouchUpInsideSFX : AudioSource = null;
public var onButtonRepeatSFX : AudioSource = null;



function onInstantiate()
{
    
}



function setupButtonGraphics( _upTexture : String, _downTexture : String )
{

    spriteComponent = gameObject.GetComponent( tk2dSprite );
    
    upTextureId = spriteComponent.GetSpriteIdByName( _upTexture );
    
    downTextureId = spriteComponent.GetSpriteIdByName( _downTexture );
    
}



function onTouchDownInside()
{

	if( onTouchDownInsideDelegate != null )
	{
		onTouchDownInsideDelegate();
	}
	
}



function onTouchUpInside()
{

	//set these to off to prevent rolloff from being called later
    wasDownLastFrame = false;
    isDown = false;


	//reset move counter to prevent skips
    buttonRepeatCounter = buttonRepeatCounterMax * 3;

        
    //ml->playSFX( onTouchUpInsideSFX );
    
    if( spriteComponent != null )
    	spriteComponent.SetSprite( upTextureId );
    
    
    if( onTouchUpInsideDelegate != null )
	{
	
		if( onButtonRepeatSFX != null )
			onButtonRepeatSFX.Play();
		
		onTouchUpInsideDelegate();
		
	}
    
}



function onRollover()
{

    if( onPressSFX != null )
		onPressSFX.Play();
    
    if( spriteComponent != null )
    	spriteComponent.SetSprite( downTextureId );
    
    //reset frames down
    framesHeldDown = 0;
    
}



function onRolloff()
{

    if( onReleaseSFX != null )
		onReleaseSFX.Play();
    
    if( spriteComponent != null )
    	spriteComponent.SetSprite( upTextureId );
    
}



function checkButtonState()
{

    if( wasDownLastFrame == false && isDown == true )
    {
    
        onRollover();
        
        wasDownLastFrame = true;
        
    }
    
    
    if( wasDownLastFrame == true && isDown == false )
    {
    
        onRolloff();
        
        wasDownLastFrame = false;
        
    }
    
}



function handleButtonRepeat()
{

    buttonRepeatCounter--;
    
    //button fires again when repeat counter ends
    if( buttonRepeatCounter == 0 )
    {
        //if player held down button for several frames, speed up repeat rate
        framesHeldDown++;
        
        if( framesHeldDown > buttonRepeatAccelThreshold )
        {
            buttonRepeatCounter = buttonRepeatCounterMax * 0.75f; //speed up repeat rate
        }
        else
        {
            buttonRepeatCounter = buttonRepeatCounterMax; //normal repeat rate
        }
        
        
        //play sfx
        if( onButtonRepeatSFX != null )
			onButtonRepeatSFX.Play();
        
        //execute function
        onButtonRepeatDelegate();

    }
    
}



function updateButton()
{

	//check state for rollover / rolloff
    checkButtonState();
    

    //repeat held button press if needed
    if( onButtonRepeatDelegate != null )
    {
    	if( isDown == true )
    	{
    		handleButtonRepeat();
    	}
    }

}