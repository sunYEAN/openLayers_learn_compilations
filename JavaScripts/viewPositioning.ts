// 高级视图定位
import 'ol/ol.css';
import {XYZ} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from "ol/proj";

// 矢量图资源
const source = new VectorSource({
    url: 'https://wtutu.oss-cn-beijing.aliyuncs.com/china.json',
    format: new GeoJSON(),
});

// layer的样式
const style = new Style({
    fill: new Fill({
        color: 'rgba(0, 0, 0, 0.2)',
    }),
    stroke: new Stroke({
        color: '#319FD3',
        width: 1,
    }),
    image: new CircleStyle({
        radius: 5,
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.6)',
        }),
        stroke: new Stroke({
            color: '#000',
            width: 2,
        }),
    }),
});

// 矢量layer,  绘制的图层
const vectorLayer = new VectorLayer({
    source: source,
    style: style,
});

// view
const view = new View({
    center: fromLonLat([106, 30]),
    zoom: 4,
});

const map = new Map({
    layers: [
        new TileLayer({
            source: new XYZ({
                url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
            }),
        }),
        vectorLayer
    ],
    target: 'map',
    view: view,
});

const zoomtoswitzerland = document.getElementById('zoomtoswitzerland');
(zoomtoswitzerland as HTMLButtonElement).addEventListener(
    'click',
    function () {
        const feature = source.getFeatures()[0];
        const polygon = feature.getGeometry();
        view.fit(polygon, {padding: [170, 50, 30, 150]});
    },
    false
);

const zoomtolausanne = document.getElementById('zoomtolausanne');
(zoomtolausanne as HTMLButtonElement).addEventListener(
    'click',
    function () {
        const feature = source.getFeatures()[1];
        const point = feature.getGeometry();
        view.fit(point, {
            duration: 200,
            minResolution: 50
        });
    },
    false
);

const centerlausanne = document.getElementById('centerlausanne');
(centerlausanne as HTMLButtonElement).addEventListener(
    'click',
    function () {
        const feature = source.getFeatures()[3];
        const point = feature.getGeometry();
        const size = map.getSize();
        view.centerOn(point.getCoordinates(), size, [window.innerWidth / 2, window.innerHeight / 2]);
    },
    false
);
