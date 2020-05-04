import React, { Component } from 'react'
import {
    Text, 
    View, 
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native'
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';
import emojiUtils from 'emoji-utils';
import {GiftedChat, Actions, Bubble, SystemMessage, Avatar} from 'react-native-gifted-chat';
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'eu-west-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-1:5c7b532d-a536-4eb4-bb64-57ca09a462d6',
});
let lexRunTime = new AWS.LexRuntime()

const appsIcon = require('../img/appsicon.png');


export default class ChatBot extends Component {

    static navigationOptions = ({ navigation }) => {
  
        return {
      
        headerTitle: 
        <View style={{ flexDirection: 'row'}}>
           
            <Image
                style={{ height: 35, width: 35, borderRadius: 35/2}}
                source={require('../img/appsicon.png')}
            />
            
            <Text style={{marginLeft: 20,  color: colors.greyBlack, fontSize: 15, fontWeight: '500', alignSelf: 'center'}}>
                24Hires MiniHelper
            </Text>
        </View>,
        
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            userid: null,
            messages: [],
            isLoading: true,
            androidAutoCorrectFix: true,  
        }

        this.onSend = this.onSend.bind(this);
        this.onReceive = this.onReceive.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderAvatar = this.renderAvatar.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
       
    }

    componentWillMount() {
 
        var userid  = this.props.navigation.getParam('userid');
        
        this.setState({
            userid: 'mediumBot' + 1,
        })

        this.getList();
    }

    getList = () => {
        const list = [
          {
            _id: Math.round(Math.random() * 1000000),
            text: "Hello there!",
            createdAt: new Date(),
            user: {
                _id: 'mediumBot' + 2,
                name: '24Hires',
                avatar: appsIcon,
            }
          },
        ]

        this.setState({
            isLoading: false,
        })
    
        this.setState(previousState => ({
          messages: GiftedChat.append( list, previousState.messages),
        }))

       
    }

    onSend(messages = []) {
        
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages,),
          androidAutoCorrectFix: Platform.OS !== 'android'
        
        }))
        this.sendToLex(messages[0].text)
    }

    // Responsible for sending message to lex
    sendToLex = (message) => {

        this.setState((previousState) => {
            return {
                typingText: 'MiniHelper is typing'
            };
        });
      
        let params = {
            botAlias: '$LATEST',
            botName: 'ScheduleAppointment',
            inputText: message,
            userId: this.state.userid,
        }
        lexRunTime.postText(params, (err, data) => {
            if(err) {
                // TODO SHOW ERROR ON MESSAGES
            }
            if (data) {
                this.showResponse(data)
            }
        })
    }

    showResponse = (lexResponse) => {

        let lexMessage = lexResponse.message
        this.onReceive(lexMessage);
       
    }

    onReceive(text) {
        this.setState((previousState) => {
          return {
            typingText: null,
            messages: GiftedChat.append(previousState.messages, {
              _id: Math.round(Math.random() * 1000000),
              text: text,
              createdAt: new Date(),
              user: {
                _id: 'mediumBot' + 2,
                name: '24Hires',
                avatar: appsIcon,
              },
            }),
          };
        })
      }


    renderEmptyView() {
        return(
      
          <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', alignSelf:'center', justifyContent: 'center', }}>
      
            <Text style={{  color:  colors.greyBlack, alignSelf:'center', justifyContent: 'center', fontSize: 17, paddingHorizontal: 20 }}>
                Loading...
            </Text>
      
          </View>
      
        )
    }

    renderFooter(props) {
        if (this.state.typingText) {
          return (
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                {this.state.typingText}
              </Text>
            </View>
          );
        }
        return null;
    }

    renderAvatar(props) {
       
        return (
        <Avatar
            {...props}
            imageStyle={{ left: [styles.slackAvatar] }}
        />
        )
    }

    renderBubble(props) {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#f0f0f0',
                marginLeft: 0,
                marginBottom: 0,
              },
              right: {
                backgroundColor: colors.priceblue,
                marginRight: 10,
                marginBottom: 10,
              }
    
            }}
          />
        );
    }

    
    handleLoadMore = () => {

    }

    render(){
        return(
            <View style={styles.container}>

            {this.state.isLoading? 
                this.renderEmptyView()

                :
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.userid,
                    }}
                    textInputProps={{
                        autoCorrect: Platform.OS === 'ios' || this.state.androidAutoCorrectFix
                    }}
                    renderFooter={this.renderFooter}
                    renderBubble={this.renderBubble}
                    renderAvatar={this.renderAvatar}
                    handleLoadMore={this.handleLoadMore}
                />
            }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor:'white',
    },
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
    slackAvatar: {
        marginLeft: 10,
    },
})