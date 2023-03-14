/*
 * wmYMap plugin
 *
 * Data attributes:
 * - data-control="wm-ymap" - enables the plugin on an element
 * - data-option="value" - an option with a value
 */

+function ($) { "use strict";
    var Base = $.wn.foundation.base,
        BaseProto = Base.prototype

    var WmYMap = function (element, options) {
        this.$el = $(element)
        this.options = options || {}

        $.wn.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    WmYMap.prototype = Object.create(BaseProto)
    WmYMap.prototype.constructor = WmYMap

    WmYMap.prototype.init = function() {
        if (this.options.mode === null) {
            this.options.mode = this.$el.data('mode')
        }

        if (this.options.isPreview === null) {
            this.options.isPreview = this.$el.data('isPreview') != 0
        }

        if (this.options.usePlacemark === null) {
            this.options.usePlacemark = this.$el.data('usePlacemark') != 0
        }

        this.$el.one('dispose-control', this.proxy(this.dispose))

        this.$input = $('[data-wm-ymap-input]', this.$el)
        this.$map = $('[data-wm-ymap-map]', this.$el)

        this.initCoords()

        ymaps.ready(() => {
            this.initMap()

            if (this.options.usePlacemark) {
                this.initPlacemark()
            }
        })
    }

    WmYMap.prototype.dispose = function() {
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.wmYMap')

        this.$el = null
        this.$input = null
        this.$map = null

        this.coords = null
        this.map = null
        this.placemark = null
        this.options = null

        BaseProto.dispose.call(this)
    }

    WmYMap.prototype.initCoords = function() {
        if (this.options.mode == 'json') {
            this.coords = $.extend(
                {
                    center: [0, 0],
                    zoom: 1,
                },
                (this.options.usePlacemark ? {placemark: [0, 0]} : {}),
                JSON.parse(this.$input.val() || '{}')
            )
        }

        if (this.options.mode == 'fields') {
            console.log(this.options.isPreview)
            console.log($(this.$el.data('field-center') + '-group').length)
            console.log($(this.$el.data('field-center_latitude') + '-group .form-control').text())

            if (this.options.isPreview) {
                this.coords = $.extend(
                    {
                        center: (
                            $(this.$el.data('field-center') + '-group').length
                            ? $(this.$el.data('field-center') + '-group .form-control').text().split(',') || [0, 0]
                            : [
                                $(this.$el.data('field-center_latitude') + '-group .form-control').text() || 0,
                                $(this.$el.data('field-center_longitude') + '-group .form-control').text() || 0
                            ]
                        ),
                        zoom: $(this.$el.data('field-zoom') + '-group .form-control').text()  || 1,
                    },
                    (this.options.usePlacemark ? {placemark: (
                        $(this.$el.data('field-placemark') + '-group').length
                        ? $(this.$el.data('field-placemark') + '-group .form-control').text().split(',') || [0, 0]
                        : [
                            $(this.$el.data('field-placemark_latitude') + '-group .form-control').text() || 0,
                            $(this.$el.data('field-placemark_longitude') + '-group .form-control').text() || 0
                        ]
                    )} : {})
                )
            } else {
                this.coords = $.extend(
                    {
                        center: (
                            $(this.$el.data('field-center')).length
                            ? $(this.$el.data('field-center')).val().split(',') || [0, 0]
                            : [
                                $(this.$el.data('field-center_latitude')).val() || 0,
                                $(this.$el.data('field-center_longitude')).val() || 0
                            ]
                        ),
                        zoom: $(this.$el.data('field-zoom')).val() || 1,
                    },
                    (this.options.usePlacemark ? {placemark: (
                        $(this.$el.data('field-placemark')).length
                        ? $(this.$el.data('field-placemark')).val().split(',') || [0, 0]
                        : [
                            $(this.$el.data('field-placemark_latitude')).val() || 0,
                            $(this.$el.data('field-placemark_longitude')).val() || 0
                        ]
                    )} : {})
                )
            }

            console.log(this.coords)
        }
    }

    WmYMap.prototype.initMap = function() {
        this.map = new ymaps.Map(this.$map.get(0), {
            center: this.coords.center,
            zoom: this.coords.zoom,
            controls: []
        });

        if (this.options.isPreview) {
            this.map.behaviors.disable(['drag', 'scrollZoom', 'dblClickZoom', 'rightMouseButtonMagnifier', 'multiTouch'])
        } else {
            this.map.controls.add(new ymaps.control.FullscreenControl())
            this.map.controls.add(new ymaps.control.ZoomControl())
            this.addSearchControl()

            this.map.events.add('click', (e) => {
                if (this.options.usePlacemark) {
                    this.placemark.geometry.setCoordinates(e.get('coords'))
                    this.options.placemark = e.get('coords')
                }

                this.updateCoords()
            })

            this.map.events.add('actionend', (e) => {
                this.updateCoords()
            })
        }
    }

    WmYMap.prototype.addSearchControl = function() {
        var searchControl = new ymaps.control.SearchControl({
            options: {
                size: 'large',
                provider: 'yandex#map'
            }
        });

        searchControl.events.add('resultselect', (e) => {
            if (this.options.usePlacemark) {
                var coordinates = searchControl.getResultsArray()[searchControl.getSelectedIndex()].geometry.getCoordinates()
                this.placemark.geometry.setCoordinates(coordinates)
            }

            this.updateCoords()
            searchControl.clear()
        });

        this.map.controls.add(searchControl)
    }

    WmYMap.prototype.initPlacemark = function() {
        this.placemark = new ymaps.Placemark(this.coords.placemark, {}, {
            preset: 'islands#redIcon',
            draggable: !this.options.isPreview
        })

        if (!this.options.isPreview) {
            this.placemark.events.add('dragend', () => {
                this.updateCoords()
            })
        }

        this.map.geoObjects.add(this.placemark)
    }

    WmYMap.prototype.updateCoords = function() {
        this.coords.center = this.map.getCenter()
        this.coords.zoom = this.map.getZoom()

        if (this.options.usePlacemark) {
            this.coords.placemark = this.placemark.geometry.getCoordinates()
        }

        if (this.options.mode == 'json') {
            this.$input.val(JSON.stringify(this.coords))
        }

        if (this.options.mode == 'fields') {
            $(this.$el.data('field-center')).val(this.coords.center)
            $(this.$el.data('field-center_latitude')).val(this.coords.center[0])
            $(this.$el.data('field-center_longitude')).val(this.coords.center[1])
            $(this.$el.data('field-zoom')).val(this.coords.zoom)

            if (this.options.usePlacemark) {
                $(this.$el.data('field-placemark')).val(this.coords.placemark)
                $(this.$el.data('field-placemark_latitude')).val(this.coords.placemark[0])
                $(this.$el.data('field-placemark_longitude')).val(this.coords.placemark[1])
            }
        }
    }

    WmYMap.DEFAULTS = {
        mode: null,
        isPreview: null,
        usePlacemark: null
    }

    // PLUGIN DEFINITION
    // ============================

    var old = $.fn.wmYMap

    $.fn.wmYMap = function(option) {
        var args = arguments;

        return this.each(function() {
            var $this   = $(this)
            var data    = $this.data('oc.wmYMap')
            var options = $.extend({}, WmYMap.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.wmYMap', (data = new WmYMap(this, options)))
            if (typeof option == 'string') data[option].apply(data, args)
        })
      }

    $.fn.wmYMap.Constructor = WmYMap

    $.fn.wmYMap.noConflict = function() {
        $.fn.wmYMap = old
        return this
    }

    $(document).render(function() {
        $('[data-control="wm-ymap"]').wmYMap()
    })

}(window.jQuery);
