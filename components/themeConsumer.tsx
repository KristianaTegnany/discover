import React, { useContext, useEffect } from 'react';
import { colors, ThemeContext } from "react-native-elements";


export default ( children:any ) => {
    const { updateTheme } = useContext(ThemeContext);

    console.log(children)
    useEffect(() => {
        updateTheme( {colors:colors});
    }, [])
    return (
        <>
            {children.children}
        </>
    )
}