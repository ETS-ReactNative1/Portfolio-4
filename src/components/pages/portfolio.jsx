import React, { Component } from 'react';

import cardData from 'data/portfolio.xml';

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
            currentModal: null,
            cardFlipState: [],
            selection: [],
        };

        this.getData = this.getData.bind(this);
        this.showModal = this.showModal.bind(this);
        this.cardClick = this.cardClick.bind(this);
        this.cardFlipUp = this.cardFlipUp.bind(this);
        this.cardFlipDown = this.cardFlipDown.bind(this);
        this.cardFlipToggle = this.cardFlipToggle.bind(this);
        // this.cardSelect = this.cardSelect.bind(this);
        this.cardCheck = this.cardCheck.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    cardClick(id) {
        this.cardFlipToggle(id);
        this.cardCheck(id);
    }

    cardCheck(id) {
        var {selection, contents} = this.state;
        var index = selection.indexOf(id);
        if (index <= -1) { // If card has not been selected
            selection.push(id);
        } else { // If card has been selected
            selection.splice(index, 1);
        }

        var maxCards = 3;
        if (selection.length >= 2) { // Atleast 2 cards selected
            var equal = true;
            var prev;
            for (var i = 0; i < selection.length; i++) {
                var name = contents[selection[i]].name;
                if (i == 0) {
                    prev = name;
                    continue;
                }
                if (name != prev) {
                    equal = false;
                    console.log("breakie mcBreakFace");
                    break;
                }
                prev = name;
            }
            var timeout = 500;
            if (!equal) {
                console.log("Sad");
                setTimeout(() => {
                    for (var i = 0; i < selection.length; i++) {
                        this.cardFlipDown(selection[i]);
                    }
                    selection.splice(0, selection.length);
                }, timeout);
            } else {
                if (selection.length >= maxCards) {
                    console.log("Bingo");
                    setTimeout(() => {
                        for (var i = 0; i < selection.length; i++) {
                            this.cardFlipDown(selection[i]);
                        }
                        selection.splice(0, selection.length);
                    }, timeout);
                }
            }

        }

        this.setState({
            selection: selection,
        });
    }

    cardFlipToggle(id) {
        console.log("toggle");
        var {cardFlipState} = this.state;
        cardFlipState[id] = !cardFlipState[id];
        this.setState({
            cardFlipState: cardFlipState,
        });
    }

    cardFlipUp(id) {
        console.log("up");
        var {cardFlipState} = this.state;
        cardFlipState[id] = true;
        this.setState({
            cardFlipState: cardFlipState,
        });
    }

    cardFlipDown(id) {
        console.log("down");
        var {cardFlipState} = this.state;
        cardFlipState[id] = false;
        this.setState({
            cardFlipState: cardFlipState,
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
                    var cardFlipState = [];
                    for (var id = 0; id < cards.length; id++) {
                        contents[id] = {};
                        var img = cards[id].getElementsByTagName("Img")[0].childNodes[0].nodeValue;
                        contents[id].img = this.props.images[img];
                        contents[id].name = cards[id].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                        contents[id].header = cards[id].getElementsByTagName("Header")[0].childNodes[0].nodeValue;
                        cardFlipState[id] = false;
                    }
                    this.setState({
                        contents: contents,
                        cardFlipState: cardFlipState,
                    });
				}
			}
		};
        req.open("GET", cardData, true);
		req.send();
    }

    render() {
        var allCards = [];
        var cards = [];
        var {contents, cardFlipState} = this.state;
        if (contents && cardFlipState) {
            for (var i = 0; i < contents.length; i++) {
                allCards.push(
                    <Card
                        key={i}
                        id={i}
                        name={contents[i].name}
                        img={[contents[i].img]}
                        header={contents[i].header}
                        onClick={(id) => {this.cardClick(id)}}
                        flipped={cardFlipState[i]}
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
