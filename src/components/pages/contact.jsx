import React, { Component } from 'react';
import me from 'img/me.jpg';

export default class Contact extends Component {
    render() {
        return (
            <div className="contact">
                <div className="row">
                    <div className="col-5 col-m-12 pull-right image">
                        <img src={me} alt="Me and my little friend"></img>
                    </div>
                    <div className="col-7 col-m-12 pull-right">
                        <h1>Quyen Duong</h1>
                        <span class="phonetic">(/kwiːn ˈduoʊŋ/)</span>
                        <hr></hr>
                        <p><i className="material-icons">phone_android</i>+358 (0) 417 276 866</p>
                        <p><i className="material-icons">mail_outline</i><a href="mailto:mindstorm1998@gmail.com">mindstorm1998@gmail.com</a></p>
                        <p><i className="material-icons">link</i><a href="https://www.av0c.com/">www.av0c.com</a> (Offline)</p>
                        <div className="row social">
                            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/duongkinh.quyen" class="fa fa-facebook"></a>
                            <a target="_blank" rel="noopener noreferrer" href="https://www.snapchat.com/add/av0cadodo" class="fa fa-snapchat-ghost"></a>
                            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/av0c_ado/" class="fa fa-instagram"></a>
                            <a target="_blank" rel="noopener noreferrer" href="https://github.com/Av0c" class="fa fa-github"></a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
