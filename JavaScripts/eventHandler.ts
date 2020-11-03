import XLSX from "xlsx";
import RoadLine from './roadLine';
import {excelToJson} from '../utils'


RoadLine.renderMap([106.33, 29.35]);


const file = document.getElementById('file');
(file as HTMLInputElement).addEventListener('change', function (e) {
    // @ts-ignore
    const file = this.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e) {
        // @ts-ignore
        let data = e.target.result;
        let workbook = XLSX.read(data, {type: "binary"});
        let sheets = workbook.Sheets;

        const key = '道路地理数据';
        const result = excelToJson[key](sheets[key]);
        RoadLine.renderRoad(result);
    }
})