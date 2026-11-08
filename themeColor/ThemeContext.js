import React, {createContext, useState} from 'react';

export const ThemeContext = createContext();  //pass context, the theme colors, to each seperate pages


/***************************************************************/
////********************THEME PROVIDER************************///
/***************************************************************/
function ThemeProvider ({ children })
{
    const [isDarkMode, setIsDarkMode] = useState(false); //usestate for switching colors set to flase
    const toggleTheme = () => setIsDarkMode(previous => !previous); //if activate the fucntion it switch previous colors back and forth
    const theme = {
        isDarkMode, //dark mode
        toggleTheme, //toggle theme function
        colors:{
            background: isDarkMode ? '#ffffff' : "#faff97", //black, yellow
            background2: isDarkMode ? '#2b2b2b' : "#ffffff", //black, yellow
            background3: isDarkMode ? '#2b2b2b' : "#faff97", //black, yellow
            text: isDarkMode ? '#ffffff' : '#000000', //black, white
        }
    }
}


export default ThemeProvider;