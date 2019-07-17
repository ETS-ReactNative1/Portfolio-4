import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from 'components/pages/home';
import Projects from 'components/pages/projects';
import Contact from 'components/pages/contact';
import Empty from 'components/pages/empty';

export default class Main extends Component {
    render() {
        return(
            <div className="main">
                <Switch>
                    <Route exact path='/' component = {Home}/>
                    <Route exact path='/projects' component = {Projects}/>
                    <Route exact path='/contact' component = {Contact}/>
                    <Empty />
                </Switch>
            </div>
        );
    }
}
