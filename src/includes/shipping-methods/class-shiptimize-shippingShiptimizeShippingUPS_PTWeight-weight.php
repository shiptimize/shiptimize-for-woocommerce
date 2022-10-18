<?php
    use Wbs\ShippingMethod; 

    /** 
     * Declares a shipping method for carrier UPS PT 
     */ 
    class ShiptimizeShippingUPS_PTWeight extends ShippingMethod { 
        /**
         * Constructor.
         *
         * @param int $instance_id Instance ID.
         */
        public function __construct( $instance_id = 0){ 

          $this->instance_id        = absint( $instance_id );
          $this->id                 = 'shipping_shiptimize_32_weight';
          $this->plugin_id = 'wbs';
          $this->title       =  'UPS PT for Weight Based Shipping'; //name for end user 
          $this->method_title =  'Shiptimize: UPS PT for Weight Based Shipping'; //name for admin 
          $this->method_description = 'Shiptimize UPS PT'; // description for admin 
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
                var shiptimize_carrier={\"OptionList\":[{\"Type\":1,\"Name\":\"Service level\",\"OptionValues\":[{\"Name\":\"Express\",\"IsPickup\":0,\"Id\":\"07\"},{\"Id\":\"08\",\"Name\":\"Expedited\",\"IsPickup\":0},{\"IsPickup\":0,\"Name\":\"Standard\",\"Id\":\"11\"},{\"Id\":\"54\",\"Name\":\"Express Plus\",\"IsPickup\":0},{\"Id\":\"65\",\"IsPickup\":0,\"Name\":\"Express Saver\"},{\"IsPickup\":0,\"Name\":\"WW Express Freight\",\"Id\":\"96\"}],\"Id\":10,\"ClassId\":10},{\"Id\":11,\"IsPickup\":0,\"ClassId\":11,\"Type\":0,\"Name\":\"Pick &amp; return\"},{\"Id\":12,\"IsPickup\":0,\"ClassId\":12,\"Type\":0,\"Name\":\"Pick &amp; ship\"},{\"ClassId\":13,\"IsPickup\":0,\"Id\":13,\"Name\":\"Send insured\",\"Type\":2,\"OptionFields\":[{\"Name\":\"Insured amount (&euro;)\",\"Id\":\"1\"}]},{\"Name\":\"Cash service\",\"OptionFields\":[{\"Id\":\"1\",\"Name\":\"Amount\"}],\"Type\":0,\"ClassId\":2,\"IsPickup\":0,\"Id\":2},{\"Name\":\"Colli count\",\"OptionFields\":[{\"Name\":\"Colli count\",\"Id\":\"1\"}],\"Type\":2,\"ClassId\":35,\"IsPickup\":0,\"Id\":35},{\"Type\":0,\"Name\":\"Delivery with signature\",\"ClassId\":5,\"Id\":5,\"IsPickup\":0},{\"ClassId\":59,\"Id\":59,\"IsPickup\":0,\"Type\":2,\"OptionFields\":[{\"Name\":\"Pickup service\",\"Id\":\"1\"}],\"Name\":\"Pickup service (checkbox)\"},{\"ClassId\":61,\"Id\":61,\"IsPickup\":1,\"Type\":0,\"Name\":\"UPS Access Point\"}],\"Name\":\"UPS PT\",\"Id\":32,\"HasPickup\":true};var shiptimize_extraoptions=[\"2\",\"47\",\"46\",\"49\",\"42\",\"62\",\"55\",\"73\",\"80\"];var shiptimize_checkboxes={\"13\":\"sendinsured\",\"31\":\"sendinsured\",\"32\":\"activatepickup\",\"57\":\"sendinsured\",\"70\":\"fragile\",\"56\":\"activatepickup\",\"59\":\"activatepickup\"};shiptimize_labels = {
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