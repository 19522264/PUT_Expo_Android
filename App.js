import { StatusBar } from 'expo-status-bar';
import React, {Children, useContext, useEffect, useState} from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { useAssets } from "expo-asset";
import { onAuthStateChanged} from "firebase/auth"
import { auth } from "./firebase"
import { NavigationContainer, useNavigation} from "@react-navigation/native"
import { createStackNavigator}  from "@react-navigation/stack"
import SignIn from './screens/Authentication/SignIn';
import ContextWrapper from './context/ConTextWrapper';
import "react-native-gesture-handler";
import { async } from '@firebase/util';
import AppLoading from 'expo-app-loading';
import { render } from 'react-dom';
import Context from './context/ConText';
import Settings from './screens/Settings/Settings';
import Profile from './screens/Authentication/Profile';
import Splash from './screens/General/Splash';
import TextGradient from './elements/TextGradient';
import Intro from './screens/General/Intro';
import Forgot from './screens/Authentication/Forgot';
import Friends from './screens/Friend/Friends'
import Call from './screens/Call/Call';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AntDesign, Feather,Entypo } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import Avatar from './elements/Avatar';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import BottomTabNavigatorElement from './elements/BottomTabbarElements';
import Chat from './screens/Chat/Chat';
import UserInfo from './screens/User/UserInfo';
import PointPropType from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedPointPropType';
import FriendsAvatar from './elements/FriendsAvatar';
import VoiceCall from './screens/Call/VoiceCall';
import VideoChat from './screens/Call/VideoChat';
import FriendInfo from './screens/Friend/FriendInfo';
import SearchFriends from './screens/Friend/SearchFriends';
import ChangeBio from './screens/User/ChangeBio';
import Account from './screens/Settings/Account';
import Notifications from './screens/Settings/Notifications';
//import AllFriends from './screens/Friend/AllFriends';
import Chats from './screens/Chat/Chats';
import DarkMode from './screens/Settings/DarkMode';
import CreateGroup from './screens/Chat/CreateGroupChat';
import CreateGroupInfo from './screens/Chat/CreateGroupInfo';
import ChangeEmail from './screens/Authentication/ChangeEmail';
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage ...."
])

function App() {
  const [currUser, setCurrUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(false);
      if (user) {
        setCurrUser(user);
      }
      else {
        setCurrUser(null);
      }
    });
    return () => unsubscribe;
  }, []);
  if (loading) {
    return (
      <View style={{
        justifyContent: "center", 
        alignItems: "center", 
        flex: 1, 
        backgroundColor: "white"}
        }>
         <Image 
            source={require('./assets/welcome-img.png')}
            style={{width: Dimensions.get('window').width * 0.55, height: Dimensions.get('window').width * 0.55}}
            resizeMethod="auto"
             />
      </View>
    )
  }
  return (
    <NavigationContainer>
    <StatusBar style='transparent'></StatusBar>
    <Stack.Navigator screenOptions={{headerStyle: {
        backgroundColor: 'white',
        shadowOpacity: 0,
        elevation: 0}, 
        headerTintColor: 'white',
      }
    }
      >
    {!currUser ? (
      <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name='intro' component={Intro}/>
          <Stack.Screen name='signIn' component={SignIn} />
          <Stack.Screen name='forgot' component={Forgot} />
      </Stack.Group>
    ) : (
        <>
        <Stack.Group>
        {!currUser.displayName && (
          <Stack.Screen 
            name='profile' 
            component={Profile} 
            options={{headerShown: false, title: "Profile"}}
            />
            )}
            <Stack.Screen 
            name='home' 
            component={Home} 
            options={{headerShown: false, title: "home"}}
            />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'} }}> 
              <Stack.Screen 
                name="userinfo" 
                component={UserInfo} 
                />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerTitle: "Cài đặt",  headerTitleStyle:{color: 'black', fontSize: 18}, headerTitleAlign:'center'}}>
            <Stack.Screen 
                  name='settings'
                  component={Settings} 
                  options={{
                    headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: {
                    color: 'black'
                    },
                    headerBackImage: () => {""},
                  }}
                 />
            </Stack.Group>
            <Stack.Group>
            <Stack.Screen screenOptions={{presentation: 'modal'}}
                name="chat" 
                component={Chat} 
                options={({route, navigation}) => ({
                  headerBackTitle: <>
                    <Feather name="chevron-left" size={35} color="#42C2FF" />
                  </>,
                  headerLeftLabelVisible: true,
                  headerLeftContainerStyle: {
                    width: 50
                  },
                  headerTitle: () => (
                    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',}} onPress={() => navigation.navigate('friendinfo', {user:route.params.user})}>
                    <FriendsAvatar
                        Img={!route.params.user.photoURL === "none" ? require('./assets/user_no_avatar.jpg') : route.params.user.photoURL}
                        Width={40}
                        Height={40} 
                    />
                    <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, }}>{route.params.user.displayName}</Text>
                    </TouchableOpacity>
                   ),
                  headerTitleContainerStyle: {
                    marginLeft: 0
                  },
                  headerBackTitleVisible: true,
                  headerBackImage: () => (<></>),
                  headerRight: () => (
                    <View style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
                      <TouchableOpacity style={{marginLeft: 10, marginRight: 10}} onPress={() => { navigation.navigate('voicecall', {user:route.params.user})}}>
                        <FontAwesome name="phone" size={26} color="#42C2FF" />
                      </TouchableOpacity >
                      <TouchableOpacity style={{marginLeft: 10, marginRight: 10}} onPress={() => { navigation.navigate('videochat', {user:route.params.user})}}>
                        <FontAwesome name="video-camera" size={26} color="#42C2FF" />                      
                        </TouchableOpacity >
                      <TouchableOpacity style={{marginLeft: 10, marginRight: 15}}>
                      <MaterialIcons name="settings" size={26} color="#42C2FF" />
                        </TouchableOpacity>
                    </View>
                    ),
                  })}
                />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerShown : false}}>
              <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
                name="voicecall" 
                component={VoiceCall} 
              />
              <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
                name="videochat" 
                component={VideoChat} 
              />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerShown: false}}>
              <Stack.Screen name="friendinfo" component={FriendInfo}/>
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerShown: false}}>
              <Stack.Screen name="searchFriends" component={SearchFriends}/>
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerTitle: "Chỉnh sửa lời giới thiệu", headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18, color: 'black'}}}>
              <Stack.Screen name="changeBio" component={ChangeBio}
                options={{
                  headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                  headerBackTitleVisible: true,
                  headerBackTitleStyle: {
                  color: 'black'
                  },
                  headerBackImage: () => {""},
                  }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerTitle: "Tài khoản", headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18, color: 'black'}}}>
              <Stack.Screen name="myaccount" component={Account}
                  options={{
                    headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: {
                    color: 'black'
                    },
                  headerBackImage: () => {""},
                }}
              />
              </Stack.Group>
              <Stack.Group screenOptions={{presentation: 'modal', headerTitle: "Chế độ tối", headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18, color: 'black'}}}>
              <Stack.Screen name="darkmode" component={DarkMode}
                  options={{
                    headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: {
                    color: 'black'
                    },
                  headerBackImage: () => {""},
                }}
              />
              </Stack.Group>
              <Stack.Group screenOptions={{presentation: 'modal', headerTitle: "Thông báo", headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18, color: 'black'}}}>
                <Stack.Screen name="notif" component={Notifications}
                  options={{
                    headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: {
                    color: 'black'
                  },
                  headerBackImage: () => {""},
                }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerTitle: "Tạo nhóm", headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18, color: 'black'}}}>
                <Stack.Screen name="creategroup" component={CreateGroup}
                  options={({navigation}) => ({
                    headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: {
                    color: 'black'
                  },
                  headerBackImage: () => {""},
                  headerRight: () => (
                    <TouchableOpacity style={{marginRight: 15}} onPress={ () => { navigation.navigate('creategroupinfo') }}>
                      <Text style={{fontWeight: 'bold', color: '#42C2FF'}}>Tiếp tục</Text>
                    </TouchableOpacity>
                  )
                })}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerShown: false}}>
                <Stack.Screen name="creategroupinfo" component={CreateGroupInfo} />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerTitle: "Email", headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18, color: 'black'}}}>
                <Stack.Screen name="changeEmail" component={ChangeEmail}
                  options={{
                    headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: {
                    color: 'black'
                  },
                  headerBackImage: () => {""},
                }}
              />
            </Stack.Group>
            </>
      )  
    }
    </Stack.Navigator>
  </NavigationContainer>
  );
}
function Home(){
  const navigation = useNavigation();
  return (
      <Tab.Navigator
          screenOptions={{
            headerStyle: {
              height: 100,
              backgroundColor:'white',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20
            },
            headerBackgroundContainerStyle:{
              backgroundColor: 'white'
            },
            tabBarHideOnKeyboard:true,
            headerTitleStyle:{
              color: 'black',
              fontSize: 25
            },
            
            tabBarShowLabel: false,
            tabBarStyle: {
              position: 'absolute',
              bottom: 15,
              marginLeft: 15,
              marginRight: 15,
              backgroundColor: "white",
              borderRadius: 20,
              height: 80
            },
            headerLeft: props => (
              <TouchableOpacity onPress={() => {navigation.navigate('userinfo')}} style={{marginLeft: 15}}>
                <Avatar />
              </TouchableOpacity>
            ),
            headerRight: () => (<>
              <View style={{flexDirection: 'row'}} >
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginRight: 15,  padding: 5}} onPress={() => {navigation.navigate('searchFriends')}}>
                  <FontAwesome name="search" size={24} color="#42C2FF" />
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginRight: 15}} onPress={() => {navigation.navigate('creategroup')}}>
                  <MaterialIcons name="groups" size={35} color="#42C2FF" />
                </TouchableOpacity>
              </View>
              </>
            )
        }
      }
      >
        <Tab.Screen 
            name="Đoạn chat" 
            component={Chats} 
            options={{ 
              tabBarBadge: "99+",
              tabBarBadgeStyle:{
                marginTop: 10,
              },
              tabBarIcon: ({focused}) => (
                  <BottomTabNavigatorElement 
                    name="message-circle"
                    focused={focused}
                    text='Đoạn chat'/>),
             }}
            />
        <Tab.Screen 
            name="Cuộc gọi" 
            component={Call} 
            options={{ 
              tabBarIcon: ({focused}) => (
                  <BottomTabNavigatorElement 
                    name="phone"
                    focused={focused}
                    text='Cuộc gọi'/>)}}            
            />
        <Tab.Screen 
            name="Bạn bè" 
            component={Friends} 
            options={{ 
              tabBarIcon: ({focused}) => (
                <BottomTabNavigatorElement 
                  name="users"
                  focused={focused}
                  text='Bạn bè'/>)}} 
            />
      </Tab.Navigator>
  )
}
export default class Main extends React.Component{
  state = {
    isReady: false
  }

  render(){
    if (!this.state.isReady){
        return <AppLoading
                startAsync={this._loadingRresources}
                onFinish={() => this.setState({isReady : true})}
                onError={console.warn}>
                <Text>Hii</Text>
              </AppLoading>
    }
    return (
      <ContextWrapper>
        <App/>
      </ContextWrapper>
    ) ;
  } 
  async _loadingRresources() {
  }
}
