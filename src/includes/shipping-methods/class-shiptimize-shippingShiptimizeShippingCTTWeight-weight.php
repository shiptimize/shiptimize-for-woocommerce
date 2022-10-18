<?php
    use Wbs\ShippingMethod; 

    /** 
     * Declares a shipping method for carrier CTT 
     */ 
    class ShiptimizeShippingCTTWeight extends ShippingMethod { 
        /**
         * Constructor.
         *
         * @param int $instance_id Instance ID.
         */
        public function __construct( $instance_id = 0){ 

          $this->instance_id        = absint( $instance_id );
          $this->id                 = 'shipping_shiptimize_30_weight';
          $this->plugin_id = 'wbs';
          $this->title       =  'CTT for Weight Based Shipping'; //name for end user 
          $this->method_title =  'Shiptimize: CTT for Weight Based Shipping'; //name for admin 
          $this->method_description = 'Shiptimize CTT'; // description for admin 
          $this->has_pickup = true;
          
          $this->supports = array( 
            'shipping-zones',
            'instance-settings',
          );

          $this->init_settings();
        }         

        /** 
         * @override 
         * We don't want our methods confused with the global settings which has instance_id= '' 
         * Only called in wp-admin/
         */ 
        public function get_option_key()
        {
            if(!$this->instance_id ){
              return ''; 
            }

            $option_key =  join('_', array_filter(array(
                $this->plugin_id,
                $this->instance_id,
                'config',
            )));

            return $option_key;
        }

        public function get_admin_options_html()
        {
            global $shiptimize; 
            $shiptimize_options = json_encode(get_option('wbs_'.$this->instance_id.'_shiptimize'));
            $pickup_behaviour_label = $shiptimize->translate('pickupbehaviour');
            $pickup0 = $shiptimize->translate('pickuppointbehavior0');
            $pickup1 = $shiptimize->translate('pickuppointbehavior1');
            $pickup2 = $shiptimize->translate('pickuppointbehavior2');
            $extraoptions = $shiptimize->translate('extraoptions');
            $servicelevel = $shiptimize->translate('service_level');

            ob_start(); 
                echo "<script>
                var shiptimize_carrier={\"OptionList\":[{\"IsPickup\":0,\"Id\":11,\"ClassId\":11,\"Name\":\"Pick &amp; return\",\"Type\":0},{\"Type\":0,\"Name\":\"Pick &amp; ship\",\"ClassId\":12,\"Id\":12,\"IsPickup\":0},{\"Id\":31,\"IsPickup\":0,\"ClassId\":31,\"OptionFields\":[{\"Name\":\"Send insured\",\"Id\":\"1\"}],\"Type\":2,\"Name\":\"Send insured (checkbox)\"},{\"Name\":\"Colli count\",\"OptionFields\":[{\"Name\":\"Colli count\",\"Id\":\"1\"}],\"Type\":2,\"ClassId\":35,\"IsPickup\":0,\"Id\":35},{\"Id\":54,\"ClassId\":54,\"Type\":1,\"Name\":\"Service level\",\"OptionValues\":[{\"Id\":\"10\",\"Name\":\"13h\",\"IsPickup\":0},{\"Id\":\"11\",\"Name\":\"19h\",\"IsPickup\":0},{\"Name\":\"22h\",\"IsPickup\":0,\"Id\":\"12\"},{\"IsPickup\":0,\"Name\":\"Easy Return - Devolu\\u00e7\\u00f5es F\\u00e1ceis\",\"Id\":\"13\"},{\"Id\":\"2\",\"Name\":\"48h\",\"IsPickup\":0},{\"Id\":\"3\",\"IsPickup\":0,\"Name\":\"19h M\\u00faltiplo\"},{\"Id\":\"4\",\"IsPickup\":0,\"Name\":\"13h M\\u00faltiplo\"},{\"IsPickup\":0,\"Name\":\"Internacional\",\"Id\":\"5\"},{\"Name\":\"Em 2 dias\",\"IsPickup\":0,\"Id\":\"7\"},{\"IsPickup\":0,\"Name\":\"Internacional Economy\",\"Id\":\"8\"},{\"Name\":\"10h\",\"IsPickup\":0,\"Id\":\"9\"}]},{\"Name\":\"Fragile\",\"Type\":2,\"OptionFields\":[{\"Name\":\"Fragile\",\"Id\":\"1\"}],\"ClassId\":70,\"IsPickup\":0,\"Id\":70},{\"Id\":71,\"IsPickup\":1,\"ClassId\":71,\"Type\":0,\"Name\":\"Delivery Point\"},{\"ClassId\":80,\"IsPickup\":0,\"Id\":80,\"Name\":\"Add return label\",\"Type\":0}],\"Name\":\"CTT\",\"Id\":30,\"HasPickup\":true};var shiptimize_extraoptions=[\"2\",\"47\",\"46\",\"49\",\"42\",\"62\",\"55\",\"73\",\"80\"];var shiptimize_checkboxes={\"13\":\"sendinsured\",\"31\":\"sendinsured\",\"32\":\"activatepickup\",\"57\":\"sendinsured\",\"70\":\"fragile\",\"56\":\"activatepickup\",\"59\":\"activatepickup\"};shiptimize_labels = {
          'pickupbehaviour' : \"$pickup_behaviour_label\",
          'pickup0' : \"$pickup0\",
          'pickup1' : \"$pickup1\",
          'pickup2' : \"$pickup2\",
          'extraoptions': \"$extraoptions\",
          'servicelevel':\"$servicelevel\",
    };

                //previous options 
                var shiptimize_options = $shiptimize_options;
                </script>";
                /** @noinspection PhpIncludeInspection */
                include(Wbs\Plugin::instance()->meta->paths->tplFile);
            return ob_get_clean();
        }
    }