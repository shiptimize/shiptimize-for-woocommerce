import './scss/shiptimize.scss';
import './css/leaflet.css';

import Utils from './js/shiptimize-utils.js';
import WooCommerce from './js/shiptimize-woo-commerce.js';

import GoogleMap from './js/shiptimize-gmaps.js';
import OpenStreetMap from './js/shiptimize-open-map.js';

/** 
 * Class Shiptimize depends on jQuery. 
 * Check if we are meant to append a map 
 * 
 * Platform dependent functions marked with   * @platformDependent 
 */
class Shiptimize {

    constructor(ajax_url) {
        this.markers = []; //pickup {lat, lng} 
        this.isMapLoaded = false;
        this.gmaps_key = typeof(shiptimize_maps_key) == 'undefined' ?  '' : shiptimize_maps_key ;
        this.openMapMarkerIcons = {};
        this.ajax_url = ajax_url; // platform dependent 

        this.platform = new WooCommerce(this.ajax_url);

        this.map = this.gmaps_key ? new GoogleMap(this.gmaps_key) : new OpenStreetMap();
        this.platform.isCheckout(); 
        this.map.grantReady();
    }

    /** 
     * Show the map to the user 
     */
    showMap() {
        this.userScroll = jQuery('html,body').scrollTop(); 
        jQuery('html,body').scrollTop(0); 
        jQuery(".shiptimize-pickup").addClass("active"); 
    }

    /** 
     * Hide the map   
     */
    hideMap() {
        jQuery(".shiptimize-pickup").removeClass("active");
        jQuery(".shiptimize-pickup__error").hide();
        jQuery('html,body').scrollTop(this.userScroll); 
    }

    clearMarkers() {
        this.map.clearMarkers();
    }

    /** 
     * Generate the inputs for the user to append extra info if necessary 
     * The id of these fields is in the format shiptimize_extra_{PointId}_{FieldId}
     */
    getExtendedInfoHtml(pickupPoint) {
        if (!pickupPoint.ExtendedInfo || typeof(pickupPoint.ExtendedInfo.length) =='undefined') {
            return "";
        }

        let html = '';

        for (let x = 0; pickupPoint.ExtendedInfo && x < pickupPoint.ExtendedInfo.length; ++x) {
            let extraInfo = pickupPoint.ExtendedInfo[x];
            html += '<div class="shiptimize-pickup__extended">' +
                '<label class="shiptimize-pickup__extended_label ">' + extraInfo.Tekst + '</label>' +
                '<input type="text" name="shiptimize_pickup_extended_value" value="" id="shiptimize_extra_' + pickupPoint.PointId + '_' + extraInfo.FieldId + '"/> ' +
                '<input type="hidden" name="shiptimize_pickup_extended_id" id="shiptimize_pickup" value="' + extraInfo.FieldId + '"/> ' +
                '</div>';
        }

        return html;
    }

    /**
     * Reset all markers  
     * Select the marker of index idx in map 
     */
    selectPointFromListInMap(idx) {
        jQuery("input[name='shiptimize__point']").prop('checked', false);
        this.map.selectMarkerByIdx(idx);

        jQuery(jQuery("input[name='shiptimize__point']").get(idx)).prop('checked', true);
    }

    /** 
     * When the user clicks the validate button 
     */
    selectFromList() {
        let idx = jQuery("input[name='shiptimize__point']:checked").val();
        let pickup = this.pickupPoints[idx];
        let extra = '';

        for (let i = 0; pickup.ExtendedInfo && i < pickup.ExtendedInfo.length; ++i) {
            extra += "<br/>" + pickup.ExtendedInfo[i].Tekst + ': ' + jQuery("#shiptimize_extra_" + pickup.PointId + "_" + pickup.ExtendedInfo[i].FieldId).val();
        }

        jQuery(".shiptimize-pickup__description").html(shiptimize_selected_pickup + " : " + pickup.Information.Name + " " + pickup.Information.Address + " " + extra);

        this.platform.setPickupPoint(pickup);
        this.hideMap();
    }


    /** 
     *  Returns the distance between 2 (lat,lng) points in kms 
     */
    getDistance(latlng, latlng2) {

        var R = 6371e3; // metres
        var φ1 = latlng.lat().toRadians();
        var φ2 = latlng2.lng().toRadians();

        var Δφ = (latln2.lat() - latlng.lng()).toRadians();
        var Δλ = (latln2.lng() - latlng.lon()).toRadians();

        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = Math.floor(R * c / 1000);
    }

    /** 
     * Show the map and query the server for pickup locations near the shipping address provided by the client
     * center the map on the first point 
     * remove old markers 
     * add the new markers  
     */
    getPickupLocations(evt) {
        if(!this.map || !this.map.isScriptLoaded){
            console.log("map is not loaded ...");
            return;
        }

        this.pickupPointsLoadStart(); 

        /** because some version of woo will trigger a call to checkout and finish  the order **/
        evt.preventDefault();
        evt.stopPropagation();
        
        this.showMap();

        let data = this.platform.getShippingData();
        data.action = 'shiptimize_pickup_locations';

        this.map.setCarrierIcon(data.CarrierId);

        this.map.geocode(data, (geocode) => { this.getPickupLocationsFromGeocodedAddr(geocode, data); });
    }


    getPickupLocationsFromGeocodedAddr(geocode, data) {
        this.resetUI(); 
        
        if(!geocode.lng || !geocode.lat) {
            this.pickupPointsLoadStop(); 
            this.pickupError(shiptimize_geolocationfailed);
            return;
        }

        data.Address.Country = geocode.iso2;
        data.Address.Long = geocode.lng;
        data.Address.Lat = geocode.lat;

        console.log(data);
        console.log(geocode);

        jQuery.getJSON(this.ajax_url, data, (pickupPoints) => {
            // We have the points remove the loader 
            this.pickupPointsLoadStop(); 

            if (pickupPoints.length == 0) {
                console.log("no pickup points found for this address ");
                return;
            }

            console.log(pickupPoints);
            if (pickupPoints.Error.Id == 0 && pickupPoints.Point.length > 0 ) {
                jQuery(".shiptimize-pickup__options,.shiptimize-pickup__map").show();
                this.setPickupLocations(pickupPoints.Point);
            } else {
                console.log("The api returned an error: ", pickupPoints.Error); //pickupPoints.Error.Info || 
                this.pickupError(shiptimize_no_points_found);
            }

        }).fail( (resp) => {
            console.log("Error getting points, shiptimize api error? report to shiptimize. ", resp.responseText); //pickupPoints.Error.Info || 
            this.pickupError(shiptimize_no_points_found); 
        });
    }

    resetUI(){
        jQuery(".shiptimize-pickup__error").hide();
        this.map.clearMarkers(); 
    }

    /** 
     * @param string info - the message to display 
     */
    pickupError(info) {
        this.pickupPoints = []; 

        let eError = jQuery(".shiptimize-pickup__error");
        eError.html(info);
        eError.show();

        jQuery(".shiptimize-pickup__options,.shiptimize-pickup__map").hide();
    }

    /** 
     * Append the pickup Locations to the map
     * @param array pickupPoints - an array of available pickup points 
     */
    setPickupLocations(pickupPoints) {
        jQuery(".shiptimize-pickup__error").hide();

        this.pickupPoints = pickupPoints;
        this.map.clearMarkers();
        this.map.centerMap(this.pickupPoints[0].Lat, this.pickupPoints[1].Long);
        this.map.addMarkers(pickupPoints, (idx) => { this.selectPointFromListInMap(idx); });
        this.setOptionsForAddress(pickupPoints);

        (typeof(this.map.map.invalidateSize) != 'undefined') && this.map.map.invalidateSize();

        setTimeout ( () => { 
            this.map.fitBounds(); 
        }, 200);
    }

    /** 
     * @param pickupPoints[] - [] of pickup points returned by the api 
     */
    setOptionsForAddress(pickupPoints) {

        let html = '';
        for (let i = 0; i < pickupPoints.length; ++i) {
            html += '<div class="shiptimize-pickup__point">' +
                '<input type="radio" value="' + i + '" name="shiptimize__point"  onclick="shiptimize.selectPointFromListInMap(' + i + ')"/>' +
                '<span class="shiptimize-pickup__point_description" onclick="shiptimize.selectPointFromListInMap(' + i + ')">' +
                '<span>' + (pickupPoints[i].Information.Name ?pickupPoints[i].Information.Name + '<br/>' : '')
                 + pickupPoints[i].Information.Address + '</span>' +
                this.getExtendedInfoHtml(pickupPoints[i]) +
                '</span>'

                +
                '</div>';
        }
        console.log(html);

        jQuery(".shiptimize-pickup__other").html(html);
    }


    loadMap() {
        this.map.loadMap();
    }

    pickupPointsLoadStart() {
      jQuery(".shiptimize-pickup__mapWrapper").addClass('loading');  
    }; 

    pickupPointsLoadStop() {
      jQuery(".shiptimize-pickup__mapWrapper").removeClass('loading'); 
    };
}

jQuery(function() {
    if(typeof(woocommerce_params) != 'undefined'){
        window.shiptimize = new Shiptimize(woocommerce_params.ajax_url);    
    } 
});