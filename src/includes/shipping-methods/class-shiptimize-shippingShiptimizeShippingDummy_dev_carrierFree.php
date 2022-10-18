<?php 
    /** 
     * Declares a shipping method for carrier Dummy dev carrier 
     */ 
    class ShiptimizeShippingDummy_dev_carrierFree extends WC_Shipping_Free_Shipping { 
        /**
         * Constructor.
         *
         * @param int $instance_id Instance ID.
         */
        public function __construct( $instance_id = 0){
          global $shiptimize; 

          $this->instance_id =  absint( $instance_id );
          $this->id = 'shipping_shiptimize_29_free';
          $this->method_title = 'Shiptimize: Dummy dev carrier Free Shipping'; //name for admin 
          $this->method_description = 'Shiptimize Dummy dev carrier Free Shipping'; // description for admin 
          $this->has_pickup = false;
      
          $this->supports = array(
                'shipping-zones',
                'instance-settings',
                'instance-settings-modal',
          );

          $this->init();
          
          /*Service Level*/
          
          
          /*Extraoptions */ 
          

          /** checkboxfields **/  
           

          /** exclude classes **/
          $this->instance_form_fields['excludeclasses'] = array(
                'title'             => $shiptimize->translate('excludeclasses'),
                'type'              => 'multiplecheckboxes',
                'class'       => 'shiptimize-excludeclasses',
                'default'           => 0,  );
          $this->excludeclasses = $this->get_option( 'excludeclasses' , '');

          add_action( 'woocommerce_update_options_shipping_' . $this->id, array( $this, 'process_admin_options' ) );
        } 

        public function validate_excludeclasses_field( $key , $value ) {
          if ( $key === 'excludeclasses' ) {
            return empty($value) ? '' : implode( ',' , $value );
          }
          return $value;
        }
       
        /**
         * Initialize free shipping.
         */
        public function init() { 
          // Load the settings.
          $this->init_form_fields();
          $this->init_settings();

          // Define user set variables.
          $this->title            = $this->get_option( 'title' );
          $this->min_amount       = $this->get_option( 'min_amount', 0 );
          $this->requires         = $this->get_option( 'requires' );
          $this->ignore_discounts = $this->get_option( 'ignore_discounts' );

          // Actions.
          add_action( 'woocommerce_update_options_shipping_' . $this->id, array( $this, 'process_admin_options' ) );
        }

        public function get_admin_options_html()
        {
          if ( $this->instance_id ) {
            $settings_html = $this->generate_settings_html( $this->get_instance_form_fields(), false );
          } else {
            $settings_html = $this->generate_settings_html( $this->get_form_fields(), false );
          }

          $excludeclassesoptions = array();
          if ( is_plugin_active('woocommerce-advanced-shipping/woocommerce-advanced-shipping.php') ) { 
              $shipping  = new \WC_Shipping(); 
              $opt_exclude_classes = explode( ',', $this->get_instance_option('excludeclasses') );               
              $opt_exclude_classes = explode( ',', $this->get_instance_option('excludeclasses') );
          
              foreach ( $shipping->get_shipping_classes() as $shipping_class ) {

                array_push( $excludeclassesoptions, array( 
                  'id' => $shipping_class->term_id,
                  'name' => $shipping_class->name,
                  'selected' => in_array( $shipping_class->term_id , $opt_exclude_classes ) ? 'checked' : ''
                ));
              }
          }
          return '<table class="form-table">' . $settings_html . '</table><script>
          var optionsid = "#woocommerce_' . $this->id . '_extraoptions";
          
          setTimeout( function(){
            console.log("Helloo from '.$this->id.'");

            jQuery(".shiptimize-extra-option-values").parent().parent().parent().hide();
            shiptimize_extraoption_values();

            jQuery(optionsid).change(shiptimize_extraoption_values); 
            setExcludeClasses();

          }, 0);

          function shiptimize_extraoption_values(){
              var selectedoption = jQuery(optionsid).val(); 
              jQuery(".shiptimize-extra-option-values").parent().parent().parent().hide();
              jQuery("#woocommerce_' . $this->id . '_extraoptions" + selectedoption).parent().parent().parent().show(); 
          }

          function setExcludeClasses() {
            var excludeoptions =' . json_encode($excludeclassesoptions) . ';
            var select = jQuery("#woocommerce_shipping_shiptimize_29_free_excludeclasses"); 
            var content = select.parent();
            select.remove();  
            for ( var x=0; x< excludeoptions.length; ++x ) { 
              content.append(\'<span class="shiptimize-ib shiptimize-exclude-class"> <input type="checkbox" name="woocommerce_shipping_shiptimize_29_free_excludeclasses[]" value="\' + excludeoptions[x].id + \'" \' + excludeoptions[x].selected + \' /> \' + excludeoptions[x].name + \'</span>\');
            }
          }
          </script>';
        }
 
    }