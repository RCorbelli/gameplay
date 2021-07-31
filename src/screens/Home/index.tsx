import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { CategorySelect } from '../../components/CategorySelect';
import { Appointment, AppointmentProps } from '../../components/Appointment';
import { ListDivider } from '../../components/ListDivider';
import { ListHeader } from '../../components/ListHeader';
import { ButtonAdd } from '../../components/ButtonAdd';
import { Profile } from '../../components/Profile';
import {Background} from '../../components/Background';
import { Load } from '../../components/Load';

import { COLLECT_APPOINTMENTS } from '../../configs/database';

import { styles } from './styles';

export function Home() {
  const navigation = useNavigation();
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);

  function handleCategorySelect(categoryId: string) {
    categoryId === category ? setCategory('') : setCategory(categoryId);
  } 

  function handleAppointmentDetails(guildSelected: AppointmentProps){
    navigation.navigate("AppointmentDetails", {guildSelected});
  }
  function handleAppointmentCreate(){
    navigation.navigate("AppointmentCreate");
  }

  async function loadAppointments(){
    // await AsyncStorage.clear()
    const storageResponse = await AsyncStorage.getItem(COLLECT_APPOINTMENTS);
    const storage : AppointmentProps[] = storageResponse ? JSON.parse(storageResponse) : [];
    if(category){
      setAppointments(storage.filter(item => item.category === category));
    }else {
      setAppointments(storage);
    }
    setLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadAppointments();
  }, [category]));

  return (
    <Background>
      <View style={styles.header}>
        <Profile />
        <ButtonAdd onPress={handleAppointmentCreate} />
      </View>
    
      <CategorySelect 
        categorySelected={category}
        setCategory={handleCategorySelect}
      />
      {
        loading ? <Load /> :
        <>
          <ListHeader
            title="Partidas agendadas"
            subtitle={`Total ${appointments.length}`}
          />
          <FlatList 
                data={appointments}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                <Appointment 
                  onPress={() => handleAppointmentDetails(item)}
                  data={item} />            
              )}
              contentContainerStyle={{paddingBottom: 69}}
              ItemSeparatorComponent={() => <ListDivider />}
              style={styles.matches}
              showsVerticalScrollIndicator={false}
            />
        </>
        }
    </Background>
  );  
}