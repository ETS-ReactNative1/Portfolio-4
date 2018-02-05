import React, { Component } from 'react';
import quads from 'img/portfolio/quads.png';
import madcube from 'img/portfolio/madcube.png';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            percentRadius: 0,
            percentX: 0,
            percentY: 0,
        };
        this.setPosition = this.setPosition.bind(this);
        this.addEffect = this.addEffect.bind(this);
    }

    componentDidMount() {
        // window.addEventListener("mouseover", () => {this.addEffect()} );
        // window.addEventListener("mouseleave", () => {this.removeEffect()} );
    }


    addEffect() {
        this.setState({
            percentRadius: 50,
        });
        window.addEventListener("mousemove", (e) => {this.setPosition(e)} );
        console.log("added");
    }
    removeEffect() {
        this.setState({
            percentRadius: 0,
        });
        window.removeEventListener("mousemove", (e) => {this.setPosition(e)} );
        console.log("removed");
    }

    setPosition(e) {
        var x = e.pageX-this.cardDiv.offsetLeft;
        var y = e.pageY-this.cardDiv.offsetTop;
        var widthX = this.cardDiv.offsetWidth;
        var heightY = this.cardDiv.offsetHeight;

        var percentX = Math.floor(x/widthX*100);
        var percentY = Math.floor(y/heightY*100);

        this.setState({
            percentX: percentX,
            percentY: percentY,
        });

        console.log("moved");
    }

    render() {
        return(
            <div className="card" ref={(div) => { this.cardDiv = div }}>
                <div>
                    <div className="card-cover"></div>
                    <div className="card-reveal">
                        {<div className="card-bg" style={{backgroundImage: "url(" + this.props.img + ")"}}></div>
                        // <div className="card-text">
                        //     <h1>{this.props.header}</h1>
                        // </div>
                        }
                    </div>
                </div>
                <div className={(this.state.show ? "opened " : "") + "card-desc"}>

                </div>
            </div>
        );
    }
}

class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "00",
            hour: 0,
            minute: 0,
            second: 0,
            timeInt: null,
            startTime: 1517664613623,
        };

        this.getTime = this.getTime.bind(this);
        this.getRandomString = this.getRandomString.bind(this);
        this.shuffleText = this.shuffleText.bind(this);
    }

    componentDidMount() {
        this.getTime();
        var timeInt = setInterval(() => {
            this.getTime();
        }, 1000);
        this.setState({
            timeInt: timeInt,
        });
    }

    componentWillUnmount() {
        var timeInt = this.state.timeInt;
        clearInterval(timeInt);
    }

    getTime() {
        var d = new Date();
        var t = Math.floor( (d.getTime()-this.state.startTime)/1000 );

        var hour = Math.floor( (t/60)/60 );
        var minute = Math.floor( (t - hour*3600)/60 );
        var second = t - hour*3600 - minute*60;

        hour = ("0" + hour).slice(-2);
        minute = ("0" + minute).slice(-2);
        second = ("0" + second).slice(-2);

        if (hour !== this.state.hour) {
            this.shuffleText("hour", String(hour), 800, 50);
        }
        if (minute !== this.state.minute) {
            this.shuffleText("minute", String(minute), 800, 50);
        }
        if (second !== this.state.second) {
            this.shuffleText("second", String(second), 900, 50);
        }
    }

    getRandomString(length) {
        const code = "!@#$%^&*()+{};<>~|/€";
        var randomString = "";
        while (randomString.length < length) {
            var randomNum = Math.floor(Math.random()*code.length);
            randomString += code.substring(randomNum, randomNum+1);
        }

        return randomString;
    }

    shuffleText(stateToChange, newText, timeLimit, intTime) {
        var correctArray = []; // Array to keep position that has been corrected
        var to;

        var int = setInterval(() => {
            var current = this.state[stateToChange];

            if (current.length !== newText.length) { // Add/Remove letters before correcting
                var step = Math.sign(newText.length-current.length);
                if (current.length < newText.length) {
                    current = this.getRandomString(current.length+step);
                } else {
                    current = this.getRandomString(current.length+step);
                }
            } else {
                if (current !== newText) {

                    var position = Math.floor(Math.random()*current.length);
                    while (correctArray.indexOf(position) > -1) {
                        position = Math.floor(Math.random()*current.length);
                    }

                    correctArray.push(position);
                    current = this.getRandomString(current.length);

                    for (var i = 0; i < correctArray.length; i++) {
                        var correctPosition = correctArray[i];
                        var correction = newText.substring(correctPosition, correctPosition+1);
                        current = current.substring(0, correctPosition) + correction + current.substring(correctPosition+correction.length, current.length);
                    }

                } else {
                    clearTimeout(to);
                    clearInterval(int);
                    this.setState({
                        [stateToChange]: newText,
                    });
                    return;
                }
            }

            this.setState({
                [stateToChange]: current,
            });

        }, intTime);

        // Fallback if the transition takes way too long (you should make transition faster instead of relying on this - why? ugly.)
        to = setTimeout(() => {
            clearInterval(int);
            this.setState({
                text: newText,
            });
        }, timeLimit);
    }

    render() {
        return (
            <h1>{this.state.hour}:{this.state.minute}:{this.state.second}</h1>
        );
    }

}


export default class Portfolio extends Component {
    render() {
        const contents = [
            [
                quads,
                "QuaDs",
                "A musical tap game developed and published for Android.",
                <span>
                    <p>QuaDs was my first game that's ever released. I started working on it on my last year of highschool and finished one year later, the game was then released to Google Play at the start of 2017.</p>
                    <p>The engine used was GameMaker Studio, it uses GML (GameMaker Language) which is very similar to Javascript. All in-game assets were made by me. The most challenging part however was the sound, where I had to slice songs into notes, which plays as the player taps in the game.</p>
                </span>
            ],
            // [
            //     madcube,
            //     "MadCube",
            //     "A 48-hour video games hackathon project. Developed with Unity.",
            //
            // ],
        ];

        var cards = [];

        for (var i = 0; i < contents.length; i++) {
            cards.push(
                <Card
                    key={i}
                    img={contents[i][0]}
                    header={contents[i][1]}
                    text={contents[i][2]}
                    desc={contents[i][3]}
                />
            );
        }

        // cards.splice(2, 0,
        //     <div className="card" key="clock">
        //         <div className="clock">
        //             <div className="card-cover"></div>
        //             <div className="card-bg"></div>
        //             <div className="card-text">
        //                 {<Clock/>}
        //                 <p className="hidden">Time this website has been up for.</p>
        //             </div>
        //         </div>
        //     </div>
        // );

        return (
            <div className="portfolio">
                <div className="intro">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="big-title">Portfolio</h1>
                            <p>Here you can find all my finished and in-progress projects.</p>
                            <p>Click on each thumbnail to see full details about the project and see the demo (if available).</p>
                        </div>
                    </div>
                </div>
                <div className="projects">
                    <div className="row">
                        <div className="col-12">
                            <div className="card-center">
                                <div className="card-container">
                                    {cards}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
