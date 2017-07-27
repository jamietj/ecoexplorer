import React, {Component} from 'react'
import {
    View,
    Text,
    PanResponder,
    Animated,
    Image
} from 'react-native';

export default class Dragable extends Component{

    constructor(props){
        super(props);
        this.state = {
            originX:null,
            originY:null,
            dropped:false,
            pan: new Animated.ValueXY(),
            currentDropzone:null,
            zindex:{zIndex:0},
            layout:this.props.layout,
            index:this.props.data.index,
        };
//console.log(this.state);
        this.panResponder = PanResponder.create({    
            onStartShouldSetPanResponder : () => {
                this.setState({zindex:{zIndex:1000}});
                this.props.setDraging(true);
                return true;
            },
            onPanResponderMove           : Animated.event([null,{ 
                dx : this.state.pan.x,
                dy : this.state.pan.y
            }]),
            onPanResponderRelease        : (e, gesture) => {
                let x = 0, y = 0, dropzone = this.props.isDropZone(gesture, this.state.index), dzenter = false, dzleave = false, dzchange = false;
                if(dropzone !== false && !this.state.dropped){ 
                 //   console.log("DZ-ENTER");
                    x = dropzone.originX - this.state.originX;//(this.props.Window.width / 2); // where we want to be - where 0,0 was
                    y = dropzone.originY - this.state.originY;//(this.props.Window.height / 2);
                    this.setState({dropped:true, currentDropzone:dropzone});
                    dzenter = true;
                } else if (this.state.dropped && dropzone === false) {
                 //   console.log("DZ-LEAVE");
                    x = this.state.originX - this.state.currentDropzone.originX; // where we want to be - where 0,0 was
                    y = this.state.originY - this.state.currentDropzone.originY;
                    this.setState({dropped:false, currentDropzone:null});
                   // this.props.setDraging(true);
                    dzleave = true;
                } else if (this.state.dropped && dropzone !== false && this.state.currentDropzone != dropzone) {
                //    console.log("DZ-CHANGE");
                    x = dropzone.originX - this.state.currentDropzone.originX; // where we want to be - where 0,0 was
                    y = dropzone.originY - this.state.currentDropzone.originY;
                    this.setState({currentDropzone:dropzone});
                    dzchange = true;
                }

                Animated.spring(
                    this.state.pan, {
                        toValue:{x:x,y:y},
                        velocity:5,
                        tension:20,
                        friction:2,
                        overshootClamping:true,
                        restDisplacementThreshold: 5,
                        restSpeedThreshold: 5
                    }
                ).start(() => {
                    if (dzenter || dzleave || dzchange) {
                  //      console.log("RESETTING ORIGIN");
                        this.state.pan.setOffset({x: this.currentPanValue.x, y: this.currentPanValue.y});
                        this.state.pan.setValue({x: 0, y: 0});
                        this.setState({zindex:{zIndex:0}});
                   //     this.props.setDraging(false);
                    }
                });
            } 
        });
    }

    componentDidMount() {
        this.currentPanValue = {x: 0, y: 0};
        this.panListener = this.state.pan.addListener((value) => this.currentPanValue = value);
    }

    componentWillUnmount() {
        this.state.pan.removeListener(this.panListener);
    }

    logLayout(event) {
       // let l = event.NativeProps;
       // THIS IS A BAD HACK TO GET THE PANRESPONDER TO REPORT IT'S POSITION AFTER LAYOUT
        this.refs.mc.measure((ox, oy, width, height, px, py) => { 
            this.setState({
                originX:px + (width/2),
                originY:py + (height/2)
            });
          //  console.log("setStuff");
          //  console.log(ox + ", " + oy + ", "+ width + ", " + height + ", " + px + ", " + py + ", ");
        });
     //   console.log("Layout dragable");
    }

    render(){ 
        const text = this.props.data.title != '' ? 
                    <Text style={[this.props.styles.ddtext]}>{this.props.data.title.replace(/\<br.{0,2}\>/i, '')}</Text>
                    : null;
        const content = this.props.data.image != '' ?
                    <Image 
                        style={[this.props.styles.dragImage,this.props.styles.circle]} 
                        borderRadius={this.props.circleRadius}
                        source={{uri:this.props.imgBase + this.props.data.image}}>{text}</Image> 
                    : text;
        // this.props.styles[this.props.id + (this.props.orientation == 'PORTRAIT' ? 'p' : 'l')] ,margin:-10

        let l = {},
        top = this.props.window.height / 2,
        height = top,
        width = this.props.window.width,
        winDiv = 40,
        c1l = (width / 4.5) - this.props.circleRadius;
        c2l = width - (c1l + (2 * this.props.circleRadius) + 20);
        r2t = this.props.window.height - (this.props.circleRadius * 3);

        switch(this.state.index) {
            case 0: //tl
                l = {
                    left:c1l,
                    top: top 
                }
            break;
            case 1: //tr
                l = {
                    left:c2l,
                    top:top
                }
            break;
            case 2: //bl
                l = {
                    left:c1l,
                    top:r2t
                }
            break;
            case 3: //br
                l = {
                    left:c2l,
                    top:r2t
                }
            break;

        }
        return (
            <View style={[this.props.styles.dragable,l, {position:'absolute'}]}>
                <View style={[this.props.styles.filler]} ref="mc" onLayout={this.logLayout.bind(this)} />
                <Animated.View 
                    {...this.panResponder.panHandlers}                   
                    style={[this.state.pan.getLayout(), this.props.styles.circle, this.state.zindex]}>     
                    {content}
                </Animated.View>
            </View>
        );
    }
}