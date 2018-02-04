import React, { Component } from 'react';
import quads from 'img/portfolio/quads.png';
import madcube from 'img/portfolio/madcube.png';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    render() {
        return(
            <div className="card">
                <div>
                    <div className="card-bg" style={{backgroundImage: "url(" + this.props.img + ")"}}></div>
                    <div className="card-text">
                        <h1>{this.props.header}</h1>
                        <p className="hidden">{this.props.text}</p>
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
            text: "asd",
            time: 0,
            startTime: 1517664613623,
        };

        this.getTime = this.getTime.bind(this);
        this.getRandomLetter = this.getRandomLetter.bind(this);
        this.shuffleText = this.shuffleText.bind(this);
    }

    componentDidMount() {
        this.getTime();
        this.shuffleText("HELLOOOOOOO", 10000, 50);
        var countInt = setInterval(() => {
            this.getTime();
        }, 1000);
    }

    getTime() {
        var d = new Date();
        var t = Math.round( (d.getTime()-this.state.startTime)/1000 );
        this.setState({
            time: t,
        });
    }

    getRandomLetter() {
        const code = "!@#$%^&*()+{};<>~\|/€";
        var randomNum = Math.floor(Math.random()*code.length);
        var randomLetter = code.substring(randomNum, randomNum+1);
        return randomLetter;
    }

    shuffleText(newText, dur, intTime) {
        var current = this.state.text;
        var maxLoop = dur/intTime;
        var runCount = 0;

        var startCorrection = maxLoop - newText.length; // At which run will the letters start changing into correct ones

        var int = setInterval(() => {
            var current = this.state.text;

            /// TEXT RANDOMIZE
            var willChangeCount = Math.floor(Math.max(current.length/2, Math.random()*current.length));
            // Make an array of 'willChangeCount' random numbers with the upper limit of 'current.length'
            var willChangeArray = [];
            while(willChangeArray.length < willChangeCount){
                var random = Math.floor(Math.random()*current.length);
                if (willChangeArray.indexOf(random) > -1) {
                    continue;
                }
                willChangeArray[willChangeArray.length] = random;
            }
            // Loop through 'willChangeArray' and change letters at those index to random letters
            for (var i = 0; i < willChangeCount; i++) {
                var position = willChangeArray[i];
                var replacement = this.getRandomLetter();

                var current = current.substr(0, position) + replacement + current.substr(position+replacement.length, current.length);
            }

            /// TEXT ADD
            if (current.length < newText.length) {
                var randomLetter = this.getRandomLetter();
                current += randomLetter;
            }

            this.setState({
                text: current,
            });

            runCount++;

        }, intTime);

        var to = setTimeout(() => {
            clearInterval(int);
            this.setState({
                text: newText,
            });
        }, dur);
    }

    render() {
        return (
            <h1 id="clock-display">{this.state.text}</h1>
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
            [
                madcube,
                "MadCube",
                "A 48-hour video games hackathon project. Developed with Unity.",

            ],
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

        cards.splice(2, 0,
            <div className="card">
                <div className="clock">
                    <div className="card-bg"></div>
                    <div className="card-text">
                        {<Clock key={"clock"} />}
                        <p className="hidden">Time this website has been up for.</p>
                    </div>
                </div>
            </div>
        );

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
