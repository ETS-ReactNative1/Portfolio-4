import React, { Component } from 'react';
import {importAllFrom} from 'components/utils/importer';

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

class CardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardContent: null,
            cardModal: null,
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
        var {selection, cardContent} = this.state;
        var index = selection.indexOf(id);
        if (index <= -1) { // If card has not been selected
            selection.push(id);
        } else { // If card has been selected
            selection.splice(index, 1);
        }

        var maxCards = 2;
        if (selection.length >= 2) { // Atleast 2 cards selected
            var equal = true;
            var prev;
            for (var i = 0; i < selection.length; i++) {
                var name = cardContent[selection[i]].name;
                if (i === 0) {
                    prev = name;
                    continue;
                }
                if (name !== prev) {
                    equal = false;
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
                    this.showModal(cardContent[selection[0]].name);
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
        var {cardFlipState} = this.state;
        cardFlipState[id] = !cardFlipState[id];
        this.setState({
            cardFlipState: cardFlipState,
        });
    }

    cardFlipUp(id) {
        var {cardFlipState} = this.state;
        cardFlipState[id] = true;
        this.setState({
            cardFlipState: cardFlipState,
        });
    }

    cardFlipDown(id) {
        var {cardFlipState} = this.state;
        cardFlipState[id] = false;
        this.setState({
            cardFlipState: cardFlipState,
        });
    }

    showModal(name) {
        this.setState({
            showModal: true,
            currentModal: name,
        });
    }

    getData() {
        var req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState === 4) {
				if (req.status === 200) {
					var response = req.responseXML;
                    var {cardContent, cardFlipState, cardModal} = this.state;
                    var images = importAllFrom(require.context("img/portfolio", true, /\.(png|jpe?g|svg)$/));

                    var cards = response.getElementsByTagName("Card");
                    cardContent = [];
                    for (var i = 0; i < cards.length; i++) {
                        cardContent[i] = {};
                        var img = cards[i].getElementsByTagName("Img")[0].childNodes[0].nodeValue;
                        cardContent[i].img = images[img];
                        cardContent[i].name = cards[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                        cardFlipState[i] = false;
                    }

                    var modals = response.getElementsByTagName("Modal");
                    cardModal = [];
                    for (var i = 0; i < modals.length; i++) {
                        var name = modals[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                        cardModal[name] = {};

                        cardModal[name].title = modals[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;
                        cardModal[name].demo = modals[i].getElementsByTagName("Demo")[0].childNodes[0].nodeValue;
                        cardModal[name].time = modals[i].getElementsByTagName("Time")[0].childNodes[0].nodeValue;
                        cardModal[name].type = modals[i].getElementsByTagName("Type")[0].childNodes[0].nodeValue;

                        var logo = modals[i].getElementsByTagName("Logo")[0].childNodes[0].nodeValue;
                        cardModal[name].logo = images[logo];

                        var screenshotsNodes = modals[i].getElementsByTagName("Screenshot");
                        cardModal[name].screenshots = [];
                        for (var r = 0; r < screenshotsNodes.length; r++) {
                            cardModal[name].screenshots[r] = [];
                            var screenshot = screenshotsNodes[r].childNodes[i].nodeValue;
                            cardModal[name].screenshots[r] = images[screenshot];
                        }

                        var remarkNodes = modals[i].getElementsByTagName("Remark");
                        cardModal[name].remarks = [];
                        for (var r = 0; r < remarkNodes.length; r++) {
                            cardModal[name].remarks[r] = {};
                            var remarkContent = remarkNodes[r].getElementsByTagName("Content")[0].childNodes[0].nodeValue;
                            var remarkAuthor = remarkNodes[r].getElementsByTagName("Author")[0].childNodes[0].nodeValue;
                            cardModal[name].remarks[r].content = remarkContent;
                            cardModal[name].remarks[r].author = remarkAuthor;
                        }

                        var descNodes = modals[i].getElementsByTagName("Desc")[0].childNodes;
                        for (var d = 0; d < descNodes.length; d++) {
                            if (descNodes[d].nodeName === "#cdata-section") {
                                cardModal[name].desc = descNodes[d].data;
                            }
                        }
                    }

                    this.setState({
                        cardModal: cardModal,
                        cardContent: cardContent,
                        cardFlipState: cardFlipState,
                    });
				}
			}
		};
        req.open("GET", cardData, true);
		req.send();
    }

    render() {
        var {cardContent, cardFlipState, showModal, cardModal, currentModal} = this.state;

        if (cardContent && cardFlipState) {
            var cardsRender = [];
            for (var i = 0; i < cardContent.length; i++) {
                cardsRender.push(
                    <Card
                        key={i}
                        id={i}
                        name={cardContent[i].name}
                        img={[cardContent[i].img]}
                        header={cardContent[i].header}
                        onClick={(id) => {this.cardClick(id)}}
                        flipped={cardFlipState[i]}
                    />
                );
            }
        }

        if (showModal && currentModal && cardModal) {
        }

        if (cardModal) {
            var modalRender = (
                <Modal
                    logo={cardModal["quads"].logo}
                    title={cardModal["quads"].title}
                    time={cardModal["quads"].time}
                    type={cardModal["quads"].type}
                    demo={cardModal["quads"].demo}
                    remarks={cardModal["quads"].remarks}
                    desc={cardModal["quads"].desc}
                    screenshots={cardModal["quads"].screenshots}
                />
            );
        }

        return (
            <div>
                <div className="card-container">
                    {cardsRender}
                </div>
                {true &&
                    modalRender
                }
            </div>
        );
    }
}

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.removeScriptTag = this.removeScriptTag.bind(this);
    }

    removeScriptTag(string) {
        var div = document.createElement('div');
        div.innerHTML = string;
        var scripts = div.getElementsByTagName('script');
        var i = scripts.length;
        while (i--) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
        return String(div.innerHTML);
    }

    render() {
        var desc = this.removeScriptTag(this.props.desc);
        var descHTML = {__html: desc};

        var {remarks, screenshots} = this.props;
        if (remarks) {
            var remarksRender = remarks.map((remark, index) => {
                return(
                    <p className="remark" key={index}>
                        {remark.content}
                        <span className="author">{remark.author}</span>
                    </p>
                );
            });
        }

        return(
            <div className="modal-container">
                <div className="row summary">
                    <div className="col-4 logo">
                        <img src={this.props.logo} />
                    </div>
                    <div className="col-8">
                        <h1>{this.props.title}</h1>
                        <p className="details">{this.props.time} <span className="type">{this.props.type}</span></p>
                        <a className="demo" target="_blank" rel="noopener noreferrer" href={this.props.demo}>View demo</a>
                    </div>
                </div>
                <div className="row screenshots">
                    <div className="screenshots col-12">
                        <p>Digitally recorded images of display apparatus (or just "Screenshots"):</p>
                        <ImageScroll images={screenshots}/>
                    </div>
                </div>
                <div className="row desc">
                    <div className="desc col-12" dangerouslySetInnerHTML={descHTML}>

                    </div>
                </div>
                <div className="remark-container">
                    {remarksRender}
                </div>
            </div>
        );
    }
}

class ImageScroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFull: true,
            currentImage: 0,
        };
        this.openFull = this.openFull.bind(this);
        this.closeFull = this.closeFull.bind(this);
        this.prevImage = this.prevImage.bind(this);
        this.nextImage = this.nextImage.bind(this);
        this.loopIndex = this.loopIndex.bind(this);
    }

    prevImage() {
        var {currentImage} = this.state;
        var {images} = this.props;

        currentImage = this.loopIndex(currentImage-1, images.length);

        this.setState({
            currentImage: currentImage,
        });
    }

    nextImage() {
        var {currentImage} = this.state;
        var {images} = this.props;

        currentImage = this.loopIndex(currentImage+1, images.length);

        this.setState({
            currentImage: currentImage,
        });
    }

    openFull(id) {
        var image = this.props.images[id];
        this.setState({
            showFull: true,
            currentImage: id,
        });
    }

    closeFull() {
        this.setState({
            showFull: false,
        });
    }

    loopIndex(id, length) {
        if (id < 0) {
            id = length-1;
        }
        if (id >= length) {
            id = 0;
        }
        return id;
    }

    render() {
        var {images} = this.props;
        var {currentImage} = this.state;

        if (images) {
            var thumbnails = images.map((image, index) => {
                return(
                    <img className="thumbnail" src={image} key={image} onClick={() => {this.openFull(index)}}/>
                );
            });
            var imagesAnimate = [
                <img className="prev" src={images[this.loopIndex(currentImage-1, images.length)]} key="img-prev"/>,
                <img className="current" src={images[currentImage]} key="img-current"/>,
                <img className="next" src={images[this.loopIndex(currentImage+1, images.length)]} key="img-next"/>,
            ];
        }

        return(
            <div className="image-scroll">
                <div className={(this.state.showFull) ? "image-container expanded" : "image-container"} >
                    {(!this.state.showFull) ?
                        (
                            <div className="thumbnails">
                                {thumbnails}
                            </div>
                        ) :
                        (
                            <div className="full">
                                <div className="animate">
                                    {imagesAnimate}
                                </div>
                                <div className="button prev" onClick={() => {this.prevImage()}}>
                                    <svg viewBox="0 0 100 100">
                                        <polyline points="70,10 30,50" />
                                        <polyline points="30,50 70,90" />
                                    </svg>
                                </div>
                                <div className="button next" onClick={() => {this.nextImage()}}>
                                    <svg viewBox="0 0 100 100">
                                        <polyline points="70,10 30,50" />
                                        <polyline points="30,50 70,90" />
                                    </svg>
                                </div>
                                <div className="button close" onClick={() => {this.closeFull()}}>
                                    <i className="material-icons">fullscreen_exit</i>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

class Card extends React.Component {
    render() {
        return(
        <div className={(this.props.flipped ? "flipped " : "") + "card"} onClick={() => {this.props.onClick(this.props.id)} }>
            <div>
                <div className="card-cover"></div>
                <div className="card-reveal">
                    <div className="card-bg" style={{backgroundImage: "url(" + this.props.img + ")"}}></div>
                </div>
            </div>
        </div>
        );
    }
}

export default class Portfolio extends Component {

    render() {
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
                                <CardContainer />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
