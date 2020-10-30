import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileGrid from 'ol/tilegrid/TileGrid';
import {Tile as TileLayer} from 'ol/layer';
import View from 'ol/View';
import {ScaleLine, MousePosition, ZoomSlider, defaults} from 'ol/control';
import XYZ from 'ol/source/XYZ';
import {transform} from 'ol/proj';
import {Stamen, TileDebug} from "ol/source";

let visible = false;
let mapConsts = {
    resolutions: [
        0.7031250000000002, 0.3515625000000001, 0.17578125000000006,
        // 对应的 arcgisserver 切片的分辨率
        0.0624062618086491, 0.04394531353227711,
        0.021972656766138556, 0.010986328383069278, 0.005493164191534639, 0.0027465809060368165, 0.0013732916427489112,
        6.866458213744556E-4, 3.433229106872278E-4, 1.716614553436139E-4, 8.582953794130404E-5, 4.291595870115493E-5,
        2.1457979350577466E-5, 1.0728989675288733E-5, 5.363305107141452E-6, 2.681652553570726E-6,
    ],
};
// arcgis server默认origin
let origin = [-400, 399.9999999999998];
let url = 'https://yhxt.jxgsgl.com:7031/arcgis/rest/services/jx/GTJxMap2020/MapServer/tile/{z}/{y}/{x}';
//处理地图偏移问题
let tileGrid = new TileGrid({
    origin: origin,
    // 指定地图范围
    resolutions: mapConsts.resolutions.slice(3, 17),
});


let osmSource = new XYZ({
    url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
});

let map = new Map({
    target: 'map',
    layers: [
        // new TileLayer({
        //     source: osmSource
        // }),
        new TileLayer({
            source: osmSource
        }),
        new TileLayer({
            source: new Stamen({
                layer: 'watercolor'
            }),
            visible: visible
        }),

        new TileLayer({
            source: new TileDebug({
                tileGrid: osmSource.getTileGrid(),
            })
        })
    ],
    view: new View({
        zoom: 7,
        center: [0, 0],
        projection: 'EPSG:3857' // 扁瓜, // WGS84 的 EPSG代码 ，EGS84是目前最流行的地理坐标系
        // 3857 // web端墨卡托投影， 越往两极被拉升的越大。
    }),
    controls: defaults().extend([
        new ScaleLine(),
        new ZoomSlider(),
        new MousePosition({
            target: 'info'
        })
    ])
});

document.getElementById('actionBar').addEventListener('click', function () {
    const layers = map.getLayers();
    visible = !visible;
    layers.item(1).setVisible(visible);
})
