import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
 //   PanResponder,
    Animated,
	Easing,
    Dimensions,
	TouchableHighlight,
	Image,
	Platform
} from 'react-native';
import Camera from 'react-native-camera';
import Game from './Game';
import Grade from './Grade';
import _ from 'lodash';
//import Dragable from './Dragable';
//import Dropable from './Dropable';

export default class Viewport extends Component{
	constructor(props) {
		super(props);
		this.state = {
			scene:'splash',
			spinValue: new Animated.Value(0),
			loading:false,
			reading:false,
			user:{},
		};
	//	this.read = _.throttle(this.read, 3000);
	}
	read(e) {
	//	console.log(e);
		//styles.mag.borderColor = '#fff'; !!! why doesn't this work? Need re-render?
		//this.setState({scene:'game',url:e.data});
		if (this.state.reading) {
			console.log('BUSY...');
			return;
		}
		try {
			this.setState({reading:true});
			let user_id = typeof this.state.user.id !== 'undefined' ? '/' + this.state.user.id : '';
			let url = 'https://app.eco-explorer.org/qr/' + escape(e.data).replace(/\//g,'%2F') + user_id;
			console.log('fetching url: ' + url);
			let json = fetch(url)
				.then((response) => response.json())
				.then((responseJson) => {
					let _self = this;
					setTimeout(() => {
						_self.setState({reading:false});
					},3000);
					if (typeof responseJson.username !== 'undefined') {
						// user login // IF RESPONSE CODE WAS LOGIN THEN SET USER AND STAY ON CAM PAGE #######################################################
						this.setState({user:responseJson}, () => {
							console.log(this.state);
						});
					} else {
						// load game
						this.setState({scene:'game', url:e.data, gameData:responseJson});
					}
					//console.log(responseJson);
					//return;
					//return responseJson;
			}).catch((error) => {
				this.setState({reading:false});
				console.error(error);
			});
		} catch(e) {
			this.setState({reading:false});
			console.log(e);
		}
	}
	updateState(obj) {
		this.setState(obj);
		if (typeof obj.progress !== 'undefined') {
			// someone just completed a task, log it on the server
			// expects
			//['user_id'] ['task_id'] ['total'] ['correct']
			let post = {
				user_id: typeof this.state.user.id !== 'undefined' ? this.state.user.id : 3857, // hack for bents senior user
				task_id: this.state.gameData.task_id,
				total: obj.progress.num,
				correct:obj.progress.correct,
			};
			fetch('https://app.eco-explorer.org/grade', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(post)
			})
			console.log(post);
		}
		//	this.setState({loading:true},() => {
			// Animated.timing(
			// 	this.state.spinValue, {
			// 		toValue: 1,
			// 		duration: 3000,
			// 		easing: Easing.linear
			// 	}
			// ).start();//});
		// } else {
		 	
		// }
		
	}
	resize() {
		styles.magWrapper = this.state.orientation == 'portrait' ? {
			top:"-30%",
			right:"-7%"
		} : {
			top:"-6%",
			right:"-35%"
		}
	//	console.log(styles.magWrapper);
	}
	onLayout() {
		
		let Window = Dimensions.get('window');
		this.setState({orientation:(Window.width > Window.height ? 'landscape' : 'portrait')}, this.resize);
		//console.log(Window);
	}
	// <TouchableHighlight style={styles.buttonTouchable} onPress={ () => this.read({'data':x}) }>
	// 				<Text style={styles.buttonText}>Fake Scan</Text>
	// 			</TouchableHighlight>
	componentDidMount() {
		
	}
	render() {
		const game_codes = [
			'DXYXco',
			'wxyqxd',
			'63wYyU',
			'344W51',
			'In4zNE',
			'1fYN4p',
			'kns3kz',
			'F8MU9y',
			'yAjKAX',
			'SQP5Xo'	
		];
		const x = 'http://goo.gl/' + game_codes[Math.floor(Math.random() * game_codes.length)];
		const cam  = 
		<View >
			<View style={[styles.magWrapper, {top:-110, right:-50}]}>
				<Camera
					ref={(cam) => {
						this.camera = cam;
					}}
					onBarCodeRead={(e) => this.read(e)}
					style={styles.preview}
					aspect={Camera.constants.Aspect.fill}/>
				<View style={styles.mag}/>
				<Image style={styles.magHandle}
					source={require('../assets/magHandle.png')}
					resizeMode="contain">
				</Image>
			</View>
			<View style={{padding:15,backgroundColor:'#fff',margin:10,position:'absolute',width:240,bottom:-50,right:-60}}>
				<Text style={{fontSize:16}}>Find the hidden QR codes to unlock new games!</Text>
			</View>
			<TouchableHighlight style={[styles.buttonTouchable, {position:'absolute', bottom:-140}]} onPress={ () => this.read({'data':x}) }>
				<Text style={[styles.buttonText, {width:207,textAlign:'center'}]}>Can't find a code</Text>
			</TouchableHighlight>
		</View>;

		const splash = 
		<View>
			{this.state.loading ? 
				<Animated.Image style={{position:'absolute',transform: [{rotate: spin}]}}
					source={require('../assets/leaf-tl.png')}
					resizeMode="contain"/>
				:
				<View>
					<Image style={styles.logo}
						source={require('../assets/logo.png')}
						resizeMode="contain">
					</Image>
					<TouchableHighlight style={styles.buttonTouchable} onPress={() => this.updateState({scene:'cam'}) }>
						<Text style={styles.buttonText}>Explore</Text>
					</TouchableHighlight>
				</View>
			}
		</View>;

		const game = <Game 
			gameData={this.state.gameData} 
			updateState={this.updateState.bind(this)}/>;
		
		const grade = <Grade progress={this.state.progress} updateState={this.updateState.bind(this)} styles={styles}/>;
		const spin = this.state.spinValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		})
		return (
		<Image style={styles.container}
			source={require('../assets/background.jpg')}
			resizeMode="cover"
			resizeMethod="resize"
			onLayout={this.onLayout.bind(this)}>
			<Image style={styles.leavesTl}
				source={require('../assets/leaves-tl.png')}
				resizeMode="contain"/>
			<Image style={styles.leavesBr}
				source={require('../assets/leaves-br.png')}
				resizeMode="contain"/>
			{typeof this.state.user.full_name !== 'undefined' && this.state.scene == 'cam' ? 
				<Text style={{width:'100%',padding:5,textAlign:'center',backgroundColor:'rgba(255,255,255,.7)',position:'absolute',top:0}}>Hi {this.state.user.full_name}</Text> 
				: null
			}
			{this.state.scene == 'splash' ? splash :
				(this.state.scene == 'cam' ? cam :
					(this.state.scene == 'game' ? game : 
						(this.state.scene == 'grade' ? grade : <View><Text>Screen not defined</Text></View>)
					)
				)
			}
		</Image>
		);
	}
}

const magWidth = 40;

let styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		width:'100%',
		height:'100%',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor:'rgba(0,0,0,.5)',
	},
	logo: {
		width:300,
		height:150,
		marginBottom:40,
	},
	preview: {
		//flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		width:200,
		height:200,
		
	},
	magWrapper: {
	/*	top:"-30%",
		right:"-5%"*/
	},
	mag: {
		position:'absolute',
		left:-magWidth,
		right:-magWidth,
		top:-magWidth,
		bottom:-magWidth,
		borderColor:'#252525',
		borderWidth:Platform.OS === 'ios' ? magWidth + 1 : magWidth, // iPhone 6 hack
		borderRadius:Platform.OS ==='ios' ? 140 : 130,
		flex:1,
		justifyContent:'flex-end',
	},
	magHandle: {
		position:'absolute',
		width:140,
		left:-130,
		bottom:-175
	},
	buttonTouchable: {
		padding: 16,
		backgroundColor: '#00AB4D',
		margin:20,
		//flex:1,
		alignItems:'center',
		//textAlign:'center'
		//height:60,
		//zIndex:10,
	},
	buttonText: {
		color:'#fff',
		fontWeight:'bold',
		fontSize:20, /* */
	},
	leavesBr: {
		position:'absolute',
		bottom:-20,
		right:0,
		width:200,
		height:300,
	},
	leavesTl: {
		position:'absolute',
		top:-10,
		left:0,
		width:200,
		height:300,
	}
});