import React, { Component } from 'react';
import Nav from 'components/common/nav';
import Main from 'components/common/main';
import 'style/css/style.css';

export default class App extends Component {
    render() {
        return (
            <div className="app-container container-fluid">
                <Nav />
                <Main />
            </div>
        );
    }
}
