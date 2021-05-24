import React, { Component } from 'react';
import './navigation.css';

import HighlightTitle from './svg/highlight.svg';
import MapTitle from './svg/map.svg';

let activeId = 38;
let activeCategory = 0;
let music = false;
let info = false;
let matrixNavigation = null;

let toHighlight = [[12,17,18,22,34,64,66],[13,26,28,29,33,66,70,71],[33,37,38,43,44,48,49,51,54,62,69],[12,13,22,26,27,28,29,35,71]];

let objects = [ //zobrazuje sa to naopak (posledna je prva)
  null, null, './data/metro.obj', null, null,
  null, null, './data/sprejebeton.obj', './data/sprejekriky.obj', null,
  null, './data/stromnasedenie.obj', './data/retaze.obj', './data/lavickabetonrastliny.obj', null,
  null, './data/stromx.obj', './data/dvaaviacstromov.obj', null, null,
  null, './data/kmenakonike.obj', './data/gotickyaltanok.obj', null, null,
  './data/pristavnymost.obj', './data/apollo.obj', './data/uviazanielode.obj', './data/snp.obj', null,
  null, null, './data/elektrikaskodovka.obj', './data/stromsbrectanom.obj', './data/promenada.obj',
  null, './data/elektrikajakubovo.obj', './data/tehlovystlpik.obj', './data/lavicka.obj', null,
  null, null, './data/kvetinacnabetone.obj', './data/lampa.obj', null,
  null, './data/pneumatiky.obj', './data/staredvere.obj', './data/kosslobody.obj', null,
  './data/lavickaistropolis.obj', './data/trznica.obj', null, './data/kachlickyprirodovedecka.obj', null,
  null, './data/pamatnik-deti.obj', './data/pamatnik-kruh.obj', './data/pamatnik-mec.obj', null,
  null, './data/prazska.obj', './data/kalvaria.obj', './data/stromhorskypark.obj', null,
  './data/hrdzavyplot.obj', null, null, './data/trubkakramare.obj', './data/plechkramare.obj',
  './data/vodnybicykel.obj', null, null, null, null
];
// Categories

const Category = props => {
  let categoryClass = 'category-'+props.name; //navigation.css
  if (props.active) {
    categoryClass = 'category-'+props.name+' category-'+props.name+'-active';
  }

  return (
    <div
      className={categoryClass}
      id={props.key}
      key={props.key}
      name={props.name}
      onClick={props.categorySelect}
    />
  );
}

const buildCategoriesState = () => {
  const categoriesState = {};

  // Calculate details for each circle
  for (let key = 1; key <= 4; key++) {
    const categoryDetails = {
      active: false,
    };

    categoriesState[key] = categoryDetails;
  }

  if (activeCategory !== 0) {
    categoriesState[activeCategory].active = true;
  }

  return categoriesState;
}

// Circle

const FragmentCircle = props => {
  let circleClass = 'circle circle-unknown'; //navigation.css

  if (props.empty) {
    circleClass = 'circle circle-empty';
  } else {
    if (props.discovered) {
      circleClass = 'circle circle-discovered';
    }
    if (props.active) {
      circleClass = 'circle circle-active';
    }
    if (props.highlighted) {
      circleClass += ' circle-highlighted';
    }
  }

  return (
    <div
      className={circleClass}
      id={props.key}
      key={props.key}
      onClick={props.handleClick}
    />
  );
}

const buildMatrixState = (rowCount, rowLength) => {
  const totalCircles = rowCount * rowLength;
  const matrixState = {};

  for (let key = 1; key <= totalCircles; key++) {
    const circleDetails = {
      active: false,
      discovered: false,
      highlighted: false,
      empty: false,
    };

    if (!objects[key-1]) {
      circleDetails.empty = true;
    }

    matrixState[key] = circleDetails;
  }
  matrixState[activeId].active = true;

  return matrixState;
}

//
//
// Class
//
//

class Navigation extends Component {
  constructor(props) {
    super(props)
    const initialRowCount = 15;
    const initialRowLength = 5;

    //aby sa pri prepinani medzi music/static modom zachoval stav navigacie
    if (matrixNavigation === null) {
      matrixNavigation = buildMatrixState(initialRowCount, initialRowLength);
    }

    this.state = {
      rowCount: initialRowCount,
      rowLength: initialRowLength,
      categories: buildCategoriesState(),
      matrix: matrixNavigation
    };

    this.handleClick = this.handleClick.bind(this);
    this.categorySelect = this.categorySelect.bind(this);
    this.handleMusic = this.handleMusic.bind(this);
    this.handleInfo = this.handleInfo.bind(this);
  }

  // CATEGORIES

  categoryHighlight(matrix, id) {
    for (let key = 0; key < toHighlight[id].length; key++) {
      matrix[toHighlight[id][key]].highlighted = true;
    }
    return matrix;
  }

  stopHighlight(matrix, previous) {
    for (let key = 0; key < toHighlight[previous].length; key++) {
      matrix[toHighlight[previous][key]].highlighted = false;
    }
    return matrix;
  }

  categorySelect(e) {
    const matrix = this.state.matrix;
    const categories = this.state.categories;
    const id = e.target.id;

    if (activeCategory === 0) {
      categories[id].active = true;
      this.categoryHighlight(matrix, id-1);
      activeCategory = id;
    } else {
      if (activeCategory === id) {
        categories[id].active = false;
        this.stopHighlight(matrix, activeCategory-1);
        activeCategory = 0;
      } else {
        categories[activeCategory].active = false;
        categories[id].active = true;
        this.stopHighlight(matrix, activeCategory-1);
        this.categoryHighlight(matrix, id-1);
        activeCategory = id;
      }
    }
    
    this.setState({ categories, matrix });
    matrixNavigation = this.state.matrix;
    // this.props.handleCategoryChange(categories);
    // this.props.handleMatrixChange(matrix);
  }

  categoriesBuilder() {
    var cats = [];

    cats.push(Category({
      key: 1,
      name: 'nature',
      active: this.state.categories[1].active,
      categorySelect: this.categorySelect,
    }));
    cats.push(Category({
      key: 2,
      name: 'industrial',
      active: this.state.categories[2].active,
      categorySelect: this.categorySelect,
    }));
    cats.push(Category({
      key: 3,
      name: 'street',
      active: this.state.categories[3].active,
      categorySelect: this.categorySelect,
    }));
    cats.push(Category({
      key: 4,
      name: 'waterside',
      active: this.state.categories[4].active,
      categorySelect: this.categorySelect,
    }));

    return ( <div> {cats} </div> );
  }

  // NAVIGATION

  handleClick(e) {
    const matrix = this.state.matrix;
    const id = e.target.id;

    matrix[id].active = true;
    matrix[activeId].active = false;
    matrix[activeId].discovered = true;

    this.setState({ matrix });
    activeId = id;
    this.props.handleIdChange(id);
    // this.props.handleMatrixChange(matrix);
    matrixNavigation = this.state.matrix;
  }

  rowBuilder(rowCount, rowLength, rows = []) {
    if (rowCount > 0) {
      const circleKey = rowCount * rowLength;
      rows.push(this.circleBuilder(circleKey, rowCount, rowLength));

      return this.rowBuilder(rowCount - 1, rowLength, rows);
    }
    return rows
  }

  circleBuilder(circleKey, rowCount, rowLength, row = []) {
    if (rowLength > 0) {
      const circle = this.state.matrix[circleKey];

      row.push(FragmentCircle({
        key: circleKey,
        active: circle.active,
        discovered: circle.discovered,
        highlighted: circle.highlighted,
        empty: circle.empty,
        handleClick: this.handleClick,
      }));

      return this.circleBuilder(circleKey - 1, rowCount, rowLength - 1, row);
    }
    return (<div key={'row-' + rowCount}>{row}</div>);
  }

  // MUSIC BUTTON

  handleMusic() {
    music = !music;
    this.props.handleMusicChange(music);
  }

  musicButtonBuilder() {
    let musicClass = 'musicbutton'; //navigation.css
    if (music) {
      musicClass += ' musicbutton-active';
    }

    return (
      <div
        className={musicClass}
        onClick={this.handleMusic}
      />
    );
  }

  // SECONDARY BUTTONS

  handleInfo() {
    info = true;
    this.props.handleInfoChange(info);
  }

  secondaryBuilder() {
    return (
      <div>
        <p className={'description'}>a bench in the castle grounds <br/>of bratislava castle</p>
        <div
          className={'secondary-map'}
          // onClick={this.handleMusic}
        />
        <div
          className={'secondary-info'}
          onClick={this.handleInfo}
        />
      </div>      
    );
  }

  // RENDER

  render() {
    return (
      <div>
        <div className="navigation">
          <img src={MapTitle} alt='MAP' className="map" />
          {this.rowBuilder(this.state.rowCount, this.state.rowLength)}
        </div>
        <div className="cats">
          {this.categoriesBuilder()}
          {this.musicButtonBuilder()}
        </div>
        <img src={HighlightTitle} alt='HIGHLIGHT' className="highlight" />
        <div className="secondary">
          {this.secondaryBuilder()}
        </div>
      </div>
    )
  }
}

export default Navigation;