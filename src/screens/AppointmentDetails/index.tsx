import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, FlatList, Alert, Share, Platform } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { Fontisto } from '@expo/vector-icons';
import { api } from '../../services/api';
import * as Linking from 'expo-linking';

import {Background} from '../../components/Background';
import {Header} from '../../components/Header';
import { ListHeader } from '../../components/ListHeader';
import { ListDivider } from '../../components/ListDivider';
import {Member, MemberProps} from '../../components/Member';
import { ButtonIcon } from '../../components/ButtonIcon';
import { AppointmentProps } from '../../components/Appointment';
import { Load } from '../../components/Load';

import Banner from '../../assets/banner.png'

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type Params = {
    guildSelected: AppointmentProps;
}

type GuildWidget = {
    id: string;
    name: string;
    instant_invite: string;
    members: MemberProps[];
    presence_count: number; 
}

export function AppointmentDetails(){
    const route = useRoute();
    const {guildSelected} = route.params as Params;
    const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget)
    const [loading, setLoading] = useState(true);
    
    function handleShareInvitation(){
        const message = Platform.OS === 'ios' ? 
        `Junte-se ${guildSelected.guild.name}` : 
        widget.instant_invite;

        Share.share({
            message,
            url: widget.instant_invite
        });
    }

    async function fetchGuildWidget(){
        try{
            const response = await api.get(`/guilds/${guildSelected.guild.id}/widget.json`);
            setWidget(response.data);
        }catch(error){
            Alert.alert("Verifique as configurações do servidor. Será que o Widget está habilitado?");
        }finally{
            setLoading(false);
        }
    };

    function handleOpenGuild(){
        Linking.openURL(widget.instant_invite);
    }

    useEffect(() => {
        fetchGuildWidget();
    }, [])

    return(
        <Background>
            <Header
                title="Detalhes"
                action={
                    guildSelected.guild.owner &&
                    <BorderlessButton onPress={handleShareInvitation}>
                        <Fontisto 
                            name="share"
                            size={20}
                            color={theme.colors.primary}
                        />
                    </BorderlessButton>
                }
            />
            <View>
                <ImageBackground 
                        style={styles.banner}
                        source={Banner}>
                    <View style={styles.bannerContent}>
                        <Text style={styles.title}>{guildSelected.guild.name}</Text>
                        <Text style={styles.subTitle}>{guildSelected.description}</Text>
                    </View>
                </ImageBackground>
                {
                    loading? 
                        <Load />: 
                    <>
                        <ListHeader 
                            title="Jogadores"
                            subtitle={`Total de ${widget.members.length}`}/>
                        
                        {
                        <FlatList
                            data={widget.members ? widget.members : []} // UPDATE 1# Bom cuidar aqui, caso não encontre um Widget automaticamente não haverá membros.
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                            <Member data={item} />
                            )}
                            ItemSeparatorComponent={() => <ListDivider isCentered />}
                            style={styles.members}
                            ListEmptyComponent={() => ( // UPDATE 2#  Um propriedade para renderizar algo quando a lista e vázia.
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                Não há ninguém online agora.
                                </Text>
                            </View>
                            )}
                        />
                        }
                    </>
                }
                { guildSelected.guild.owner &&
                    <View style={styles.footer}>
                        <ButtonIcon onPress={handleOpenGuild} title="Entrar na partida"/>
                    </View>
                }
            </View>
            
        </Background>
    );
}