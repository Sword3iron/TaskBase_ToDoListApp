import React, {createContext, useState} from 'react';

export const ThemeContext = createContext();  //pass context, the theme colors, to each seperate pages


/***************************************************************/
////********************THEME PROVIDER************************///
/***************************************************************/
function ThemeProvider ({ children })
{
    const [isDarkMode, setIsDarkMode] = useState(false); //usestate for switching colors set to flase
    const toggleTheme = () => setIsDarkMode(previous => !previous); //if activate the fucntion it switch previous colors back and forth
}


export default ThemeProvider;