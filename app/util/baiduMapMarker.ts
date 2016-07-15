/**
 * Created by Ben on 6/16/2016.
 */
export class BaiduMapMarker {
    longitude:number;
    latitude:number;
    icon:string;
    width:number;
    height:number;
    title:string;
    content:string;

    constructor(longitude?: number, latitude?: number, content?: string, title?: string, icon?: string, width?: number, height?: number) {
        this.longitude = longitude ? longitude : 121.60399778;
        this.latitude = latitude ? latitude : 31.2109038;
        this.content = content ? content : '';
        this.icon = icon ? icon : 'img/baidu-map/point.png';
        this.width = width ? width : 46;
        this.height = height ? height : 32;
        this.title = title ? title : '<span style="font-size:14px;color:#0A8021">车辆信息：</span>';
    }

    setTitle(_title: string): BaiduMapMarker {
        this.title = _title;
        return this;
    }
}