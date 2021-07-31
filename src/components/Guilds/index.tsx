import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { View, FlatList } from 'react-native';
import { api } from '../../services/api';
import { Guild, GuildProps } from '../Guild';
import { ListDivider } from '../ListDivider';
import { Load } from '../Load';
import { styles } from './styles';

type Props = {
  handleGuildSelected:(guild: GuildProps) => void;
}
export function Guilds({handleGuildSelected} : Props){
   const [guilds, setGuilds] = useState<GuildProps[]>([]);
   const [loading, setLoading] = useState(true);

   async function fetchGuilds (){
     try{
      const response = await api.get('/users/@me/guilds');
      setGuilds(response.data);
     }catch(error){
       Alert.alert(error);
     }finally{
       setLoading(false);
     }
   }

   useEffect(() => {
    fetchGuilds();
   }, [])
  return (
    <View 
      style={styles.container}>
        {
          loading ? 
          <Load /> :
          <FlatList
            data={guilds}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
                <Guild data={item}
                       onPress={() => handleGuildSelected(item)}
                />
            )}
            contentContainerStyle={{paddingBottom: 69}}
            style={styles.guilds}
            showsVerticalScrollIndicator={false} 
            ItemSeparatorComponent={() => <ListDivider />}
            ListHeaderComponent={() => <ListDivider />}
          />
        }
    </View>
  );
}