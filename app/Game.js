import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Easing,
    Dimensions,
    TouchableHighlight,
    Platform,
} from 'react-native';
import Dragable from './Dragable';
import Dropable from './Dropable';

export default class Game extends Component{
 
    constructor(props){
        super(props);
        //console.log(props);
        this.state = {
            dropzones:[],
            dragables:[],
            progress:{},
            orientation:'PORTRAIT',
            //url:"http://eco-explorer.org/img/new/tasks/",
            url:"https://app.eco-explorer.org/img/",
            gameData:props.gameData,
            gradeAvailable:false,
            taskTitleHeight:30, // set some default
         //   draging:false,
        };
        this.state.gameData.dragableLayouts = [];
        this.slideValue = new Animated.Value(-100); // initially off screen
    }
        

    isDropZone(gesture, index){    
        var isDrop = false;
       // console.log(this.state.dropzones);
        for (var id in this.state.dropzones) {
          //  console.log("Checking dz: " + id);
            var dz = this.state.dropzones[id];
            if (gesture.moveY > dz.top && gesture.moveY < (dz.top + dz.height) && gesture.moveX > dz.left && gesture.moveX < (dz.left + dz.width)) {
                isDrop = id;
             //   console.log("MATCH " + id + ", INDEX: " + index);
                
                // now we can calculate if they have completed the task and their score
                this.state.dragables[index].dropped = dz.index;
            //    console.log("Setting dragable " + index + " to dropped=" + dz.index);
            //    console.log(this.state.dragables[index]);
                break;
            } else {
               // console.log(gesture);
               // console.log(dz);
            }
        };
        // if this dragable is not in a dropzone then set its state
        if (isDrop === false) {
         //   console.log("Setting dragable " + index + " to dropped=FALSE");
            this.state.dragables[index].dropped = false;
        }
        // we can now check to see if they have completed the task
        let completed = true, numDragables = this.state.dragables.length, correct = 0, score = 0;
        for(var i in this.state.dragables) {
            
            var dg = this.state.dragables[i];
           // console.log(dg);
            if (dg.dropped === false) {
                completed = false;
            } else if (dg.dropped === dg.target) {
                correct++;
            }
        }
        score = numDragables == 0 ? 0 : correct / numDragables;
        let result = {completed:completed,num:numDragables,correct:correct,score:score};
        this.setState({progress:result})

        // show a grade / ok / check button
        if (result.completed) {
     //       console.log('COMPLETED');
            this.setState({gradeAvailable:false}, this.slide);
        }
        return isDrop ? this.state.dropzones[isDrop] : isDrop;
    }
    //_onLayout = event => this.props.appLayout(event.nativeEvent.layout);
    _onLayout(e) {
        const {width, height} = e.nativeEvent.layout;
        const orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
        Window = Dimensions.get('window');
        this.setState({orientation:orientation});
        //styles.mainContainer.flexDirection = orientation == 'PORTRAIT' ? 'column' : 'row';
  //      console.log("ORIENTATION CHANGE TO " + orientation);

       
    }
    dragShadowLayout(e) {
        let x = e.nativeEvent.layout;
        x.y += Window.height/2;
        x.top = x.y;
        x.left= x.x;
        delete x.x;
        delete x.y;

        this.state.gameData.dragableLayouts.push(x);
    }

    componentDidMount() {
        // set all the dropped flags after init (render) otherwise we can't update them properly
        for(var i in this.state.dragables) {
            this.state.dragables[i].dropped = false;
        }
    }

    slide() {
       //console.log('SLIDING');
       let tv = 100; // showing
       if (this.state.gradeAvailable) {
           //this.slideValue.setValue(200);
           tv = -100; // hidden
       }
        Animated.timing(
            this.slideValue, {
                toValue: tv,
                duration: 300,
                easing: Easing.linear
            }
        ).start(() => {
            this.setState({gradeAvailable:true});
        });//() => this.slide()
    }

    setDraging(draging) {
        if (this.state.progress.completed) {
    //        console.log("RETRACTING");
            this.slide();
        }
    }

    layoutTitle(e){
       // console.log("LAYOUT-TITLE")
       // console.log(e.nativeEvent.layout);
        this.setState({taskTitleHeight:e.nativeEvent.layout.height});
    }

    play() {
        this.props.updateState({scene:'cam'});
    }

    render(){
        let i = 0, drag = 't01-00-00', drop = 't01-00-01', mainCStyle = {}, dragCStyle = {}, dropCStyle = {}, tmp = []; 

        switch(this.state.gameData.template_id) {
            case '1': 
                drag = 't01-00-00'; 
                drop = 't01-00-01';
                // limit to 4 dragables for template 1
                for (var item in this.state.gameData.data[drag]) {
                    if (item < 4) {
                        let dp = this.state.gameData.data[drag][item];
                        dp.index = parseInt(item);
                        dp.target = parseInt(dp.target);
                     //   dp.dropped = false; // do this in componentDidMount
                        tmp.push(dp);
                        this.state.dragables[item] = dp;
                    }
                }
                this.state.gameData.data[drag] = tmp;
                mainCStyle = styles.mainContainer; 
                dragCStyle = styles.dragArea; 
                dropCStyle = styles.dropArea;
            break;
            case '2':
                drag = 't02-00-00'; 
                drop = 't02-00-02';
                for (var item in this.state.gameData.data[drag]) {
                //    if (item < 4) {
                        let dp = this.state.gameData.data[drag][item];
                        dp.index = parseInt(item);
                        dp.target = parseInt(dp.target);
                     //   dp.dropped = false; // do this in componentDidMount
                        tmp.push(dp);
                        this.state.dragables[item] = dp;
                //    }
                }
                this.state.gameData.data[drag] = tmp;
                mainCStyle = styles.mainContainer2; 
                dragCStyle = styles.dragArea2; 
                dropCStyle = styles.dropArea2;
            break;
        }

//  <View style={[styles.dropAreaWrap]}></View>
// <Text style={{padding:5,backgroundColor:'rgba(255,255,255,.7)',textAlign:'center'}}>{this.props.gameData.title.replace(/\<br.{0,2}\>/i, '')}</Text>
          //,marginTop:Platform.OS === 'ios' ? 20 : 0         
        if (typeof this.state.gameData.data[drop] === 'undefined' || typeof this.state.gameData.data[drag] === 'undefined') {
            return (
                <View style={{width:'80%',height:'80%',backgroundColor:'rgba(255,255,255,.7)',paddingTop:'30%'}}>
                    <Text style={{marginBottom:40,fontSize:20,textAlign:'center'}}>Oops, something went wrong!</Text>
                    <TouchableHighlight style={[styles.buttonTouchable]} onPress={this.play.bind(this)}>
                        <Text style={styles.buttonText}>Please try again</Text>
                    </TouchableHighlight>
                </View>
            );
        }
        return (
            <View style={{flex:1,flexDirection: 'column'}} onLayout={this._onLayout.bind(this)}>
                <Text onLayout={this.layoutTitle.bind(this)} style={{padding:5,backgroundColor:'rgba(255,255,255,.7)',textAlign:'center'}}>{this.props.gameData.title.replace(/\s*\<br\s*\/?\>\s*/i, ' ')}</Text>
                <View style={[mainCStyle]}>
                     
                     <View style={[dropCStyle]}> 
                        {this.state.gameData.data[drop].map((data, index) => 
                            <Dropable 
                                key={drop + '-' + i} 
                                id={drop + '-' + i++} 
                                styles={styles} 
                                registerDropZone={this.registerDropZone.bind(this)}  
                                data={data}
                                imgBase={this.state.url}/>
                        )}
                    </View>
                
                    <View style={dragCStyle}>
                        {this.state.gameData.data[drag].map((data, index) => 
                            <View key={i++} style={styles.dragable} onLayout={this.dragShadowLayout.bind(this)}/>
                        )}
                    </View>
                    {this.state.gameData.data[drag].map((data, index) => 
                            <Dragable 
                                key={drag + '-' + i} 
                                id={drag + '-' + i++}  
                                window={Window}
                                circleRadius={CIRCLE_RADIUS}
                                styles={styles} 
                                setDraging={this.setDraging.bind(this)}
                                layout={this.state.gameData.dragableLayouts.pop()}
                                orientation={this.state.orientation} 
                                isDropZone={this.isDropZone.bind(this)} 
                                data={data}
                                imgBase={this.state.url}
                                templateID={this.state.gameData.template_id}
                                getDropZoneByIndex={this.getDropZoneByIndex.bind(this)}/>
                    )}
                    <Animated.View ref="grade" style={{position:'absolute', width:'100%',paddingBottom:10,paddingTop:10,bottom:this.slideValue,flex:1,alignItems:'center',zIndex:2000}}>
                        <TouchableHighlight style={[styles.gradeButton]} onPress={this.grade.bind(this)}>
                            <Text style={styles.gradeButtonText}>OK</Text>
                        </TouchableHighlight>
                    </Animated.View>
                    
                </View>
                
            </View>
        );
    } 

    grade() {
      //  console.log("PROGRESS---")
      //  console.log(this.state.progress);
        this.props.updateState({progress:this.state.progress,scene:'grade'});
    }
    
    registerDropZone(e) {
       // console.log("REGISTERING DZ");
       // console.log(e);
        var dzs = this.state.dropzones;
        e.index = parseInt(e.id.replace(/.*\-/,''));
        e.top += this.state.taskTitleHeight;
        e.originY += this.state.taskTitleHeight;
        dzs[e.id] = e;
       // console.log(e);
        this.setState({dropzones:dzs});
    }

    getDropZoneByIndex(i) {
        let count = 0, res = {};
      //  console.log('GETTING DZ BY ID');
        for (var id in this.state.dropzones) {
      //      console.log("Checking dz: " + id);
            var dz = this.state.dropzones[id];
            if (dz.index == i) {
       //         console.log('SUCCESS');
                res = dz;
            }
        }
        return res;
    }

}


let CIRCLE_RADIUS = 65; // 36
let Window = Dimensions.get('window');
let ecoBrown = '140,63,9';//181,81,23';
//let ecoOrange = '216,123,27';
let ecoOrange = '121,68,30';
let styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        flexDirection: 'column',
        // backgroundColor:'rgba(0,50,100,.5)',
    },
    mainContainer2: {
        flex:1,
        flexDirection: 'row',
        // backgroundColor:'rgba(0,50,100,.5)',
    },
    dragArea: {
        flex:1,
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row',
        flexWrap: 'wrap',
      //  backgroundColor:'rgba(0,0,0,.5)',
    },
    dragArea2: {
        flex:1,
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row',
        flexWrap: 'wrap',
    },
    dropArea: {
        flex:1,
        alignItems:'stretch',
        justifyContent:'space-around',
        //backgroundColor: 'rgba(100,50,0,.5)',
        position:'relative',
        flexDirection:'row',
     //   maxHeight:'35%',
        
    },
    dropArea2: {
        flex:1,
        alignItems:'stretch',
        justifyContent:'space-around',
        //backgroundColor: 'rgba(100,50,0,.5)',
        position:'relative',
        flexDirection:'column',
    },
    // dropAreaWrap: {
    //     flex:1,
    //   //  alignItems:'stretch',
    //     //justifyContent:'space-around',
    //     //backgroundColor: 'rgba(100,50,0,.5)',
    //     position:'relative',
    //     flexDirection:'row',
    // },
    dropable: {
      //  borderWidth:2,
       // borderColor:'rgba('+ecoBrown+',.7)',
      //  borderStyle:'dashed',
        margin:10,
        flex:1,
        backgroundColor:'rgba('+ecoBrown+',.2)',
      
      //  backgroundColor:'rgba(255,255,255,.5)',
    },
    dragable: {
        width:CIRCLE_RADIUS*2,
        height:CIRCLE_RADIUS*2, 
     //    borderWidth:2,
     //    borderColor:'#444',
        margin:10,
    //     backgroundColor:'rgba(0,0,0,.5)',
    //     //flex:1,
    //     //  position:'absolute',
    },
    ddtext        : {
        textAlign   : 'center',
        color       : '#fff',
        width:'100%',
        padding:5,
        backgroundColor:'rgba('+ecoOrange+',.7)',
        fontWeight:'bold',
        position:'absolute',
        bottom:0,
    },
    // ddtextIOS : {
        
    // },
    dragImage: {
        width:'100%',
        height:'100%',
        resizeMode:'cover',
        flex:1,
        justifyContent:'flex-end',
        borderRadius:20,
    },
 
    draggableContainer: {
        position    : 'absolute',
        top         : Window.height/2 - CIRCLE_RADIUS,
        left        : Window.width/2 - CIRCLE_RADIUS,
    },
 
    circle      : {
     //   backgroundColor     : '#1abc9c',
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
     //   borderRadius        : Platform.OS === 'ios' ? 0 : CIRCLE_RADIUS,
        borderRadius        : CIRCLE_RADIUS,
    },
    filler: {
        left:0,
        top:0,
        right:0,
        bottom:0,
        position:'absolute',
     //   backgroundColor:'rgba('+ecoBrown+',0.2)',
     //   borderRadius:Platform.OS === 'ios' ? 0 : CIRCLE_RADIUS,
        borderRadius        : CIRCLE_RADIUS,
     //   borderWidth:2,
     //   borderColor:'rgba('+ecoBrown+',0.5)'
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
    gradeButton: {
        backgroundColor: '#00AB4D',
        alignItems:'center',
      //  flex:1,
        justifyContent:'center',
        padding:10,
        width:'80%',   
        margin:10,     
    },
    gradeButtonText: {
        color:'#fff',
		fontWeight:'bold',
		fontSize:20,
      //  position:'absolute',
    }
});