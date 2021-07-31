import React from 'react';
import {TextInput, TextInputProps} from 'react-native';
import { styles } from './styles';

export function Smallinput({...rest}: TextInputProps){
    return(
        <TextInput 
            {...rest}
            style={styles.container}
            keyboardType="numeric"
        />
    );
}