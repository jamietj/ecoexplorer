import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    TouchableHighlight,
} from 'react-native';

export default class Trophies extends Component{

    constructor(props){
        super(props);
    }

    play() {
        this.props.updateState({scene:'cam'});
    }

    render(){
        //console.log(this.props.codeMap);
        const icons = this.props.codeMap.map((code, index) => 
            <Image 
                key={index} 
                style={{width:60,height:60,margin:8}} 
                source={this.props.getIcon(this.getIconCode(code, index + 1))} 
                resizeMode="contain"
            />
        ); 
        return (
            <View style={{backgroundColor:'rgba(255,255,255,.7)',padding:30,margin:20,alignItems:'center'}}>
                <Text style={{fontSize:30,marginBottom:20}}>My Trophies</Text>
                <View style={{ 
                    backgroundColor:'rgba(160,191,87,.4)', 
                    padding:12, 
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap:'wrap'
                }}>
                    {icons}
                </View>
                <TouchableHighlight style={[this.props.styles.buttonTouchable]} onPress={this.play.bind(this)}>
                    <Text style={this.props.styles.buttonText}>Keep Exploring</Text>
                </TouchableHighlight>
            </View>
        );
    } //backgroundColor:'#a0bf57'160,191,87 - 0,171,77

    getIconCode(code, index) {
        let i = index.toString();
        if (typeof this.props.trophies[i] !== 'undefined' && this.props.trophies[i] === 1) {
            return code + '1';
        } else {
            return code + '0';
        }
    }
}