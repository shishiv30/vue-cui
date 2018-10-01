export default {
    name: 'cuiMap',
    props: {
        lat: {
            default: 0
        },
        lng: {
            default: 0
        },
        zoom: {
            default: 8
        },
        type: {
            default: 0
        },
        streetview: {
            default: false
        },
        readonly: {
            default: false
        },
        autoresize: {
            default: false
        },
        clickableicons: {
            default: true
        },
        streetviewcontrol: {
            default: true
        },
        streetviewcontrolpos: {
            default: 'BOTTOM_RIGHT'
        },
        pancontrol: {
            default: true
        },
        pancontrolpos: {
            default: 'TOP_RIGHT'
        },
        rotatecontrol: {
            default: true
        },
        rotatecontrolpos: {
            default: 'TOP_CENTER'
        },
        zoomcontrol: {
            default: true
        },
        zoomcontrolpos: {
            default: 'BOTTOM_RIGHT'
        },
        maptypecontrol: {
            default: true
        },
        maptypecontrolpos: {
            default: 'TOP_RIGHT'
        },
        distancecontrol: {
            default: true
        },
        distancecontrolpos: {
            default: 'BOTTOM_LEFT'
        }
    },
    data() {
        return {
            markers: [],
            map: null,
            panorama: null,
            _mapType: this.type,
            _center: {
                lat: this.lat,
                lng: this.lng
            },
            _readonly: this.readonly,
            iconType: {
                icon_0: 'icon-house',
                icon_1: 'icon-cap',
                icon_16: 'icon-poi-bank',
                icon_15: 'icon-poi-worship',
                icon_13: 'icon-poi-recreation',
                icon_11: 'icon-poi-train',
                icon_10: 'icon-gas',
                icon_9: 'icon-taxi',
                icon_8: 'icon-poi-bus',
                icon_6: 'icon-poi-grocery',
                icon_4: 'icon-poi-coffee',
                icon_3: 'icon-poi-eat',
                icon_2: 'icon-poi-drink',
                icon_17: 'icon-poi-shopping'
            },
            markerDefaultOption: {
                lat: 0,
                lng: 0,
                iconType: 0,
                onclick: null,
                onmouseover: null,
                onmouseout: null,
                html: null,
                popTheme: null,
                popData: null,
                popTmp: null,
                popHeight: 100,
                zIndex: null
            }
        };
    },
    computed: {
        mapType: {
            get() {
                switch (this.$data._mapType) {
                    case 0:
                        return window.google.maps.MapTypeId.ROADMAP;
                    case 1:
                        return window.google.maps.MapTypeId.SATELLITE;
                    case 2:
                        return window.google.maps.MapTypeId.HYBRID;
                    case 3:
                        return window.google.maps.MapTypeId.TERRAIN;
                    default:
                        return window.google.maps.MapTypeId.ROADMAP;
                }
            },
            set: function(val) {
                this.$data._mapType = val;
            }
        },
        center: {
            get() {
                return new window.google.maps.LatLng(this.$data._center.lat, this.$data._center.lng);
            },
            set: function(val) {
                this.$data._center.lat = val.lat;
                this.$data._center.lng = val.lng;
            }
        },
        mapUISetting: {
            get() {
                return {
                    scrollwheel: !this.$data._readonly,
                    zoomable: !this.$data._readonly,
                    draggable: !this.$data._readonly,
                    disabledefaultui: this.$data._readonly
                }
            }
        }
    },
    methods: {
        initalMap() {
            var that = this;
            var mapOptions = {
                gestureHandling: 'greedy',
                center: this.center,
                mapTypeId: this.mapType,
                zoom: this.zoom,
                clickableIcons: this.clickableicons,
                streetViewControl: this.streetviewcontrol,
                streetViewControlPos: this.streetviewcontrolpos,
                panControl: this.pancontrol,
                panControlPos: this.pancontrolpos,
                rotateControl: this.rotatecontrol,
                rotateControlPos: this.rotatecontrolpos,
                zoomControl: this.zoomcontrol,
                zoomControlPos: this.zoomcontrolpos,
                mapTypeControl: this.maptypecontrol,
                mapTypeControlPos: this.maptypecontrolpos,
                distanceControl: this.distancecontrol,
                distanceControlPos: this.distancecontrolpos
            };
            Object.assign(mapOptions, this.mapUISetting);
            var map = this.map = new window.google.maps.Map(this.$el, mapOptions);
            window.google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
                if (that.mapUISetting.draggable) {
                    window.google.maps.event.addListener(map, 'dragstart', function() {
                        that.$emit('dragstart', map);
                    });
                    window.google.maps.event.addListener(map, 'dragend', function() {
                        that.$emit('dragend', map);
                    });
                }
                if (that.mapUISetting.zoomable) {
                    window.google.maps.event.addListener(map, 'zoom_changed', function() {
                        that.$emit('zoom_changed', map);
                    });
                }
                that.$emit('loaded', map);
            });
            if (this.onresize) {
                window.google.maps.event.addListener(map, 'resize', function() {
                    this.$emit('resize', map);
                });
            }
            if (this.autoresize) {
                window.google.maps.event.addDomListener(window, 'resize', function() {
                    this.fitBounds();
                });
            }
            if (this.streetview) {
                this.showStreetView();
            }
        },
        changeMaptype(id) {
            this.mapType = id;
            this.map.setMapTypeId(this.mapType);
        },
        changeCenter(lat, lng) {
            this.center = {
                lat,
                lng
            };
            return this.map.setCenter(this.center);
        },
        showStreetView() {
            var streetViewLocation = this.center;
            var sv = new window.google.maps.StreetViewService();
            sv.getPanoramaByLocation(streetViewLocation, 50, function(data, status) {
                if (status == 'OK') {
                    this.panorama = this.map.getStreetView();
                    this.panorama.setPosition(streetViewLocation);
                    this.panorama.setVisible(true);
                } else {
                    $(document).trigger('gmap.streetview.error');
                }
            });
        },
        hideStreetView() {
            this.panorama.setVisible(false);
        },
        getIconHtml: function(type) {
            var iconKey = 'icon_' + type;
            var iconClass = this.iconType[iconKey];
            return '<div class="map-marker poi-marker"><a class="pin" ><i class="' + iconClass + '"></i></div></div>';
        },
        createHouseMarker() {},
        createPoiMarker(id) {},
        createSchoolMarker() {},
        createMarker(markerOpt) {
            var that = this;
            var html = '';
            switch (markerOpt.type) {
                case 'house':
                    html = createHouseMarker();
                case 'school':
                    html = createSchoolMarker();
                case 'poi':
                    html = createPoiMarker();
            }
            var latlng = new window.google.maps.LatLng({lat: markerOpt.lat, lng: markerOpt.lng});
            var marker = new window.CustomMarker({
                latlng: latlng,
                map: this.map,
                html: this.getIconHtml(markerOpt.type),
                popData: markerOpt.popData,
                popTmp: markerOpt.popTmp,
                popHeight: markerOpt.popHeight,
                onclick: markerOpt.onclick,
                popTheme: markerOpt.popTheme,
                zIndex: markerOpt.zIndex
            });
            if (markerOpt.id) {
                marker.id = markerOpt.id;
            }
            return marker;
        },
        updateMarkStatus(marker, opt) {
            var $this = $(marker.div);
            if( opt.disabled!==undefined){
                marker.disabled = opt.disabled;
                if (opt.disabled) {
                    $this.attr('disabled', true);
                } else {
                    $this.removeAttr('disabled');
                }
            }
            if(opt.active!==undefined){
                marker.active =opt.active;
                if (opt.active) {
                    $this.addClass('active');
                } else {
                    $this.removeClass('active');
                }
            }
        },
        addMarker(opt) {
            var marker = null;
            if (!opt.lat || !opt.lng) {
                return null;
            }
            opt.id = 'mark' + opt.lat + '_' + opt.lng;
            marker = this.getMarkerById(opt.id);
            if (marker) {
                marker.setMap(this.map);
            } else {
                marker = this.createMarker(opt);
                if (marker) {
                    this.markers.push(marker);
                }
            }
            this.updateMarkStatus(marker, opt);
            return null;
        },
        addMarkers(options) {
            var self = this;
            if (options && options.length) {
                return options.map(function(option) {
                    return self.addMarker(option);
                });
            }
            return [];
        },
        findItem(lat, lng) {
            var key = 'mark' + lat + '_' + lng;
            for (var i = 0; i < this.markers.length; i++) {
                if (this.markers[i].id == key) {
                    return {element: markers[i], index: i};
                }
            }
            return {element: null, index: -1};
        },
        setAllMap(map) {
            var markerList = this.markers.getAllMarkers();
            for (var i = 0; i < markerList.length; i++) {
                markerList[i].setMap(map);
            }
        },
        hideMarkers() {
            context._setAllMap(null);
        },
        showMarkers() {
            context._setAllMap(map);
        },

        removeMarker(id) {
            var item = this.getMarkerWithIndexById(id);
            if (item.element) {
                this.destory(item.element);
                this.markers.splice(item.index);
            }
            return id;
        },
        removeMarkers(ids) {
            if (ids && ids.length) {
                return ids.map(function(id) {
                    return this.removeMarker(id);
                });
            }
            return [];
        },
        getMarkers() {
            return markers;
        },
        getBounds() {
            return map.getBounds();
        },
        setZoom(level) {
            if ($.isNumeric(level)) {
                map.setZoom(level);
            }
        },
        fitBounds(markers) {
            var list = markers || this.markers;
            if (list && list.length) {
                var bounds = new window.google.maps.LatLngBounds();
                list.forEach(function(item) {
                    if(!item.disabled){
                        if (item.latlng) {
                            bounds.extend(item.latlng);
                        } else if (item.lat && item.lng) {
                            bounds.extend(new window.google.maps.LatLng(item.lat, item.lng));
                        }
                    }
                })
                this.map.fitBounds(bounds);
            }
        },
        create(markerOpt) {
            var latlng = new window.google.maps.LatLng({lat: markerOpt.lat, lng: markerOpt.lng});
            var marker = new window.CustomMarker({
                latlng: latlng,
                map: markerOpt.map,
                html: '<div class="map-marker"><a class="pin" ><i class="' + markerOpt.icon + '"></i></div></div>',
                popData: markerOpt.popData,
                popTmp: markerOpt.popTmp,
                popHeight: markerOpt.popHeight,
                onclick: markerOpt.onclick,
                popTheme: markerOpt.popTheme,
                zIndex: markerOpt.zIndex
            });
            if (markerOpt.id) {
                marker.id = markerOpt.id;
            }
            return marker;
        },
        destory(marker) {
            $(marker).addClass('removeing');
            $(document).one('mouseup', function() {
                marker.setMap(null);
            });
        },
        getAllMarkers() {
            return this.markers;
        },
        getMarkerWithIndexById(id) {
            for (var i = 0; i < this.markers.length; i++) {
                if (this.markers[i].id == id) {
                    return {element: this.markers[i], index: i};
                }
            }
            return {element: null, index: -1};
        },
        getMarkerById(id) {
            return this.getMarkerWithIndexById(id).element;
        }
    },
    mounted: function() {
        var that = this;
        $.loadGMap().then(function() {
            that.initalMap();
        })
    }
}
