import 'ol/ol.css';
import {Feature, Map, Overlay, View} from 'ol'
import {OSM, TileDebug, XYZ} from 'ol/source';
import {Tile as TileLayer} from 'ol/layer';
import {fromLonLat, ProjectionLike, transform} from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Point} from "ol/geom";
import {Circle, Fill, Icon, Stroke, Style} from "ol/style";
import {Draw, DragBox, Translate} from "ol/interaction";
import GeometryType from "ol/geom/GeometryType";
import TileGrid from "ol/tilegrid/TileGrid";
import {defaults, MousePosition} from "ol/control";
import {GeoJSON} from "ol/format";

const img = require('../images/location.png');
const center = transform(
    [106.53936446, 29.58937005],
    'EPSG:4326',
    'EPSG:3857'
);

const source = new VectorSource({
    features: [
        new Feature({
            geometry: new Point(center)
        })
    ],
})
const vectorLayer = new VectorLayer({
    source: source,
    style: [
        new Style({
            image: new Circle({
                radius: 5,
                stroke: new Stroke({
                    color: '#000'
                })
            }),
        }),
        new Style({
            image: new Icon({
                size: [200, 200],
                src: img,
                scale: 0.15,
                anchor: [0.5, 1],
                offset: [0, -2]
            })
        })
    ],
});

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new XYZ({
                url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
            })
        }),
        new VectorLayer({
            source: new VectorSource({
                url: 'https://geo.datav.aliyun.com/areas_v2/bound/100000.json',
                format: new GeoJSON({
                    dataProjection: 'EPSG:4326'
                })
            }),
        }),
        vectorLayer
    ],
    view: new View({
        zoom: 4,
        center: center,
        projection: 'EPSG:3857'
    }),
    controls: defaults().extend([
        new MousePosition({
            target: 'info',
            coordinateFormat: (p0)  => {
                return transform(p0 as [x: number, y: number], 'EPSG:3857', 'EPSG:4326').toString();
            }
        })
    ])
})

function addMarker (coordinate: [x: number, y: number]) {
    const feature = new Feature({
        geometry: new Point(fromLonLat(coordinate)),
        name: 'point',
        population: 4000,
        rainfall: 500
    })
    source.addFeature(feature);
}
map.on("click", (e) => {
    console.log(e.coordinate)
    const coordinate = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
    console.log(coordinate);
    addMarker(coordinate);
})
