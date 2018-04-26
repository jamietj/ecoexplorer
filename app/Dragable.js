import React, {Component} from 'react'
import {
    View,
    Text,
    PanResponder,
    Animated,
    Image,
    Platform,
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
                //console.log(this.state);
                if(dropzone !== false && !this.state.dropped){ 
                    //console.log("DZ-ENTER");
                    x = dropzone.originX - this.state.originX;//(this.props.Window.width / 2); // where we want to be - where 0,0 was
                    y = dropzone.originY - this.state.originY;//(this.props.Window.height / 2);
                    //console.log('dzY:'+dropzone.originY+',dgY:'+this.state.originY+',newY:'+y);
                    this.setState({dropped:true, currentDropzone:dropzone});

                    dzenter = true;
                } else if (this.state.dropped && dropzone === false) {
                    //console.log("DZ-LEAVE");
                    x = this.state.originX - this.state.currentDropzone.originX; // where we want to be - where 0,0 was
                    y = this.state.originY - this.state.currentDropzone.originY;
                    this.setState({dropped:false, currentDropzone:null});
                   // this.props.setDraging(true);
                    dzleave = true;
                } else if (this.state.dropped && dropzone !== false && this.state.currentDropzone != dropzone) {
                    //console.log("DZ-CHANGE");
                    x = dropzone.originX - this.state.currentDropzone.originX; // where we want to be - where 0,0 was
                    y = dropzone.originY - this.state.currentDropzone.originY;
                    this.setState({currentDropzone:dropzone});
                    dzchange = true;
                } else {
                    //console.log("DZ-NO-CHANGE");
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
                     //   console.log("RESETTING ORIGIN");
                    //    console.log(this.currentPanValue.x + ',' + this.currentPanValue.y);
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
       var _self = this;
       setTimeout(() => {
            _self.refs.mc.measure((ox, oy, width, height, px, py) => { 
                _self.setState({
                    originX:px + (width/2),
                    originY:py + (height/2)
                });
              //  console.log("setStuff for index: "+ _self.state.index);
              // console.log(ox + ", " + oy + ", w:"+ width + ", h:" + height + ", ox:" + (px + (width/2))+ ", oy:" + (py + (width /2)));
                //console.log(ox + ", " + oy + ", "+ width + ", " + height + ", " + px + ", " + py + ", ");
            });
        }, 300);
     //   console.log("Layout dragable");
    }

    render(){ 
       // const ddtextIOS = Platform.OS === 'ios' ? this.props.styles.ddtextIOS : {};
      //  const ddtextIOS = this.props.styles.ddtextIOS; , ddtextIOS
        // this.props.styles[this.props.id + (this.props.orientation == 'PORTRAIT' ? 'p' : 'l')] ,margin:-10

        let extraTextStyles = {},
            l = {}, 
            width = this.props.window.width,
            wrapStyle = this.props.styles.dragable,
            circleStyle = this.props.styles.circle,
            fillerStyle = this.props.styles.filler,
            title = this.props.data.title;//.replace(/\s*\<br\s*\/?\>\s*/ig, ' ');
        switch (this.props.templateID) {
            case '1':
                let top = this.props.window.height / 2,
                    c1l = (width / 4.5) - this.props.circleRadius,
                    c2l = width - (c1l + (2 * this.props.circleRadius) + 20),
                    r2t = this.props.window.height - (this.props.circleRadius * 3);
                switch(this.state.index) {
                    case 0: l = { left:c1l, top:top }; break; //tl
                    case 1: l = { left:c2l, top:top }; break; //tr
                    case 2: l = { left:c1l, top:r2t }; break; //bl
                    case 3: l = { left:c2l, top:r2t }; break; //br
                }
            break;
            case '2':
                width = width / 2; 
                let dz = this.props.getDropZoneByIndex(this.state.index);
                l = { 
                    left: width + (((width - 20) - (2 * this.props.circleRadius)) / 2), 
                    top: dz.top - 10 
                };
            break;
            case '3':
                width = width / 2;
                height = this.props.longTitles ? 75 : 50;
                vPadding = this.props.longTitles ? 15 : 10;
                let exTop = this.props.longTitles ? 5 : 0; // when a long label wraps, give the box a little extra top to stop it covering the last label  
                l = { 
                    left: width + ((width - (width * .8)) / 2), 
                    top: (parseInt(this.props.id.replace(/.*\-/g, '')) * (height + exTop)) + 10
                };
                wrapStyle = {};
                circleStyle = {width:(width * .8),height:height};
                fillerStyle.borderRadius = 0;
                extraTextStyles = {paddingTop:vPadding,paddingBottom:vPadding};
             //   console.log(this.props.id + ", " + this.props.id.replace(/.*\-/g, ''));
            break;
        }
        const text = title != '' ? 
            <Text style={[this.props.styles.ddtext, extraTextStyles]}>{title}</Text>
            : null;
        const image = <Image 
            style={[this.props.styles.dragImage,this.props.styles.circle]} 
            borderRadius={this.props.circleRadius}
            source={{uri:this.props.imgBase + this.props.data.image}}></Image>
        // ,backgroundColor:'rgba(0,0,100,.5)',l, {position:'absolute'} backgroundColor:'#ccc'
        return (
            <View style={[wrapStyle, l, {position:'absolute'}]}>
                <View style={[fillerStyle,{}]} ref="mc" onLayout={this.logLayout.bind(this)} />
                <Animated.View 
                    {...this.panResponder.panHandlers}                   
                    style={[this.state.pan.getLayout(), circleStyle, this.state.zindex]}>     
                    {this.props.data.image != '' ? image : null}
                    {text}
                </Animated.View>
            </View>
        );
    }
}
