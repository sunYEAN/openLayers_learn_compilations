import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import {DragBox, Select} from 'ol/interaction';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {platformModifierKeyOnly} from 'ol/events/condition';

const vectorSource = new VectorSource({
    url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
    format: new GeoJSON(),
});

const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        new VectorLayer({
            source: vectorSource,
        })
    ],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2,
        constrainRotation: 16,
    }),
});

// a normal select interaction to handle click
const select = new Select();
map.addInteraction(select);
const selectedFeatures = select.getFeatures();



// clear selection when drawing a new box and when clicking on the map

const infoBox: HTMLElement | null= document.getElementById('info');

selectedFeatures.on(['add', 'remove'], function () {
    const names = selectedFeatures.getArray().map(function (feature) {
        return feature.get('name');
    });
    if (names.length > 0) {
        (infoBox as HTMLElement).innerHTML = names.join(', ');
    } else {
        (infoBox as HTMLElement).innerHTML = 'No countries selected';
    }
})