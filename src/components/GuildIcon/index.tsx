import React from 'react';
import { View, Image } from 'react-native';

import { styles } from './styles';
import DiscordSVG from '../../assets/discord.svg';

type Props = {
  guildId: string;
  iconId: string | null;
}
export function GuildIcon({guildId, iconId}: Props) {
  const { CDN_IMG } = process.env;
  const uri = `${CDN_IMG}/icons/${guildId}/${iconId}.png`;
  // const uri = 'https://gamerssuffice.com/wp-content/uploads/2019/11/How-to-add-bots-to-discord-500x405.jpg';

  return (
    <View style={styles.container}>
      {
      iconId ?
      <Image 
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"    
      /> : 
      <DiscordSVG width={40} height={40} />
      }
    </View>
  )

}