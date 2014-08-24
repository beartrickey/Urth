﻿#pragma strict


public var updateDelegate : function() = null;

public var NUM_BUTTONS : int = 16;
public var buttonList = new ButtonScript[NUM_BUTTONS];


function Start ()
{

}




function sublayerUpdate()
{

	updateButtons();

	updateDelegate();
	
}



/////////////////////////////////////////////BUTTONS



function disableButtons()
{

	toggleButtons( false );

}



function enabledButtons()
{

	toggleButtons( true );

}



function toggleButtons( _buttonOnOff : boolean )
{

	for( var b : int = 0; b < NUM_BUTTONS; b++ )
	{
	
		//skip null buttons
		if( buttonList[b] == null )
		{
			continue;
		}
		
		buttonList[b].buttonEnabled = _buttonOnOff;
		
	}
	
}



function addButton( _button : ButtonScript )
{

	for( var b : int = 0; b < NUM_BUTTONS; b++ )
	{
	
		//skip null buttons
		if( buttonList[b] == null )
		{
			buttonList[b] = _button;
			return;
		}
		
	}

}



function resetAllButtons()
{

	for( var b : int = 0; b < NUM_BUTTONS; b++ )
	{
	
		//skip null buttons
		if( buttonList[b] == null )
		{
			continue;
		}
		
		buttonList[b].isDown = false;
		
	}
	
}



function updateButtons()
{
	for( var b : int = 0; b < NUM_BUTTONS; b++ )
	{
	
		//skip null buttons
		if( buttonList[b] == null )
		{
			continue;
		}
		
		buttonList[b].updateButton();
		
	}
}