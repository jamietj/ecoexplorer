import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    TouchableHighlight,
} from 'react-native';

export default class Grade extends Component{

    constructor(props){
        super(props);
    }

    play() {
        this.props.updateState({scene:'cam'});
    }

    trophies() {
        this.props.updateState({scene:'trophies'});
    }

    render(){
        let score = parseInt(this.props.progress.score * 100);
        let scText = score > 70 ? "Well done!" : (score > 30 ? 'OK!' : "Keep trying!");
        let gameCode = 'unknown';
        try {
            gameCode = this.props.codeMap[parseInt(this.props.gameCodeID) - 1];
        } catch(e) {
            console.log(e);
        }
        const trophy = (score == 100) ? 
            <View style={{alignItems:'center'}}>
                <Image style={{width:50,height:50}} source={this.props.getIcon(gameCode)} resizeMode="contain"/>
                <Text style={[this.props.styles.buttonTextTrophy,{marginTop:10,textAlign:'center'}]}>You won the {gameCode} trophy</Text>
            </View>
            : 
            <Text style={this.props.styles.buttonTextTrophy}>View Trophies</Text>
        ;
        //console.log(this.props);
        return (
            <View style={{backgroundColor:'rgba(255,255,255,.7)',padding:40,paddingLeft:30,paddingRight:30,alignItems:'center',maxWidth:'95%'}}>
                <Text style={{fontSize:30,marginBottom:20}}>Score</Text>
                <Text style={{fontSize:50,marginBottom:20}}>{score}%</Text>
                <Text style={{fontSize:30,marginBottom:20}}>{scText}</Text>
                <TouchableHighlight style={[this.props.styles.buttonTouchableTrophy,{backgroundColor:'#a0bf57'}]} onPress={this.trophies.bind(this)}>
                    {trophy}
                </TouchableHighlight>
                <TouchableHighlight style={[this.props.styles.buttonTouchable]} onPress={this.play.bind(this)}>
                    <Text style={this.props.styles.buttonText}>Keep Exploring</Text>
                </TouchableHighlight>
            </View>
        );
    }
}