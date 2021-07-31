import React from 'react';
import {TextInput, TextInputProps} from 'react-native';
import { styles } from './styles';

export function Textarea({...rest}: TextInputProps){
    return(
        <TextInput 
            {...rest}
            style={styles.container}
            
        />
    );
}