import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
import Dragable from './Dragable';
import Dropable from './Dropable';

export default class Game extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            dropzones:[],
            orientation:'PORTRAIT',
            url:"http://eco-explorer.org/img/new/tasks/",
            gameData:props.gameData,
        };
        this.state.gameData.dragableLayouts = [];
        //console.log(this.props);
        // this.state.data = {
        //     drag:['a','b'],
        //     drop:['c','d','e','f','g','h']
        // };
    }

    isDropZone(gesture){    
        var isDrop = false;
        //console.log(this.state.dropzones);
        for (var id in this.state.dropzones) {
            console.log("Checking dz: " + id);
            var dz = this.state.dropzones[id];
            if (gesture.moveY > dz.top && gesture.moveY < (dz.top + dz.height) && gesture.moveX > dz.left && gesture.moveX < (dz.left + dz.width)) {
                isDrop = id;
                console.log("MATCH " + id);
                break;
            }
        };
        return isDrop ? this.state.dropzones[isDrop] : isDrop;
       // var dz = this.state.dropzone;
       // return gesture.moveY > dz.top && gesture.moveY < (dz.top + dz.height) && gesture.moveX > dz.left && gesture.moveX < (dz.left + dz.width);
    }
    //_onLayout = event => this.props.appLayout(event.nativeEvent.layout);
    _onLayout(e) {
        const {width, height} = e.nativeEvent.layout;
        const orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
        Window = Dimensions.get('window');
        this.setState({orientation:orientation});
        //styles.mainContainer.flexDirection = orientation == 'PORTRAIT' ? 'column' : 'row';
        console.log("ORIENTATION CHANGE TO " + orientation);
    //    console.log(Window);
       // console.log(styles);
       // console.log(e.nativeEvent.layout);
       
    }
    dragShadowLayout(e) {
        let x = e.nativeEvent.layout;
        x.y += Window.height/2;
        x.top = x.y;
        x.left= x.x;
        delete x.x;
        delete x.y;
        // console.log("DRAG");
        // console.log( x);
        
        this.state.gameData.dragableLayouts.push(x);
    }

    render(){
        /*let d = JSON.stringify(this.props.gameData);
        console.log(d);
        //console.log(this.props.gameData.template_id);
        switch(1) {
            // template 1 is 2 drop at top, 4 drag at bottom
            case 1: return (
                <View style={[styles.mainContainer,{flexDirection:(this.state.orientation == 'PORTRAIT' ? 'column' : 'row')}]} onLayout={this._onLayout.bind(this)}>
                    <View style={styles.dropzones}>
                    {d.data['t01-00-01'].map((data, index) => 
                        <Dropable key={index} id={index} styles={styles} registerDropZone={this.registerDropZone.bind(this)} data={this.props.gameData.data} />
                    )}
                    </View>
                    <View style={styles.dragzones}/>
                    {this.state.data.drag.map((key) => 
                        <Dragable key={key} id={key} styles={styles} orientation={this.state.orientation} isDropZone={this.isDropZone.bind(this)} />
                    )}
                    <TouchableHighlight style={styles.buttonTouchable} onPress={() => this.props.updateState({scene:'cam'})}>
                        <Text style={styles.buttonText}>Back to scan</Text>
                    </TouchableHighlight>
                </View>
            );
            case 2: break; data={this.props.gameData.data}
        }*/ 
        // if (typeof this.props.gameData !== 'undefined') {
        //     console.log(this.props.gameData.key_objective_id);
        // } test={typeof this.props.gameData !== 'undefined' ? this.props.gameData : {}}

        // work out where the dragables and dropables are in the data
        // let dragables = [], dropables = [];
        // for(var i in this.props.gameData.data) {
        //     console.log(i);
        //     console.log(this.props.gameData.data[i]);

        // }
        // this.props.gameData.data.map((data, index) => {
        //     console.log(index);
        //     console.log(data);
            
        // });
       // return();
     //   console.log(this.props.gameData.template_id);
        let v = 't01-00-01';
        let w = 't01-00-00';
      //  console.log(this.props.gameData.data[v]);
        // if (this.props.gameData.template_id == '1') {
            
        // },{flexDirection:(this.state.orientation == 'PORTRAIT' ? 'column' : 'row')}
/*
                <View style={styles.dropzones}>
                {this.props.gameData.data[v].map((data, index) => 
                    <Dropable 
                        key={v + '-' + i} 
                        id={v + '-' + i++} 
                        styles={styles} 
                        registerDropZone={this.registerDropZone.bind(this)}  
                        data={data}
                        imgBase={this.state.url}/>
                )}
                </View>
                <View style={styles.dragzones}/>
                {this.props.gameData.data[w].map((data, index) => 
                    <Dragable 
                        key={v + '-' + i} 
                        id={v + '-' + i++}  
                        styles={styles} 
                        orientation={this.state.orientation} 
                        isDropZone={this.isDropZone.bind(this)} 
                        data={data}
                        imgBase={this.state.url}
                        templateID={this.props.gameData.template_id}/>
                )}
                <TouchableHighlight style={styles.buttonTouchable} onPress={() => this.props.updateState({scene:'cam'})}>
	 				<Text style={styles.buttonText}>Back to scan</Text>
	 			</TouchableHighlight>
*/

        let i = 0,j=0;
        
        // limit to 4 dragables for template 1
        if (this.state.gameData.template_id == 1) {
            let tmp = [];
            for (var x in this.state.gameData.data[w]) {
                if (x < 4) {
                    tmp.push(this.state.gameData.data[w][x]);
                }
                // console.log(x);
                // console.log(this.state.gameData.data[w][x]);
            }
            //this.setState({gameData:{data:{}}})
            this.state.gameData.data[w] = tmp;
            console.log(this.state.gameData.data[w]);
        }
        //return null;
        return (
            <View style={[styles.mainContainer]} onLayout={this._onLayout.bind(this)}>
                <View style={styles.dropArea}>
                {this.state.gameData.data[v].map((data, index) => 
                    <Dropable 
                        key={v + '-' + i} 
                        id={v + '-' + i++} 
                        styles={styles} 
                        registerDropZone={this.registerDropZone.bind(this)}  
                        data={data}
                        imgBase={this.state.url}/>
                )}
                </View>
                <View style={styles.dragArea}>
                    {this.state.gameData.data[w].map((data, index) => 
                        <View key={i++} style={styles.dragable} onLayout={this.dragShadowLayout.bind(this)}/>
                    )}
                </View>
               {this.state.gameData.data[w].map((data, index) => 
                    <Dragable 
                        key={v + '-' + i} 
                        id={v + '-' + i++}  
                        styles={styles} 
                        layout={this.state.gameData.dragableLayouts.pop()}
                        orientation={this.state.orientation} 
                        isDropZone={this.isDropZone.bind(this)} 
                        data={data}
                        imgBase={this.state.url}
                        templateID={this.state.gameData.template_id}/>
                )}
                
            </View>
        );
    } //
    registerDropZone(e) {
        //console.log(e);
        var dzs = this.state.dropzones;
        dzs[e.id] = e;
        this.setState({dropzones:dzs});
    }
}
 /*
  {this.state.gameData.data[w].map((data, index) => 
                    <Dragable 
                        key={v + '-' + i} 
                        id={v + '-' + i++}  
                        styles={styles} 
                        layout={this.state.gameData.dragableLayouts}
                        orientation={this.state.orientation} 
                        isDropZone={this.isDropZone.bind(this)} 
                        data={data}
                        imgBase={this.state.url}
                        templateID={this.state.gameData.template_id}/>
                )}
 {this.state.gameData.data[w].map((data, index) => 
                    <Dragable 
                        key={v + '-' + i} 
                        id={v + '-' + i++}  
                        styles={styles} 
                        orientation={this.state.orientation} 
                        isDropZone={this.isDropZone.bind(this)} 
                        data={data}
                        imgBase={this.state.url}
                        templateID={this.state.gameData.template_id}/>
                )}*/
                // {this.state.data.drag.map((key) => 
                //     <Dragable key={key} id={key} styles={styles} orientation={this.state.orientation} isDropZone={this.isDropZone.bind(this)} />
                // )}

let CIRCLE_RADIUS = 60; // 36
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        flexDirection: 'column',
        backgroundColor:'rgba(0,50,100,.5)',
    },
    dragArea: {
        flex:1,
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row',
        flexWrap: 'wrap',
        backgroundColor:'rgba(0,100,50,.5)',
        // overflow:'visible',
        // position:'absolute',
    },
    dropArea: {
        flex:1,
        alignItems:'stretch',
        justifyContent:'space-around',
        backgroundColor: 'rgba(100,50,0,.5)',
        position:'relative',
        flexDirection:'row',
    },
    dropable: {
        borderWidth:2,
        borderColor:'#444',
        borderStyle:'dashed',
        margin:20,
        flex:1,
      //  backgroundColor:'rgba(255,255,255,.5)',
    },
    ddtext        : {
        textAlign   : 'center',
        color       : '#fff',
        width:'100%',
        padding:5,
        backgroundColor:'rgba(0,0,0,0.5)',
    },
    dragable: {
                width:120,
                height:120, 
			/*	flex:1;
				display:flex;*/
                borderWidth:2,
                borderColor:'#444',
                margin:10,
				backgroundColor:'rgba(0,0,0,.5)',
              //  position:'absolute',
            },
    // mainContainer: {
    //     flex    : 1,
    //     flexDirection: 'row',
    //     alignItems:'stretch',
    //     justifyContent: 'center',
    //     width:'100%',
    //     height:'100%',
    //     backgroundColor:'rgba(0,50,100,.5)',
    //     position:'relative',
    // },
    dragzones: {
        position:'absolute',
     //   backgroundColor:'rgba(0,50,100,.5)',
        //height:'50%',
        flex:1,
        height:'100%',
        marginTop:'50%',
        flexDirection:'row',
        backgroundColor:'rgba(0,100,50,.5)',
    },
    dropzones: {
        //position:'absolute',
        backgroundColor:'rgba(100,50,0,.5)',
        height:'50%',
      //  width:'100%',
        flex:1,
        alignItems:'center',
        justifyContent: 'space-around',
        flexWrap:'wrap',
        flexDirection:'row',
        
       // width:'50%',
    },
    dropZone    : {
      //  height         : 100,
        backgroundColor:'#2c3e50',
        //flexGrow:1,
       // margin:100,
      // width:'50%',
       flex:1,
       alignItems:'center',
        justifyContent: 'center',
        flexDirection:'row',
       // margin:10,
       // padding:10,
        minWidth:100,
        minHeight:100,
        flexGrow:1,
    },
    // text        : {
    //     marginTop   : 25,
    //     marginLeft  : 5,
    //     marginRight : 5,
    //     textAlign   : 'center',
    //     color       : '#fff'
    // },
    draggable: {
        //position    : 'absolute',
    },
    draggableContainer: {
        position    : 'absolute',
        top         : Window.height/2 - CIRCLE_RADIUS,
        left        : Window.width/2 - CIRCLE_RADIUS,
    },
    ap: {
        position    : 'absolute',
        top         : ((Window.height/5) * 4) - CIRCLE_RADIUS,
        left        : ((Window.width/5) * 4) - CIRCLE_RADIUS,
    },
    bp: {
        position    : 'absolute',
        top         : ((Window.height/5) * 3) - CIRCLE_RADIUS,
        left        : ((Window.width/5) * 2)- CIRCLE_RADIUS,
    },
    al: {
        position    : 'absolute',
        top         : ((Window.height/5) * 1) - CIRCLE_RADIUS,
        left        : ((Window.width/5) * 4) - CIRCLE_RADIUS,
    },
    bl: {
        position    : 'absolute',
        top         : ((Window.height/5) * 2) - CIRCLE_RADIUS,
        left        : ((Window.width/5) * 3)- CIRCLE_RADIUS,
    },
    circle      : {
        backgroundColor     : '#1abc9c',
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        borderRadius        : CIRCLE_RADIUS,
    },
    filler: {
        left:0,
        top:0,
        right:0,
        bottom:0,
        position:'absolute',
        backgroundColor:'#ccc',
        borderRadius:CIRCLE_RADIUS,
        borderWidth:2,
        borderColor:'#aaa'
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
});