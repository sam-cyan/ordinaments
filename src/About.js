import React, { Component } from 'react'
import './about.css';

class About extends Component {
    // constructor(props) {
    //   super(props)
    // }

    render() {
        return(
            <div>
                <div
                    className={'ordinaments-logo'}
                />
                <div className={'instructions'}>
                    <div className={'instruction'}>1 highlight category you’re interested in: <br/>nature, industrial, street, or waterside</div>
                    <div className={'instruction'}>2 discover ordinaments on the map: <br/><div className={'c c-unknown'}/> represents unknown ordinament, <br/><div className={'c c-discovered'}/> is discovered, <br/><div className={'c c-highlighted'}/> is highlighted, <br/>and <div className={'c c-active'}/> is currently open</div>
                    <div className={'instruction'}>3 click <div className={'music'}/> in the top right corner to turn on music mode, <br/>then play your favourite music on your computer</div>
                    <div className={'instruction'}>4 go out, explore and discover</div>
                </div>
            </div>
        );
    }
}

export default About;