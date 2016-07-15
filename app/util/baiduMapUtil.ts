/**
 * Created by Ben on 6/14/2016.
 */
import {Injectable} from "@angular/core";

@Injectable()
export class BaiduMapUtil {

    static baiduMapOptionTemplate = {
        center: "",
        zoom: 15,
        markers: "",
        navCtrl: true,
        scaleCtrl: {
            width: 5,
            height: 40
        },
        overviewCtrl: true,
        enableScrollWheelZoom: true
    };
    
    static baiduMapOption = {
        center: {
            longitude: 121.60399778,
            latitude: 31.2109038
        },
        zoom: 15,
        markers: [{
            longitude: 121.60399778,
            latitude: 31.2109038,
            icon: 'img/baidu-map/point.png',
            width: 46,
            height: 32,
            title: '<span style="font-size:14px;color:#0A8021">车辆信息：</span>',
            content: 'Put description here',
        }],
        navCtrl: true,
        scaleCtrl: {
            width: 5,
            height: 40
        },
        overviewCtrl: true,
        enableScrollWheelZoom: true
    };

    static getOptionsByTemplate(center: any, marker_content: string) {
        var new_opt = Object.assign({}, BaiduMapUtil.baiduMapOptionTemplate);
        new_opt.center = center;
        new_opt.markers = [];
        new_opt.markers[0] = {
            longitude: center.longitude,
            latitude: center.latitude,
            icon: 'img/baidu-map/point.png',
            width: 46,
            height: 32,
            title: '<span style="font-size:14px;color:#0A8021">车辆信息：</span>',
            content: marker_content,
        };
        return new_opt;
    }
}