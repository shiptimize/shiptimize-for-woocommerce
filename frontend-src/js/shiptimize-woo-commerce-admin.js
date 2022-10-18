import Utils from './shiptimize-utils.js'; 
import ShiptimizeWeightBasedShipping from './shiptimize-weight-based-shipping.js';

export default class WooShipitmizeAdmin {    

    constructor() {
        this.wbs = new ShiptimizeWeightBasedShipping();
    }

    bootstrap() { 
        this.urlParams();
    }

    /** 
     * If the export was successfull 
     * @param string appLink - the login url 
     */
    exportSuccess(appLink) {
        if(appLink.trim().length == 0){
            return; 
        }
        
        Utils.openNewWindow(appLink, ''); 
    } 

    /** 
     * @param int id - the carrier id 
     */ 
    getCarrier(id){
        for( let x = 0; x < shiptimize_carriers.length; ++x ){
            if(shiptimize_carriers[x].Id == id){
                return shiptimize_carriers[x]; 
            }
        }
    }

    /** 
     * Show aditional options for carrier 
     */ 
    selectOptions(elem){
        this.selectServiceLevel(elem, jQuery('.shiptimize__service-level').val()); 
        // hide the extra options for now 
        // this.selectExtraOptions(elem, jQuery('.shiptimize__extra-options').val());
    }

    /** 
     * @param DomElement  elem - the carrier select 
     */ 
    selectServiceLevel( elem , service_id ) {
        let carrier_id = elem.val(); 
        let carrier = this.getCarrier(carrier_id); 
        let eServiceLevel = elem.siblings(".shiptimize__service-level");

        let options_html = '';

        if( typeof(carrier.OptionList) != undefined ){
            let options = carrier.OptionList; 

            for( let x = 0; x < options.length; ++x){
                if( options[x].Type == 1 && typeof(options[x].OptionValues) != 'undefined' ){  
                    let values = options[x].OptionValues;
                    options_html += "<option>-</option>";
                    for( let i = 0; i < values.length; ++i ){
                        let selected = service_id == values[i].Id ? 'selected' :''; 
                        options_html += "<option value='" + values[i].Id + "' " + selected + " >" + values[i].Name + "</option>";
                    }
                }
            }
        }

        eServiceLevel.html(options_html);
        if(options_html){
            eServiceLevel.addClass("active"); 
        }
        else {
            eServiceLevel.removeClass("active");
        }
    }


    selectExtraOptions( elem, selected_id ){ let carrier_id = elem.val(); 
        let carrier = this.getCarrier(carrier_id); 
        let eExtraoptions = elem.siblings(".shiptimize__extra-options");

        let options_html = '';
        let option_values_html = []; 

        if( typeof(carrier.OptionList) != undefined ){
            let options = carrier.OptionList; 
            for( let x = 0; x < options.length; ++x){
                if( options[x].Type == 0 ){  
                    if(!options_html){
                        options_html += "<option>-</option>";
                    } 
                    let selected = selected_id == options[x].Id ? 'selected' :''; 
                    options_html += "<option value='" + options[x].Id + "' " + selected + " >" + options[x].Name + "</option>"; 
                }

                if (options[x].OptionValues && options[x].OptionValues.length > 0) {
                    var vhtml = '<select id="shiptimize-optionvalues' + options[x].Id +'" class="shiptimize__optionvalues">';
                    for (let j=0; j < options[x].OptionValues.length; ++j) {
                        vhtml += '<option>' + options[x].OptionValues[j] + '</options>';
                    } 

                    vhtml += '<select>';  
                }
            }
        }

        eExtraoptions.html(options_html);
        if(options_html){
            eExtraoptions.addClass("active"); 
        }
        else {
            eExtraoptions.removeClass("active");
        } 
    } 
 
    selectTab(idx){
        jQuery(".nav-tab").removeClass('nav-tab-active');
        jQuery(jQuery(".nav-tab").get(idx)).addClass('nav-tab-active'); 

        jQuery(".tab").removeClass('active'); 
        jQuery(jQuery(".tab").get(idx)).addClass('active');
    }

    accordion(elem){
        let $eparent = jQuery(elem).parent(); 
        if ($eparent.hasClass('open')) {
            $eparent.removeClass('open'); 
        }
        else {
            $eparent.addClass('open');
        }
    }

    /** 
    * Is there stuff in the url params we care about? 
    **/
    urlParams() {
        let parts = document.location.search.split('&'); 
        for (let x = 0; x < parts.length; ++x) {
          let keyval = parts[x].split('='); 
          let key = keyval[0];
          let value = decodeURIComponent(keyval[1]); 

          if(key == 'CallbackURL') {
            console.log("We are creating a label");
            shiptimize.openLoader(shiptimize_label_request); 
            shiptimize.monitorLabelStatus(value);
          }
        }
    }
}