import React from 'react';

let objects = [ //zobrazuje sa to naopak (posledna je prva)
  null, null, './data/sounds/metro.m4a', null, null,
  null, null, './data/sounds/sprejebeton.m4a', './data/sounds/sprejekriky.m4a', null,
  null, './data/sounds/stromnasedenie.m4a', './data/sounds/retaze.m4a', './data/sounds/lavickabetonrastliny.m4a', null,
  null, './data/sounds/stromx.m4a', './data/sounds/dvaaviacstromov.m4a', null, null,
  null, './data/sounds/kmenakonike.m4a', './data/sounds/gotickyaltanok.m4a', null, null,
  './data/sounds/pristavnymost.m4a', './data/sounds/apollo.m4a', './data/sounds/uviazanielode.m4a', './data/sounds/snp.m4a', null,
  null, null, './data/sounds/elektrikaskodovka.m4a', './data/sounds/stromsbrectanom.m4a', './data/sounds/promenada.m4a',
  null, './data/sounds/elektrikajakubovo.m4a', './data/sounds/tehlovystlpik.m4a', './data/sounds/lavicka.m4a', null,
  null, null, './data/sounds/kvetinacnabetone.m4a', './data/sounds/lampa.m4a', null,
  null, './data/sounds/pneumatiky.m4a', './data/sounds/staredvere.m4a', './data/sounds/kosslobody.m4a', null,
  './data/sounds/lavickaistropolis.m4a', './data/sounds/trznica.m4a', null, './data/sounds/kachlickyprirodovedecka.m4a', null,
  null, './data/sounds/pamatnik-deti.m4a', './data/sounds/pamatnik-kruh.m4a', './data/sounds/pamatnik-mec.m4a', null,
  null, './data/sounds/prazska.m4a', './data/sounds/kalvaria.m4a', './data/sounds/stromhorskypark.m4a', null,
  './data/sounds/hrdzavyplot.m4a', null, null, './data/sounds/trubkakramare.m4a', './data/sounds/plechkramare.m4a',
  './data/sounds/vodnybicykel.m4a', null, null, null, null,
];

var audioEl;

class Sounds extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeId: props.dataAppToSounds,
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {activeId: props.dataAppToSounds};
  }

  componentDidMount() {
    audioEl = document.getElementsByClassName("audio-element")[0];
    audioEl.loop = true;
    audioEl.play();
  }

  componentDidUpdate() {
    audioEl.pause();
    audioEl.load();
    audioEl.play();
  }

  render() {
    return (
      <div>
        <audio className="audio-element">
          <source src={objects[this.state.activeId-1]}></source>
        </audio>
      </div>
    )
  }
}

export default Sounds;