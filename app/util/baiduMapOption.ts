/**
 * Created by Ben on 6/16/2016.
 */
import {BaiduMapMarker} from "./baiduMapMarker";
export class BaiduMapOption {
    center:any;
    zoom:number;
    markers:Array<BaiduMapMarker>;
    navCtrl:boolean;
    scaleCtrl:any;
    overviewCtrl:boolean;
    enableScrollWheelZoom:boolean;

    constructor(center?:any, markers?:Array<BaiduMapMarker>, zoom?:number, navCtrl?: boolean, scaleCtrl?:any, overviewCtrl?:boolean, enableScrollWheelZoom?:boolean) {
        this.center = center ? center : {
            longitude: 121.60399778,
            latitude: 31.2109038
        };
        this.markers = markers ? markers : [];
        this.zoom = zoom ? zoom : 15;
        this.navCtrl = navCtrl ? navCtrl : true;
        this.scaleCtrl = scaleCtrl ? scaleCtrl : {
            width: 5,
            height: 40
        };
        this.overviewCtrl = overviewCtrl ? overviewCtrl : true;
        this.enableScrollWheelZoom = enableScrollWheelZoom ? enableScrollWheelZoom : true;
    }

    pushMarker(marker:BaiduMapMarker): BaiduMapOption {
        this.markers.push(marker);
        return this;
    }
}