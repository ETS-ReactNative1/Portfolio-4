import React, { Component } from 'react';

import cardsData from 'data/portfolio.xml';

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

class Card extends React.Component {
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
    //
    // flipCard(id) {
    //     this.setState({
    //         flipped: !this.state.flipped,
    //     });
    // }

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
        <div className={(this.props.flipped ? "flipped " : "") + "card"} onClick={() => {this.props.onClick(this.props.id)} }>
            <div>
                <div className="card-cover"></div>
                <div className="card-reveal">
                    <div className="card-bg" style={{backgroundImage: "url(" + this.props.img + ")"}}></div>

                </div>
            </div>
            <div className={(this.state.show ? "opened " : "") + "card-desc"}>
            </div>
        </div>
        );
    }
}

class CardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contents: null,
            showModal: false,
            currentModal: 0,
            cardsFlipState: [],
        };

        this.getData = this.getData.bind(this);
        this.cardCheck = this.cardCheck.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    cardCheck(id) {
        console.log(id);
        var {cardsFlipState} = this.state;
        cardsFlipState[id] = !cardsFlipState[id];
        this.setState({
            cardsFlipState: cardsFlipState,
        });
    }

    showModal(id) {
        this.setState({
            showModal: true,
            currentModal: id,
        });
    }

    getData() {
        var req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState === 4) {
				if (req.status === 200) {
					var response = req.responseXML;
                    var cards = response.getElementsByTagName("Card");
                    var contents = [];
                    var cardsFlipState = [];
                    for (var i = 0; i < cards.length; i++) {
                        contents[i] = {};
                        var img = cards[i].getElementsByTagName("Img")[0].childNodes[0].nodeValue;
                        contents[i].img = this.props.images[img];
                        contents[i].name = cards[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                        contents[i].header = cards[i].getElementsByTagName("Header")[0].childNodes[0].nodeValue;
                        cardsFlipState[i] = false;
                    }
                    this.setState({
                        contents: contents,
                        cardsFlipState: cardsFlipState,
                    });
				}
			}
		};
        req.open("GET", cardsData, true);
		req.send();
    }

    render() {
        var allCards = [];
        var cards = [];
        var {contents, cardsFlipState} = this.state;
        if (contents && cardsFlipState) {
            for (var i = 0; i < contents.length; i++) {
                allCards.push(
                    <Card
                        key={i}
                        id={i}
                        name={contents[i].id}
                        img={[contents[i].img]}
                        header={contents[i].header}
                        desc={contents[i].desc}
                        onClick={(id) => {this.cardCheck(id)}}
                        flipped={cardsFlipState[i]}
                    />
                );
            }
        }

        return (
            <div className="card-container">
                {allCards}
            </div>
        );
    }
}

export default class Portfolio extends Component {

    constructor(props) {
        super(props);
        this.importAll = this.importAll.bind(this);
    }

    componentDidMount() {
    }

    importAll(r) {
        var images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    }

    render() {
        var images = this.importAll(require.context('img/portfolio', false, /\.(png|jpe?g|svg)$/));
        console.log(images);
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
                                <CardContainer images={images}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
