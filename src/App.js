import React, { Component } from 'react';

import Navigation from './Navigation.js';
import ThreeObject from './ThreeObject.js';
import Map from './Map.js';
import MapMusic from './MapMusic.js';

import MNavigation from './mobile/mNavigation.js';
import MThreeObject from './mobile/mThreeObject.js';

import Sounds from './Sounds.js';
import Cursor from './Cursor.js';
import About from './About.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      activeId: 38,
      music: false,
      info: false
    }
  }

  // componentWillMount() {
  //   window.addEventListener('resize', this.handleWindowSizeChange);
  // }
  
  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.handleWindowSizeChange);
  // }

  handleIdChange = (index) => {
    this.setState({activeId: index});
  }

  handleMusicChange = (boo) => {
    this.setState({music: boo});
  }

  handleInfoChange = (boo) => {
    this.setState({info: boo});
  }

  //dektop

  renderStatic() {
    return (
      <div>
        <Map dataAppToMap = {this.state.activeId}/>
        <div>
          <ThreeObject dataAppToThreeObject1 = {this.state.activeId} dataAppToThreeObject2 = {this.state.music}/>
          <Sounds dataAppToSounds = {this.state.activeId}/>
          <div>
            <Cursor />
            <Navigation
              activeId={this.state.activeId} 
              handleIdChange={this.handleIdChange}
              handleMusicChange={this.handleMusicChange}
              handleInfoChange={this.handleInfoChange}
            />
          </div>
        </div>
      </div>
    );
  }

  renderMusic() {
    return (
      <div>
        <MapMusic dataAppToMap = {this.state.activeId}/>
        <div>
          <ThreeObject dataAppToThreeObject1 = {this.state.activeId} dataAppToThreeObject2 = {this.state.music}/>
          <div>
            <Cursor />
            <Navigation
              activeId={this.state.activeId} 
              handleIdChange={this.handleIdChange} 
              handleMusicChange={this.handleMusicChange}
              handleInfoChange={this.handleInfoChange}
            />
          </div>
        </div>
      </div>
    );
  }

  renderInfo() {
    return (
      <div>
        <MapMusic dataAppToMap = {0}/>
        <div>
          <Cursor />
          <div>
            <About />
          </div>
        </div>
      </div>
    );
  }

  // mobil

  mrenderStatic() {
    return (
      <div>
        <Map dataAppToMap = {this.state.activeId}/>
        <div>
          <MThreeObject dataAppToThreeObject1 = {this.state.activeId} dataAppToThreeObject2 = {this.state.music}/>
          <Sounds dataAppToSounds = {this.state.activeId}/>
          <div>
            <MNavigation
              activeId={this.state.activeId} 
              handleIdChange={this.handleIdChange}
              handleMusicChange={this.handleMusicChange}
              handleInfoChange={this.handleInfoChange}
            />
          </div>
        </div>
      </div>
    );
  }

  mrenderMusic() {
    return (
      <div>
        <MapMusic dataAppToMap = {this.state.activeId}/>
        <div>
          <MThreeObject dataAppToThreeObject1 = {this.state.activeId} dataAppToThreeObject2 = {this.state.music}/>
          <div>
            <MNavigation
              activeId={this.state.activeId} 
              handleIdChange={this.handleIdChange} 
              handleMusicChange={this.handleMusicChange}
              handleInfoChange={this.handleInfoChange}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { width } = this.state;
    const isMobile = width <= 500;

    if (isMobile) {
      if (this.state.music) {
        return (
          <div>
            {this.mrenderMusic()}
          </div>
        );
      } else {
        return (
          <div>
            {this.mrenderStatic()}
          </div>
        );
      }
    } else {

      if (this.state.info) {
        return (
          <div>
              {this.renderInfo()}
            </div>
        );
      } else {

        if (this.state.music) {
          return (
            <div>
              {this.renderMusic()}
            </div>
          );
        } else {
          return (
            <div>
              {this.renderStatic()}
            </div>
          );
        }
      }
    }
  }
}

export default App;