import React, {Component} from 'react'
import {
    View,
    Text,
    Image
} from 'react-native';

export default class Dropable extends Component{

    constructor(props){
        super(props);
        this.state = {
            originX:null,
            originY:null,
            left:null,
            top:null,
            width:null,
            height:null
        };
     //   console.log(this.props.data);
    }

    setDropZone(event){      
        let l = event.nativeEvent.layout;
        this.setState({
            originX:l.x + (l.width / 2),
            originY:l.y + (l.height / 2),
            left:l.x,
            top:l.y,
            width:l.width,
            height:l.height,
            id:this.props.id
        }, () => this.props.registerDropZone(this.state)); // register layout upstream
     //   console.log("Layout dropable");
       // console.log(this.state);
    }

    render(){
        const text = this.props.data.title != '' ? 
                    <Text style={[this.props.styles.ddtext]}>{this.props.data.title.replace(/\s*\<br\s*\/?\>\s*/i, ' ')}</Text>
                    : null;
        const content = this.props.data.image == '' ?
                    <Image style={{width:'100%',height:'100%',resizeMode:'cover',flex:1}} 
                        source={{uri:this.props.imgBase + this.props.data.image}}>{text}</Image> 
                    : text;
        return (
            <View 
                onLayout={this.setDropZone.bind(this)} 
                style={this.props.styles.dropable}>
                {content}
            </View>
        );
    }
}