import React from 'react';
import mapboxgl from 'mapbox-gl';
import './map.css';

const locationLat = [
  null, null, 48.093801, null, null,
  null, null, 48.094523, 48.093969, null,
  null, 48.107734, 48.102450, 48.097751, null,
  null, 48.136113, 48.136113, null, null,
  null, 48.135618, 48.134045, null, null,
  48.133760, 48.134358, 48.136586, 48.136929, null,
  null, null, 48.141532, 48.141907, 48.143161,
  null, 48.143850, 48.144397, 48.142289, null,
  null, null, 48.145405, 48.146161, null,
  null, 48.150013, 48.151375, 48.152720, null,
  48.158561, 48.157362, null, 48.148841, null,
  null, 48.159203, 48.159203, 48.159203, null,
  null, 48.159959, 48.160330, 48.160187, null,
  48.178587, null, null, 48.166760, 48.166361,
  48.187033, null, null, null, null,
];
const locationLng = [
  null, null, 17.109355, null, null,
  null, null, 17.109346, 17.109271, null,
  null, 17.119957, 17.108921, 17.110219, null,
  null, 17.120805, 17.120805, null, null,
  null, 17.130201, 17.113912, null, null,
  17.138520, 17.128285, 17.122677, 17.104718, null,
  null, null, 17.112417, 17.103040, 17.078974,
  null, 17.121171, 17.118235, 17.102886, null,
  null, null, 17.115236, 17.114630, null,
  null, 17.126111, 17.121254, 17.112588, null,
  17.125884, 17.125438, null, 17.070983, null,
  null, 17.117899, 17.117899, 17.117899, null,
  null, 17.103504, 17.101578, 17.088770, null,
  17.185456, null, null, 17.086064, 17.083742,
  17.189900, null, null, null, null,
];

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtLWFudCIsImEiOiJSLUx1SURJIn0.QTPlnr_Xse6dYc96m47H4A';

class Map extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeId: props.dataAppToMap,
      map: null,
      lng: 17.10775,
      lat: 48.16444,
      zoom: 14.9
    }

    if (props.dataAppToMap !== 0) {
      this.setState({lng: locationLng[props.dataAppToMap-1], lat: locationLat[props.dataAppToMap-1]})
    }
    this.mapContainer = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    return {activeId: props.dataAppToMap};
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    
    const mapip = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: 'mapbox://styles/sam-ant/ckosom8xq3fsk17kc1pevhryl',
      center: [lng, lat],
      zoom: zoom 
    });

    this.setState({map:mapip});
  }

  componentDidUpdate() {
    if (this.state.activeId !== 0) {
      this.setState({lng: locationLng[this.state.activeId-1], lat: locationLat[this.state.activeId-1]});
      this.state.map.flyTo({center: [this.state.lng, this.state.lat], zoom: this.state.zoom, essential:true});
    }
  }

  render() {
    return <div ref={this.mapContainer} className="map-container" />
  }
}

export default Map;