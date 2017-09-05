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
	Platform,
	AsyncStorage
} from 'react-native';
import Camera from 'react-native-camera';
import Game from './Game';
import Grade from './Grade';
import Trophies from './Trophies';
//import _ from 'lodash';
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
			trophies:{},
			codeMap:['tree','snail','woodlouse','bird','beetle','mouse','plant','human','worm','fungus'],
			gameData:{code_name_id:-1},
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
							//console.log(this.state);
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
		//console.log(obj);
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
			});
			if (
				typeof this.state.trophies[this.state.gameData.code_name_id] === 'undefined'
				|| (
					typeof this.state.trophies[this.state.gameData.code_name_id] !== 'undefined'
					&& this.state.trophies[this.state.gameData.code_name_id] < obj.progress.score
				)) {
					let x = this.state.trophies;
					x[this.state.gameData.code_name_id] = obj.progress.score;
					this.setState({trophies:x});
			} 
			
			// this.
			// try {
			// 	const value = await AsyncStorage.getItem('@LocalScores:status');
			// 	if (value !== null){
			// 		// We have data!!
			// 		console.log('status: ' + value);
			// 	} else {
			// 		await AsyncStorage.setItem('@LocalScores:status', this.state.gameData.code_name_id);
			// 	}
			// } catch (error) {
			// 	// Error retrieving data
			// 	console.log(error);
			// }
			// record the result in local storage for the trophies screen
			// try {
			// 	await AsyncStorage.setItem('@LocalScores:', 'I like to save it.');
			// } catch (error) {
			// 	// Error saving data
			// }
			// console.log('POSTING THIS GRADE DATA: ' + this.state.gameData.code_name_id);
			// console.log(this.state.trophies);
			// console.log(post);
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
	}

	//componentDidMount() {}

	getIcon(code) {
        code = code.match(/[10]$/) === null ? code + 1 : code;
        switch(code) {
            case 'snail1':       return require('../assets/snail-on.png');
            case 'snail0':       return require('../assets/snail-off.png');
            case 'woodlouse1':   return require('../assets/woodlouse-on.png');
            case 'woodlouse0':   return require('../assets/woodlouse-off.png');
            case 'bird1':        return require('../assets/bird-on.png');
            case 'bird0':        return require('../assets/bird-off.png');
            case 'beetle1':      return require('../assets/beetle-on.png');
            case 'beetle0':      return require('../assets/beetle-off.png');
            case 'mouse1':       return require('../assets/mouse-on.png');
            case 'mouse0':       return require('../assets/mouse-off.png');
            case 'plant1':       return require('../assets/plant-on.png');
            case 'plant0':       return require('../assets/plant-off.png');
            case 'human1':       return require('../assets/human-on.png');
            case 'human0':       return require('../assets/human-off.png');
            case 'worm1':        return require('../assets/worm-on.png');
            case 'worm0':        return require('../assets/worm-off.png');
            case 'fungus1':      return require('../assets/fungus-on.png');
            case 'fungus0':      return require('../assets/fungus-off.png');
            case 'tree0':        return require('../assets/tree-off.png');
            default:             return require('../assets/tree-on.png');
        }
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

		const game = <Game gameData={this.state.gameData} updateState={this.updateState.bind(this)}/>;
		//let gcid = typeof this.state.gameData.code_name_id === 'undefined' ? -1 : this.state.gameData.code_name_id;
		//gameCodeID={this.state.gameData.code_name_id}
		const grade = <Grade getIcon={this.getIcon.bind(this)} progress={this.state.progress} gameCodeID={this.state.gameData.code_name_id} codeMap={this.state.codeMap} updateState={this.updateState.bind(this)} styles={styles}/>;
		const trophies = <Trophies getIcon={this.getIcon.bind(this)} trophies={this.state.trophies} codeMap={this.state.codeMap} updateState={this.updateState.bind(this)} styles={styles}/>;
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
							(this.state.scene == 'grade' ? grade : 
								(this.state.scene == 'trophies' ? trophies : <View><Text>Screen not defined</Text></View>)
							)
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
	buttonTouchableTrophy: {
		padding: 16,
		backgroundColor: '#ccc',
		margin:20,
		//flex:1,
		alignItems:'center',
		//textAlign:'center',
		//height:60,
		//zIndex:10,
	},
	buttonTextTrophy: {
		color:'#fff',
		fontWeight:'bold',
		fontSize:15, /* */
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