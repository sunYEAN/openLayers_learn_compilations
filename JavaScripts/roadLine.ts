import 'ol/ol.css';
import {Feature, Map, View} from 'ol';
import TileLayer from "ol/layer/Tile";
import {XYZ} from "ol/source";
import {fromLonLat} from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {LineString} from "ol/geom";
import {Style, Stroke, Fill} from "ol/style";


interface FeatureType {
    points: Array<Array<number>>,
    JcNumber: string,
    name: string,
    scale: string,
    PQI: string,
    PCI: string,
    RQI: string
}
export default class RoadLine {
    static map: Map;
    static renderMap(center: [lng: number, lat: number]): void {
        if (!RoadLine.map) {
            RoadLine.map = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
                        })
                    })
                ],
                view: new View({
                    zoom: 5,
                    center: fromLonLat(center),
                    projection: 'EPSG:3857' // 标准坐标系
                })
            })
        }
    }

    // 绘制 vectorLayer
    static renderRoad(lines: Array<FeatureType>) {
        let center,
            vectorSource = new VectorSource()

        // 添加线段
        for (let i = 0; i < lines.length; i++) {

            const points = lines[i].points.map(item => fromLonLat(item));

            if (i === 0) {
                center = points[0];
            }

            const feature = new Feature({
                geometry: new LineString(points)
            });

            vectorSource.addFeature(feature);
        }

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
                stroke: new Stroke({
                    color: '#359844',
                    width: 10,
                }),
                fill: new Fill({
                    color: 'rgba(0,0,0,0.5)'
                })
            })
        });

        RoadLine.map.addLayer(vectorLayer);
        RoadLine.map.getView().setCenter(center);
    }
}
