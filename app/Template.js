import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Dimensions
} from 'react-native';
import Dragable from './Dragable';
import Dropable from './Dropable';

export default class Template extends Component{
    constructor(props){
        super(props);

        this.state = {
            dropzones:[],
            orientation:'PORTRAIT'
        };
        this.state.data = {
            drag:['a','b'],
            drop:['c','d','e','f','g','h']
        };
    }

    render(){
        return (
            <View style={[styles.mainContainer,{flexDirection:(this.state.orientation == 'PORTRAIT' ? 'column' : 'row')}]} onLayout={this._onLayout.bind(this)}>
                <View style={styles.dropzones}>
                {this.state.data.drop.map((key) => 
                    <Dropable key={key} id={key} styles={styles} registerDropZone={this.registerDropZone.bind(this)} />
                )}
                </View>
                <View style={styles.dragzones}/>
                {this.state.data.drag.map((key) => 
                    <Dragable key={key} id={key} styles={styles} orientation={this.state.orientation} isDropZone={this.isDropZone.bind(this)} />
                )}
            </View>
        );
    } //
}