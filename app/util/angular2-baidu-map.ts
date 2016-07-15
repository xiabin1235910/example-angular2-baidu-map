import {Component, SimpleChange, Input, Output, EventEmitter, OnInit, OnChanges, ChangeDetectionStrategy, ElementRef} from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'baidu-map',
    styles: [`
        .offlinePanel{
            width: 100%;
            height: 100%;
            background-color: #E6E6E6;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
        }
    `, `
        .offlineLabel{
            font-size: 30px;
        }
    `],
    template: `
        <div class="offlinePanel">
            <label class="offlineLabel">{{ offlineWords }}</label>
        </div>
    `
})
export class BaiduMap implements OnInit, OnChanges {

    @Input() ak: string;
    @Input() options: MapOptions;
    @Input('offline') offlineOpts: OfflineOptions;
    @Output() onMapLoaded = new EventEmitter();
    @Output() onMarkerClicked = new EventEmitter();

    map: any;
    offlineWords: string;
    previousMarkers: PreviousMarker[] = [];

    constructor(private el: ElementRef) { }

    ngOnInit() {
        let offlineOpts: OfflineOptions = Object.assign({}, defaultOfflineOpts, this.offlineOpts);
        this.offlineWords = offlineOpts.txt;
        loader(this.ak, offlineOpts, this._draw.bind(this));
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        let baiduMap = (<any>window)['baiduMap'];
        if (!baiduMap || baiduMap.status !== MapStatus.LOADED) {
            return;
        }
        let opts = changes['options'].currentValue;
        reCenter(this.map, opts);
        reZoom(this.map, opts);
        redrawMarkers.bind(this)(this.map, this.previousMarkers, opts);
    }

    _draw() {
        let options: MapOptions = Object.assign({}, defaultOpts, this.options);
        this.map = createInstance(options, this.el.nativeElement);
        this.onMapLoaded.emit(this.map);
        redrawMarkers.bind(this)(this.map, this.previousMarkers, options);
    }
}

const defaultOpts: MapDefaultOptions = {
    navCtrl: true,
    scaleCtrl: true,
    overviewCtrl: true,
    enableScrollWheelZoom: true,
    zoom: 10
}

const defaultOfflineOpts: OfflineOptions = {
    retryInterval: 30000,
    txt: 'OFFLINE'
}

export interface MapDefaultOptions {
    navCtrl?: boolean;
    scaleCtrl?: any;
    overviewCtrl?: boolean;
    enableScrollWheelZoom?: boolean;
    zoom?: number;
}

export interface MapOptions extends MapDefaultOptions {
    center: { longitude: number, latitude: number };
    markers?: MarkerOptions[];
}

enum MapStatus {
    LOADING,
    LOADED
}

interface MapObjct {
    status: MapStatus,
    callbacks: Function[]
}

export interface OfflineOptions {
    retryInterval?: number,
    txt?: string
}

export interface PreviousMarker {
    marker: any;
    listeners: Function[];
}

export interface MarkerOptions {
    longitude: number,
    latitude: number,
    icon?: string,
    width?: number,
    height?: number,
    title?: string,
    content?: string,
    enableMessage?: boolean
}

const loader = function(ak: string, offlineOpts: OfflineOptions, callback: Function) {
    let MAP_URL: string = `http://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=baidumapinit`;

    let win: any = (<any>window);

    let baiduMap: MapObjct = win['baiduMap'];
    if (baiduMap && baiduMap.status === MapStatus.LOADING) {
        return baiduMap.callbacks.push(callback);
    }

    if (baiduMap && baiduMap.status === MapStatus.LOADED) {
        return callback();
    }

    win['baiduMap'] = { status: MapStatus.LOADING, callbacks: [] };
    win['baidumapinit'] = function() {
        win['baiduMap'].status = MapStatus.LOADED;
        callback();
        win['baiduMap'].callbacks.forEach((cb: Function) => cb());
        win['baiduMap'].callbacks = [];
    };

    let createTag = function() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = MAP_URL;
        script.onerror = function() {
            Array.prototype
                .slice
                .call(document.querySelectorAll('baidu-map div'))
                .forEach(function(node: any) {
                    node.style.opacity = 1;
                });
            document.body.removeChild(script);
            setTimeout(createTag, offlineOpts.retryInterval);
        };
        document.body.appendChild(script);
    };

    createTag();
};

const createInstance = function(opts: MapOptions, element: any) {
    var BMap: any = (<any>window)['BMap'];
    // create map instance
    var map = new BMap.Map(element);

    // init map, set central location and zoom level
    map.centerAndZoom(new BMap.Point(opts.center.longitude, opts.center.latitude), opts.zoom);
    if (opts.navCtrl) {
        // add navigation control
        map.addControl(new BMap.NavigationControl());
    }
    if (opts.scaleCtrl) {
        // add scale control
        map.addControl(new BMap.ScaleControl({offset: new BMap.Size(opts.scaleCtrl.width, opts.scaleCtrl.height)}));
    }
    if (opts.overviewCtrl) {
        //add overview map control
        // default --- BMAP_ANCHOR_BOTTOM_RIGHT
        map.addControl(new BMap.OverviewMapControl({isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
    }
    if (opts.enableScrollWheelZoom) {
        //enable scroll wheel zoom
        map.enableScrollWheelZoom();
    }
    return map;
};

const createMarker = function(marker: MarkerOptions, pt: any) {
    var BMap: any = (<any>window)['BMap'];
    if (marker.icon) {
        var icon = new BMap.Icon(marker.icon, new BMap.Size(marker.width, marker.height));
        return new BMap.Marker(pt, { icon: icon });
    }
    return new BMap.Marker(pt);

};

const redrawMarkers = function(map: any, previousMarkers: PreviousMarker[], opts: MapOptions) {
    var BMap: any = (<any>window)['BMap'];
    var self = this;

    previousMarkers.forEach(function({marker, listeners}) {
        listeners.forEach(listener => { marker.removeEventListener('click', listener); });
        map.removeOverlay(marker);
    });

    previousMarkers.length = 0;

    if (!opts.markers) {
        return;
    }

    opts.markers.forEach(function(marker: MarkerOptions) {

        var marker2 = createMarker(marker, new BMap.Point(marker.longitude, marker.latitude));

        // add marker to the map
        map.addOverlay(marker2);
        let previousMarker: PreviousMarker = { marker: marker2, listeners: [] };
        previousMarkers.push(previousMarker);


        let onMarkerClickedListener = () => {
            self.onMarkerClicked.emit(marker2);
        };
        marker2.addEventListener('click', onMarkerClickedListener);
        previousMarker.listeners.push(onMarkerClickedListener);

        if (!marker.title && !marker.content) {
            return;
        }
        let msg = `<p>${marker.title || ''}</p><p>${marker.content || ''}</p>`;
        let infoWindow2 = new BMap.InfoWindow(msg, {
            enableMessage: !!marker.enableMessage
        });

        // add default behavior...
        marker2.openInfoWindow(infoWindow2);
        
        let openInfoWindowListener = function() {
            this.openInfoWindow(infoWindow2);
        };
        previousMarker.listeners.push(openInfoWindowListener);
        marker2.addEventListener('click', openInfoWindowListener);
    });
};

const reCenter = function(map: any, opts: MapOptions) {
    var BMap: any = (<any>window)['BMap'];
    if (opts.center) {
        map.setCenter(new BMap.Point(opts.center.longitude, opts.center.latitude));
    }
};
const reZoom = function(map: any, opts: MapOptions) {
    if (opts.zoom) {
        map.setZoom(opts.zoom);
    }
};
