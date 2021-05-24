import React from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import SimplexNoise from"simplex-noise";
import "../three.css";

//import Loading from './gif/musicmode.gif';

let scene, camera, renderer;
var myObjPromise, myObjPromiseOriginal;

const circle = new THREE.TextureLoader().load( './data/circle.png' );

var music = false;
var loading = false;

const objSize = 70000;

let requestAnimationId = undefined

// Pole s url objektov, PO UPDATE SKOPIROVAT DO NAVIGATION!!! + update Map, update Sounds
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

class mThreeObject extends React.Component {

    constructor(props) {
        super(props); 
        this.state = {
            activeId: props.dataAppToThreeObject1,
            music: props.dataAppToThreeObject2,
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {activeId: props.dataAppToThreeObject1, music: props.dataAppToThreeObject2}
    }

    threeMount() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        renderer = new THREE.WebGLRenderer( { alpha: true } );

        camera.position.z =250;

        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor( 0x000000, 0);

        this.mount.appendChild( renderer.domElement );
    }

    promiseObject(url) {
        // loading = true;

        var loadModel = function(url) {
            return new Promise(resolve => {
                new OBJLoader().load(url, resolve);
            }); 
        }

        myObjPromise = loadModel(url);

        if (music) {
            myObjPromiseOriginal = loadModel(url);
        }

        // loading = false;
    }

    //
    //
    // show THREE OBJECT

    threeObject() {
        this.threeMount();

        var activeId = this.state.activeId;
        music = this.state.music;

        var mouseX = 0, mouseY = 0;
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;

        if (music) {
            var noise = new SimplexNoise();

            var context = new AudioContext();
            var analyser = context.createAnalyser();
            analyser.fftSize = 256;

            var dataArray = new Uint8Array(analyser.frequencyBinCount);

            var callback = function(stream) {
                var mic = context.createMediaStreamSource(stream);
                mic.connect(analyser);
            }
            
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            navigator.getUserMedia({ audio : true }, callback, console.log);
        }

        this.promiseObject(objects[activeId-1]);

        myObjPromise.then(myObj => {
            var material = myObj.children[0].material;

            material.size = 3;
            material.sizeAttenuation = true;
            material.map = circle;
            material.alphaTest = 0.5;
            material.transparent = true;

            myObj.scale.x = 80;
            myObj.scale.y = 80;
            myObj.scale.z = 80;

            scene.add(myObj);
            material.dispose();
        }).then( () => {
            loading = false;                                    //?
        });

        // HELPER FUNCTIONS

        var onWindowResize = function() {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
        
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        
            renderer.setSize( window.innerWidth, window.innerHeight );
        }
        
        var onDocumentMouseMove = function(event) {
            mouseX = ( - event.clientX + windowHalfX ) / 2;
            mouseY = ( - event.clientY + windowHalfY ) / 2;
        }

        document.addEventListener( 'mousemove', onDocumentMouseMove );
        window.addEventListener( 'resize', onWindowResize );

        var fractionate = function(val, minVal, maxVal) {
            return (val - minVal)/(maxVal - minVal);
        }
        
        var modulate = function(val, minVal, maxVal, outMin, outMax) {
            var fr = fractionate(val, minVal, maxVal);
            var delta = outMax - outMin;
            return outMin + (fr * delta);
        }
        
        // ANIMATE

        var animate = function () {
            requestAnimationId = requestAnimationFrame( animate );

            // if music mode is chosen, make points animations
            if (music) {
                analyser.getByteFrequencyData(dataArray);

                var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
                // var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);
                
                var lowerSum = lowerHalfArray.reduce((a, b) => a + b, 0);
                var lowerLength = lowerHalfArray.length;
                var lowerAvg = (lowerSum / lowerLength) || 0;
                var lowerAvgFr = lowerAvg / lowerLength;
                var distortionFr = modulate(lowerAvgFr, 0, 1, 0, 4);

                // background
                renderer.setClearColor( 0x330000, 0.1 + distortionFr*0.05);
                
                myObjPromise.then(myObj => {

                    const positions = myObj.children[0].geometry.attributes.position.array;
            
                    myObj.scale.x = 120;
                    myObj.scale.y = 120;
                    myObj.scale.z = 120;
            
                    myObjPromiseOriginal.then(myObj2 => {
                        scene.add( myObj );
                        const positions2 = myObj2.children[0].geometry.attributes.position.array;
            
                        myObj2.scale.x = 120;
                        myObj2.scale.y = 120;
                        myObj2.scale.z = 120;
            
                        for ( let i = 0; i < objSize; i ++ ) {
                            // var offset = 20;
                            var amp = 0.5;
                            var time = window.performance.now();
            
                            var vertex = new THREE.Vector3(positions2[i*3], positions2[i*3+1], positions2[i*3+2]);
            
                            var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0.5) * distortionFr * amp;
            
                            positions[i*3] = vertex.x + (distance*vertex.x*0.1);
                            positions[i*3+1] = vertex.y + (distance*vertex.y*0.1);
                            positions[i*3+2] = vertex.z + (distance*vertex.z*0.2);
                        }
                    });
            
                    myObj.children[0].geometry.attributes.position.needsUpdate = true;
                });
            }

            camera.position.x += ( mouseX - camera.position.x ) * .05;
            camera.position.y += ( - mouseY - camera.position.y ) * .05;

            camera.lookAt( scene.position );

            renderer.render( scene, camera );
        };

        animate();
    }
    // end of threeObject()

    //
    //
    // CLEAR MEMORY = delete all geometries, materials, objeects, scenes, cameras, renderers

    dispose() {
        myObjPromise.then(myObj => {
            if (scene) {
                scene.remove(myObj);
            }

            if (myObj.geometry) {
                myObj.geometry.dispose();
            }

            if (myObj.material) {
                if (myObj.material.length) {
                    for (let i = 0; i < myObj.material.length; ++i) {
                        myObj.material[i].dispose();
                    }
                }
                else {
                    myObj.material.dispose();
                }
            }
        });

        if(music) {
            myObjPromiseOriginal.then(myObj => {
                if (scene) {
                    scene.remove(myObj);
                }
                
                if (myObj.geometry) {
                    myObj.geometry.dispose();
                }
    
                if (myObj.material) {
                    if (myObj.material.length) {
                        for (let i = 0; i < myObj.material.length; ++i) {
                            myObj.material[i].dispose();
                        }
                    }
                    else {
                        myObj.material.dispose();
                    }
                }
            });
        }

        renderer && renderer.renderLists.dispose();
        renderer && renderer.dispose();

        if (requestAnimationId) {
            cancelAnimationFrame(requestAnimationId);
        }
        requestAnimationId = undefined;

        this.mount.removeChild( renderer.domElement );
			
        myObjPromise = null;
		scene = null;
        camera = null;
        renderer = null;
    }

    componentDidMount() {
        if (myObjPromise) {
            this.dispose();
        }
        loading = true;                          //?
        this.threeObject();
    }

    componentDidUpdate() {
        this.dispose();
        loading = true;                         //?
        this.threeObject();
    }

    componentWillUnmount() {
        this.dispose();
    }

    render() {
        if (loading) {
            return (
                <div className="loading"/>
            );
        } else {
            return (
                <div ref={ref => (this.mount = ref)} className = "object"/>
            );
        }
    } 
}

export default mThreeObject;