<?php 
    /** 
     * Declares a shipping method for carrier CTT 
     */ 
    class ShiptimizeShippingCTT extends WC_Shipping_Flat_Rate { 
        /**
         * Constructor.
         *
         * @param int $instance_id Instance ID.
         */
        public function __construct( $instance_id = 0){
          global $shiptimize; 

          $this->instance_id = absint( $instance_id );
          $this->id = 'shipping_shiptimize_30';
          $this->title = 'CTT Flat Rate'; //name for end user 
          $this->method_title = 'Shiptimize: CTT Flat Rate'; //name for admin 
          $this->method_description = 'Shiptimize CTT'; // description for admin 
          $this->has_pickup = true;
      
          $this->supports = array(
                'shipping-zones',
                'instance-settings',
                'instance-settings-modal',
          );

          // how it's possible that someone declares this method before there's an instance of the plugin is a mistery to solve later 
          // possible they copied the code and did their own  rendition of the thing? 
          if(!$shiptimize) {
            $shiptimize = WooShiptimize::getInstance();
          }

          $this->init();
          $this->options = get_option($this->id . '_' . $this->instance_id . '_settings');
          
          /*Service Level*/
          $this->instance_form_fields['service_level'] = array(
                'title'             => $shiptimize->translate('service_level'),
                'type'              => 'select',
                'class'       => 'shiptimize-service-level',
                'default'           => 0, 'options' => array( "" => "-"  , '10'  => '13h' , '11'  => '19h' , '12'  => '22h' , '13'  => 'Easy Return - Devoluções Fáceis' , '2'  => '48h' , '3'  => '19h Múltiplo' , '4'  => '13h Múltiplo' , '5'  => 'Internacional' , '7'  => 'Em 2 dias' , '8'  => 'Internacional Economy' , '9'  => '10h')  );
          $this->service_level = $this->get_option( 'service_level' , '');
          
          /*Extraoptions */ 
          

$this->instance_form_fields['pickupbehaviour'] = array(
                'title'             => $shiptimize->translate('pickupbehaviour'),
                'type'              => 'select',
                'class'       => 'shiptimize-pickupbehaviour',
                'default'           => 0, 'options' => array('0'=> "Optional", '1' => "Mandatory", '2' =>"Disabled")  );
          $this->pickupbehaviour = $this->get_option( 'pickupbehaviour' , '');

$this->instance_form_fields['extraoptions'] = array(
                'title'             => $shiptimize->translate('extraoptions'),
                'type'              => 'select',
                'class'       => 'shiptimize-extra-options',
                'default'           => 0, 'options' => array('0'=>'-','80'=>'Add return label')  );
          $this->extraoptions = $this->get_option( 'extraoptions' , '');

          /** checkboxfields **/  
          $this->instance_form_fields['sendinsured'] = array(
                'title'             => $shiptimize->translate('sendinsured'),
                'type'              => 'select',
                'class'       => 'shiptimize-sendinsured',
                'default'           => 0, 'options' => array(0=>$shiptimize->translate('No'),'31'=>$shiptimize->translate('Yes'))  );
          $this->sendinsured = $this->get_option( 'sendinsured' , '');
$this->instance_form_fields['fragile'] = array(
                'title'             => $shiptimize->translate('fragile'),
                'type'              => 'select',
                'class'       => 'shiptimize-fragile',
                'default'           => 0, 'options' => array(0=>$shiptimize->translate('No'),'70'=>$shiptimize->translate('Yes'))  );
          $this->fragile = $this->get_option( 'fragile' , ''); 

          /** Exclude classes **/ 
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
            var select = jQuery("#woocommerce_shipping_shiptimize_30_excludeclasses"); 
            var content = select.parent();
            select.remove();  
            for ( var x=0; x< excludeoptions.length; ++x ) { 
              content.append(\'<span class="shiptimize-ib shiptimize-exclude-class"> <input type="checkbox" name="woocommerce_shipping_shiptimize_30_excludeclasses[]" value="\' + excludeoptions[x].id + \'" \' + excludeoptions[x].selected + \' /> \' + excludeoptions[x].name + \'</span>\');
            }


          }
          </script>';
        }
    }