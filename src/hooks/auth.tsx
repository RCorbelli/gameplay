import React, {
       createContext,
       useContext,
       useState,
       useEffect,
       ReactNode,
} from 'react';
import {api} from '../services/api';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLLECT_USERS } from '../configs/database';
const { SCOPE } = process.env;
const { CLIENT_ID } = process.env;
const { CDN_IMG } = process.env;
const { REDIRECT_URI } = process.env;
const { RESPONSE_TYPE } = process.env;


type User ={
    id: string;
    userName: string;
    firstName: string;
    avatar: string;
    email: string;
    token: string;

}

type AuthContextData = {
    user: User;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

type AuthProviderProps = { 
    children: ReactNode;
}

type AuthorizationResponse = AuthSession.AuthSessionResult & {
    params: {
        access_token?: string;
        error? : string;
    }
}
    
export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<User>({} as User);
    const [loading, setLoading] = useState(false);

    async function signIn(){
        const authUrl = `${api.defaults.baseURL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
        try{
            setLoading(true);
            const {type, params} = await AuthSession
            .startAsync({authUrl}) as AuthorizationResponse;
            console.log(type);
            if(type === "success" && !params.error){
                api.defaults.headers.authorization = `Bearer ${params.access_token}`;
                const userInfo = await api.get('/users/@me');
                const firstName = userInfo.data.username.split(' ')[0];
                userInfo.data.avatar = `${CDN_IMG}/avatars/${userInfo.data.id}/${userInfo.data.avatar}.png`;
                const userData = {
                    ...userInfo.data,
                    firstName,
                    token: params.access_token
                }
                await AsyncStorage.setItem(COLLECT_USERS, JSON.stringify(userData))
                setUser(userData)
            }
        }catch{
            setLoading(false);
            throw new Error('Não foi possível autenticar!');
        }finally{
            setLoading(false);
        }
    };

    async function signOut() {
        setUser({} as User);
        await AsyncStorage.clear();
        
    }
    async function loadUserStorageData(){
        const storage = await AsyncStorage.getItem(COLLECT_USERS);
        if(storage){
            const userLogged = JSON.parse(storage) as User;
            api.defaults.headers.authorization = `Bearer ${userLogged.token}`;
            setUser(userLogged);
        }
    }
    
    useEffect(() => {
        loadUserStorageData();
    }, []);

    return(
        <AuthContext.Provider value ={{user, loading, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );

}

function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

export {AuthProvider, useAuth};