/**
 * Created by Ben on 6/17/2016.
 */
import {BaiduMapOption} from "../util/baiduMapOption";
import {Router} from "@angular/router-deprecated";

export abstract class MapComponent {
    opts:BaiduMapOption;
    BMap:any;
    map:any;
    protected router: Router;

    constructor(_router: Router) {
        this.router = _router;
    }

    loadMap(map:any) {
        this.map = map;
        this.BMap = (<any>window)['BMap'];
        this.setMapStyle();
        this.drawCanvas();
    }

    abstract setMapStyle();
    
    abstract drawCanvas();
}