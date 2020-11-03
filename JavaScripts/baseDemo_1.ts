import 'ol/ol.css';
import {Feature, Map, Overlay, View} from 'ol'
import {XYZ} from 'ol/source';
import {Tile as TileLayer} from 'ol/layer';
import {fromLonLat} from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Point} from "ol/geom";
import {Circle, Fill, Stroke, Style} from "ol/style";
import {Draw, DragBox} from "ol/interaction";
import GeometryType from "ol/geom/GeometryType";

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new XYZ({
                url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
            })
        }),
    ],
    view: new View({
        zoom: 8,
        center: [0, 0],
        minZoom: 4,
        maxZoom: 15,
        projection: 'EPSG:3857',
        constrainResolution: true
    })
})
let el: HTMLElement | null;
el = document.getElementById('info')
function addMarker(el: HTMLElement, coordinate: [lng: number, lat: number]) {
    return new Overlay({
        element: el,
        position: fromLonLat(coordinate),
        offset: [0, 0],
        autoPan: true
    })
}

const pointsList = [
    [0, 0],
    [106.33,29],
];
const features = [];
for (let i = 0; i < pointsList.length; i++) {
    const point = new Feature({
        geometry: new Point(fromLonLat(pointsList[i]))
    });//构点
    point.set('data', {name: '12312321'});
    point.setStyle([
        new Style({
            image: new Circle({
                radius: 100,
                stroke: new Stroke({
                    color: '#333'
                }),
                fill: new Fill({
                    color: 'rgba(0,0,0,0.5)'
                })
            })
        })
    ])
    features.push(point);
}
map.addOverlay(addMarker(el as HTMLElement, [0, 0]));

const source = new VectorSource({
    features: features
})

const pointLayer = new VectorLayer({
    source: source,
});
map.addLayer(pointLayer);

const draw = new Draw({
    source: source,
    type: GeometryType.CIRCLE,
    style: new Style({
        image: new Circle({
            radius: 4
        })
    })
})

map.addInteraction(draw);

