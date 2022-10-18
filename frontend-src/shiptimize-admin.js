import './scss/shiptimize-admin.scss';
import Popper from 'popper.js'; 

import WooShiptimize  from './js/shiptimize-woo-commerce-admin.js'; 

class Shiptimize {

  constructor(){
    console.log("I'm alive!"); 
  }

  /** 
   *  
   */ 
  bootstrap(){
    this.tooltips(); 
    this.platform = new WooShiptimize(); 

    this.loadAnalytics(); 
    if(typeof(this.platform.bootstrap) != 'undefined') {
      this.platform.bootstrap();
    }
  }

  tooltips( ){
    let toltip = jQuery(".shiptimize-tooltip-message");
    let container = jQuery('#wpcontent'); 

    if ( toltip.size() == 0 ) {
      return; 
    }

    let me = this; 
    toltip.each( function ( idx, elem ) {
      me.attachPopper(elem,container);
    });      

  }

  attachPopper(toltip, container){  
    let eToltip = jQuery(toltip); 
    let toltipReference = eToltip.siblings(".shiptimize-tooltip-reference");
    let arrow = eToltip.children('.shiptimize-tooltip-message__arrow').get(0); 

    var popper = new Popper(toltipReference.get(0), toltip, {
      placement: 'left',
      modifiers: {
          flip: {
              behavior: ['top','left', 'bottom']
          },
          preventOverflow: {
              boundariesElement: container,
          },
          offset: { 
              enabled: true,
              offset: '10,10'
          },
          arrow: {
            enabled: true,
            element: arrow
          }
      }, 
    });  
    setTimeout ( () => { popper.update(); } , 200);     
  }

  exportSuccess(appLink){
    this.platform.exportSuccess(appLink);
  }

  /** 
   * @param string category 
   * @param string action 
   * @param string label 
   */
  sendAnalyticsEvent(category, action, label) {
      ga('shiptimize.send', 'event', category, action, label, { transport: 'beacon' });
  }

  loadAnalytics() {
      if (typeof(ga) == 'undefined') {
          (function(i, s, o, g, r, a, m) {
              i['GoogleAnalyticsObject'] = r;
              i[r] = i[r] || function() {
                  (i[r].q = i[r].q || []).push(arguments)
              }, i[r].l = 1 * new Date();
              a = s.createElement(o),
                  m = s.getElementsByTagName(o)[0];
              a.async = 1;
              a.src = g;
              m.parentNode.insertBefore(a, m)
          })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
          console.log("inserting analytics ");
      } 
      ga('create', 'UA-101485643-1', 'auto', 'shiptimize');
      ga('shiptimize.set', 'anonymizeIp', true);
      console.log("creating tracker");
  }

  printlabel(event, orderid) {
    event.stopPropagation(); 
    console.log ("Printing label for orderid ", orderid);

    var data = {
      'action': 'shiptimize_print_label', 
      'orderid': orderid
    }; 

    this.openLoader(shiptimize_label_request); 

    jQuery.post(ajaxurl, data, (data) => {
      console.log(data); 

      if (typeof(data.response) != 'undefined' ) {
          if(typeof(data.response.Error) != 'undefined' && data.response.Error.Id > 0) {
            this.loaderMsg(data.response.Error.Info);

            setTimeout(() => { this.closeLoader(); }, 2000);  
          }

          if(typeof(data.response.CallbackURL) != 'undefined') {
            this.monitorLabelStatus(data.response.CallbackURL);             
          }
      }

      if(typeof(data.errors) != 'undefined') {
        this.loaderMsg(data.errors.join('<br/>'));
        setTimeout(() => { this.closeLoader(); }, 5000);  
      }
    }, "json");
  }

  /**
   * Request the label status every 1s 
   */
  monitorLabelStatus(callbackUrl) {
    var data = {
      'action': 'shiptimize_label_status',
      'callbackUrl': callbackUrl
    }; 

    jQuery.post(ajaxurl, data, (data) => {
      console.log(data); 

      if(typeof(data.response)!= 'undefined') {

        // Check for falta errors 
        if(data.httpCode == '200') {
          this.loaderMsg(shiptimize_label_request + ' ' + data.response.Finished + '%');         
        }
        else {
          this.loaderMsg("Fatal API error " + data.httpCode);
          setTimeout(() => { this.closeLoader(); }, 5000);
          return; 
        }

        // Print API errors
        if (data.response.Error.Id > 0) {
          this.loaderMsg(data.response.Error.Info); 
        }

        if(data.response.Error.Id == 902) { //No process running 
          setTimeout(() => {
           this.closeLoader()
          }, 2000);
        }

        if(data.response.Finished == 100 ) {
          if ( data.response.LabelFile.length > 0) {
            let labelinfo = shiptimize_label_click.replace('%',`<a href="${data.response.LabelFile}" target='_blank'>${shiptimize_label_label}</a>`);
            let noticelist = jQuery("#wp__notice-list"); 
            noticelist.removeClass('woocommerce-layout__notice-list-hide'); 
            noticelist.append(`<div class="notice notice-info is-dismissible updated">${labelinfo}</div>`);
            window.open(data.response.LabelFile,'_blank'); 
            this.closeLoader();

            /** 
             * Make sure the info is updated without the need to reload the page 
             */ 
            for(var x =0; x < data.response.ClientReferenceCodeList.length; ++x) {
              var labelresult = data.response.ClientReferenceCodeList[x]; 
              if(labelresult.Error.Id == 0) { 
                jQuery("#shiptimize-label" + labelresult.ReferenceCode).addClass('shiptimize-icon-print-printed');   
              }
              else {
                jQuery("#shiptimize-label" + labelresult.ReferenceCode).addClass("shiptimize-icon-print-error");  
              }
              
              jQuery("#shiptimize-tooltip" + labelresult.ReferenceCode).html(labelresult.message);
            }
          }
          else {
            let msg = ''; 
            for ( var x=0; x < data.response.ClientReferenceCodeList.length; ++x ) {
              let labelresult = data.response.ClientReferenceCodeList[0]; 
              if(labelresult.Error.Id > 0) {
                msg += "<div class='shiptimize-label-error error'>" + labelresult.Error.Info + "</div>"; 
              }
              jQuery("#shiptimize-label" + labelresult.ReferenceCode).addClass("shiptimize-icon-print-error");  
              jQuery("#shiptimize-tooltip" + labelresult.ReferenceCode).html(labelresult.message);
            }

            this.loaderMsg(msg); 
            setTimeout(() => { this.closeLoader(); }, 5000);
          }
        }

        if(data.response.Finished < 100) {
          setTimeout( () => { this.monitorLabelStatus(callbackUrl); }, 2000); 
        }
      }

    }, "json");
  }

  loaderMsg(message) {
    jQuery(".shiptimize-loader-message").html(message); 
  }

  openLoader(message) {
    jQuery('body').append('<div class="shiptimize-loader-wrapper"><div class="shiptimize-loader"><div></div><div></div><div></div></div><div class="shiptimize-loader-message">' + message  + '</div></div>'); 
  }

  closeLoader(){
    jQuery(".shiptimize-loader-wrapper").remove(); 
  }
}

jQuery(function () {
  window.shiptimize = new Shiptimize();
  window.shiptimize.bootstrap(); 
  window.Popper = Popper;
});

