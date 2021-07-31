import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import {Background} from '../../components/Background';
import { ModalView } from '../../components/ModalView';
import { Guilds } from '../../components/Guilds';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header';
import { CategorySelect } from '../../components/CategorySelect';
import { GuildIcon } from '../../components/GuildIcon';
import { Smallinput } from '../../components/Smallinput';
import { Textarea } from '../../components/Textarea';
import { theme } from '../../global/styles/theme';

import { styles } from './styles';
import { GuildProps } from '../../components/Guild';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECT_APPOINTMENTS } from '../../configs/database';

export function AppointmentCreate(){
    const navigation = useNavigation();
    const [category, setCategory] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [guild, setGuild] = useState<GuildProps>({} as GuildProps);

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [description, setDescription] = useState('');
    
    function handleOpenModal(){
        setOpenModal(true);
    }

    function handleCloseModal(){
        setOpenModal(false);
    }

    function handleGuildSelect(guildSelected: GuildProps){
        setGuild(guildSelected);
        setOpenModal(false);
    }

    async function handleSave() {  
        const newAppointment = {
            id: uuid.v4(),
            guild,
            category,
            date: `${day}/${month} às ${hour}:${minute}h`,
            description
        };

        const storage = await AsyncStorage.getItem(COLLECT_APPOINTMENTS);
        const appointments = storage ? JSON.parse(storage) : [] ;

        await AsyncStorage.setItem(COLLECT_APPOINTMENTS, JSON.stringify([...appointments, newAppointment]));
        navigation.navigate('Home');
    }
    return(
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}                                      
        >
            <Background>
                <ScrollView>
                    <Header
                        title="Agendar Partida"
                    />
                    <Text style={[
                                styles.label, 
                                {marginLeft: 24, marginTop: 36, marginBottom: 18}]}>Categoria
                    </Text>
                    <CategorySelect 
                        hasCheckBox={true}
                        setCategory={setCategory} 
                        categorySelected={category}  
                    />
                    <View style={styles.form}>
                        <RectButton onPress={handleOpenModal}>
                            <View style={styles.select}>
                                {
                                guild.icon ? <GuildIcon guildId={guild.id} iconId={guild.icon} /> :
                                <View style={styles.img} />
                                }
                                <View style={styles.selectBody}>
                                    <Text style={styles.label}>{guild.name ? guild.name :  'Selecione um Servidor'}</Text>
                                </View>
                                <Feather
                                    name="chevron-right"
                                    color= {theme.colors.highlight}
                                    size={27} />
                            </View>
                        </RectButton>
                        <View style={styles.field}>
                            <View>
                                <Text style={[styles.label, {marginBottom: 12}]}>Dia e mês</Text>
                                <View style={styles.column}>
                                    <Smallinput 
                                        maxLength={2}
                                        onChangeText={setDay} 
                                    />
                                    <Text style={styles.divider}>
                                        /
                                    </Text>
                                    <Smallinput 
                                        maxLength={2}
                                        onChangeText={setMonth}
                                    />
                                </View>
                            </View>
                            <View>
                                <Text style={[styles.label , {marginBottom: 12}]}>Horário</Text>
                                <View style={styles.column}>
                                    <Smallinput 
                                        maxLength={2}
                                        onChangeText={setHour}
                                    />
                                    <Text style={styles.divider}>
                                        :
                                    </Text>
                                    <Smallinput 
                                        maxLength={2}
                                        onChangeText={setMinute}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.field}>
                            <Text style={[styles.label, {marginBottom: 12}]}>Descrição</Text>
                            <Text style={styles.caracteresLimit}>Max 100 caracteres</Text>
                        </View>
                        <Textarea 
                            multiline
                            maxLength={100}
                            numberOfLines={5}
                            autoCorrect={false}
                            onChangeText={setDescription}
                        />
                        <View style={styles.footer}>
                            <Button title="Agendar Partida" onPress={handleSave}></Button>
                        </View>
                    </View>
                </ScrollView>
            </Background>
            <ModalView visible={openModal} closeModal={handleCloseModal}>
                <Guilds handleGuildSelected={handleGuildSelect} />
            </ModalView>
        </KeyboardAvoidingView>
    );
}