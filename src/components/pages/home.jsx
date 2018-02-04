import React, { Component } from 'react';
import logo from 'img/logo.png';
import material from 'img/material.png';
import vaasa from 'img/vaasa.jpg';
import molly from 'img/molly.jpg';
import space from 'img/space.jpg';

class Section extends Component {
    generateNavButtons() {
        return (
            <div className="intro-nav col-2 col-offset-1 col-m-0">
                <div className="button button-prev" onClick={() => {this.props.onPrev(this.props.index)}}>
                    <svg>
                        <circle cx="50" cy="50" r="40" stroke="rgba(0, 0, 0, 0)" strokeWidth="2" fill="none" strokeDasharray="0, 70" strokeLinecap="round" />
                        <polyline points="30,42 50,62 70,42" stroke="rgba(0, 0, 0, 0.8)" strokeWidth="3" fill="none" />
                    </svg>
                </div>
                <div className="button button-next" onClick={() => {this.props.onNext(this.props.index)}}>
                    <svg>
                        <circle cx="50" cy="50" r="40" stroke="rgba(0, 0, 0, 0)" strokeWidth="2" fill="none" strokeDasharray="0, 70" strokeLinecap="round" />
                        <polyline points="30,42 50,62 70,42" stroke="rgba(0, 0, 0, 0.8)" strokeWidth="3" fill="none" />
                    </svg>
                </div>
            </div>
        );
    }

    render() {
        return(
            <div>
                <div className={"parallax-img " + this.props.imageName} style={{backgroundImage: "url(" + this.props.image + ")"}}></div>
                <div className="row">
                    <div className="intro col-6 col-offset-3 col-m-12 col-m-offset-0">
                        <h1 style={{color: this.props.color}}>{this.props.header}</h1>
                        {this.props.text}
                    </div>
                    {this.generateNavButtons()}
                </div>
            </div>
        );
    }
}

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenHeight: 0,
            scrollTop: 0,
            endIndex: 4,
        };
        this.scrollTo = this.scrollTo.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        var screenHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        this.setState({
            screenHeight: screenHeight,
        });
        window.addEventListener("scroll", this.handleScroll);
    }

    handleScroll() {
        var scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        var pageBottom = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        var { screenHeight, endIndex } = this.state;

        if ( (pageBottom-(scrollTop+screenHeight)) <= screenHeight*2 ) {
            endIndex += 1;
        }

        this.setState({
            scrollTop: scrollTop,
            endIndex: endIndex,
        });
    }

    scrollTo(element) {
        var scrollElement = document.getElementsByClassName("row")[element+1];
        if (scrollElement) {
            var screenHeight = this.state.screenHeight;
            var divHeight = scrollElement.offsetHeight;
            var offset = (screenHeight-divHeight)/2;
            document.body.scrollTop = scrollElement.offsetTop - offset;
            document.documentElement.scrollTop = scrollElement.offsetTop - offset;
        }
    }

    render() {
        const contents = [
            [
                "Hello there",
                <span>
                    <p>My name is Quyen Duong.<br></br>I&#8217;m a front-end developer studying and working in Vaasa, Finland.</p>
                </span>
            ],
            [
                "What I do..",
                <span>
                    <p>I develop beautiful websites, and equip them with an equally pleasant user-interface.</p><p>When 90% of time spent on digital devices is spent online, a delicate webpage is becoming the new catchy store banner.</p>
                </span>
            ],
            [
                "A bit of flavours..",
                <span>
                    <p>I enjoy games, designing as well as playing them.</p>
                    <p>I also love dogs, music, avocados and<br></br><span id="animate-span">css transition animations.</span></p>
                </span>
            ],
            [
                "Enjoy your stay",
                <span>
                    <p>So you know all there is about me, now what ?</p>
                    <p>If you are just a curious visitor, I made this for you.</p>
                    <p>If you are an employer, please feel free to checkout my portfolio.</p>
                    <p>Got something to say? To the contact section you go!</p>
                </span>
            ],
        ];
        const images = [
            [logo, "logo"],
            [material, "material"],
            [vaasa, "vaasa"],
            [molly, "molly"],
            [space, "space"],
        ];
        const colors = [
            "#1565C0",
            "#C62828",
            "#558B2F",
            "#6A1B9A",
            "#D84315",
            "#00838F",
        ];

        var childSections = [];

        var startIndex = 0;
        var endIndex = this.state.endIndex;

        var index = startIndex;

        while (index <= endIndex) {
            var i = index % contents.length;
            childSections.push(
                <Section
                    key={index}
                    index={index}
                    image={images[i][0]}
                    imageName={images[i][1]}
                    color={colors[i]}
                    header={contents[i][0]}
                    text={contents[i][1]}
                    onPrev={(current) => {this.scrollTo(current-1)}}
                    onNext={(current) => {this.scrollTo(current+1)}}
                />
            );
            index++;
        }

        return (
            <div className="home">
                <div className="scroller">
                    {childSections}
                </div>
            </div>
        );
    }
}
