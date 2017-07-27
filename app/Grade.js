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
    render(){
        let score = parseInt(this.props.progress.score * 100);
        let scText = score > 70 ? "Well done!" : (score > 30 ? 'OK!' : "Keep trying!");
        return <View style={{backgroundColor:'rgba(255,255,255,.7)',padding:40,alignItems:'center'}}>
            <Text style={{fontSize:30,marginBottom:20}}>Score</Text>
            <Text style={{fontSize:50,marginBottom:20}}>{score}%</Text>
            <Text style={{fontSize:30,marginBottom:20}}>{scText}</Text>
            <TouchableHighlight style={[this.props.styles.buttonTouchable]} onPress={this.play.bind(this)}>
                <Text style={this.props.styles.buttonText}>Keep Exploring</Text>
            </TouchableHighlight>
        </View>;
    }
}