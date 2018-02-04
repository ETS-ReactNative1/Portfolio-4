import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    toggleMenu() {
        this.setState({
            show: !this.state.show,
        });
    }

    closeMenu() {
        this.setState({
            show: false,
        });
    }

    render() {
        return(
            <div className="nav row">
                <div className={(this.state.show ? "opened " : "") + "menu-arrow"} onClick={() => {this.toggleMenu()}}>
                    <svg>
                        <g className="line">
                            <polyline strokeLinecap="round" points="27,50 73,50" fill="none" />
                        </g>
                        <g className="line">
                            <polyline strokeLinecap="round" points="27,50 73,50" fill="none" />
                        </g>
                        <g className="line">
                            <polyline strokeLinecap="round" points="27,50 73,50" fill="none" />
                        </g>
                    </svg>
                </div>
                <div className={(this.state.show ? "opened " : "") + "menu-overlay"}>
                    <svg width="0" height="0">
                        <clipPath id="clip">
                            <path d="M19 6.734c0 4.164-3.75 6.98-3.75 10.266h-6.5c0-3.286-3.75-6.103-3.75-10.266 0-4.343 3.498-6.734 6.996-6.734 3.502 0 7.004 2.394 7.004 6.734zm-4.5 11.266h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-5.5l1.451 1.659c.19.216.465.341.753.341h1.093c.288 0 .562-.125.752-.341l1.451-1.659z"/>
                        </clipPath>
                    </svg>
                    <div className="menu-nav">
                        <div className="link-container"><Link onClick={() => {this.closeMenu()}} className="link" to="/">Home</Link></div>
                        <div className="link-container"><Link onClick={() => {this.closeMenu()}} className="link" to="/portfolio">Portfolio</Link></div>
                        <div className="link-container"><Link onClick={() => {this.closeMenu()}} className="link" to="/fun">Fün</Link></div>
                        <div className="link-container"><Link onClick={() => {this.closeMenu()}} className="link" to="/contact">Contact</Link></div>
                    </div>
                </div>
            </div>
        );
    }
}
