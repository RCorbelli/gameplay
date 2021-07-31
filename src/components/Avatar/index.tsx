import React from 'react';
import {Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { theme } from "../../global/styles/theme";
import { styles } from './styles';

type Props = {
    urlImg: string;
}
export function Avatar({urlImg}: Props){
    const{secondary50, secondary70} = theme.colors;

    
    return(
        <LinearGradient
            style={styles.container}
            colors={[secondary50, secondary70]}
        >
            <Image 
                source={{uri: urlImg}}
                style={styles.avatar}
            />
        </LinearGradient>
    );
}