import React from 'react';
import {View, Text} from 'react-native';
import { theme } from '../../global/styles/theme';
import { Avatar } from '../Avatar';
import {styles} from './styles';

export type MemberProps = { 
    id: string;
    username: string;
    avatar_url: string;
    status: string;
}

type Props = {
    data: MemberProps;
}
export function Member({data}: Props){
    const isOnline = data.status === 'online';
    return(
        <View style={styles.container}>
            <Avatar urlImg={data.avatar_url} />
            <View>
                <Text style={styles.title}>{data.username}</Text>
                <View style={styles.status}>
                    <View style={[
                        styles.bulletStatus,
                        {
                            backgroundColor: isOnline ? theme.colors.on : theme.colors.primary
                        }
                    ]} />
                    <Text style={styles.nameStatus}>{isOnline ? 'Disponível': 'Ocupado'}</Text>
                </View>
            </View>
        </View>
    );
}