import Utils from './shiptimize-utils.js'; 

export default class Woocommerce {

    constructor(ajax_url) {
        this.ajax_url = ajax_url;
    }

    /** 
     * @return true if this is the checkout page 
     */
    isCheckout() {
        return jQuery("body").hasClass('woocommerce-checkout');
    }

    /* 
     * If there is only one method available woo will use a hidden field for the selected carrier 
     *  + Generic Methods do not have an instance id 
     */ 
    getShippingMethodId(){

        let eCheckbox = jQuery("input[name='shipping_method[0]']:checked"); 
        let eHidden = jQuery("input[name='shipping_method[0]']"); 

        let shippingMethod =  eCheckbox.length > 0 ? eCheckbox.val() : eHidden.val() ; 

        if ( shippingMethod.indexOf(':') > 0 ){
            var method_parts = shippingMethod.split(':');
            return Utils.removeNonNumeric(method_parts[0]);     
        }
        else 
        {
            return shippingMethod;
        } 
    }

    /** 
     * Wordpress won't send session cookies to wp-admin and the session handling in woocommerce is so poorly documented we are better off 
     * extracting necessary info client side our selves. We're emulating their checkout.js 
     * @return an object containing address parts 
     */
    getShippingData() {

        var country = jQuery('#billing_country').val(),
            state = jQuery('#billing_state').val(),
            postcode = jQuery('input#billing_postcode').val(),
            city = jQuery('#billing_city').val(),
            address = jQuery('input#billing_address_1').val(),
            address_2 = jQuery('input#billing_address_2').val(),
            s_country = country,
            s_state = state,
            s_postcode = postcode,
            s_city = city,
            s_address = address,
            s_address_2 = address_2;


        if (jQuery('#ship-to-different-address').find('input').is(':checked')) {
            s_country = jQuery('#shipping_country').val();
            s_state = jQuery('#shipping_state').val();
            s_postcode = jQuery('input#shipping_postcode').val();
            s_city = jQuery('#shipping_city').val();
            s_address = jQuery('input#shipping_address_1').val();
            s_address_2 = jQuery('input#shipping_address_2').val();
        }
 
        return {
            "Address":{
                "Lat": "",
                "Long": "",
                "Streetname1": s_address,
                "Streetname2": s_address_2,
                "HouseNumber": '',
                "NumberExtension": '',
                "PostalCode": s_postcode,
                "s_postcode": s_postcode,
                "City": s_city,
                "Country": s_country,
                "State": s_state,

            },
            post_data: jQuery('form.checkout').serialize(),
            "CarrierId": this.carrier_id
        };
    }

    /** 
     * We must run this onload 
     * And on method change 
     * because people may never change the carrier or select a pickup point 
     */ 
    setCarrier(carrier_id){
        this.carrier_id = typeof(carrier_id) != 'undefined' ? carrier_id : this.getShippingMethodId();  
        jQuery("#shipping_carrier_id").val(this.carrier_id);
    }

    /** 
     * @param Pickup pickup 
     */
    setPickupPoint(pickup) {
        let pickup_label =  pickup.Information.Name + " " + pickup.Information.Address; 

        jQuery(".shiptimize-pickup__description").html(shiptimize_selected_pickup + " : " +pickup_label);
        jQuery("#shipping_pickup_id").val(pickup.PointId);
        jQuery("#shipping_pickup_label").val(pickup_label); 

        jQuery("#shiptimizepickup").val(pickup.PointId); 
        
    }
}