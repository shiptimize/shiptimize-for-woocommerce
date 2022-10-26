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
                var shiptimize_carrier={\"Name\":\"UPS PT\",\"Id\":32,\"OptionList\":[{\"ClassId\":10,\"Name\":\"Service level\",\"OptionValues\":[{\"Id\":\"07\",\"IsPickup\":0,\"Name\":\"Express\"},{\"Id\":\"08\",\"IsPickup\":0,\"Name\":\"Expedited\"},{\"Name\":\"Standard\",\"IsPickup\":0,\"Id\":\"11\"},{\"Id\":\"54\",\"IsPickup\":0,\"Name\":\"Express Plus\"},{\"IsPickup\":0,\"Id\":\"65\",\"Name\":\"Express Saver\"},{\"Name\":\"WW Express Freight\",\"Id\":\"96\",\"IsPickup\":0}],\"Type\":1,\"Id\":10},{\"ClassId\":11,\"IsPickup\":0,\"Name\":\"Pick &amp; return\",\"Type\":0,\"Id\":11},{\"Name\":\"Pick &amp; ship\",\"Id\":12,\"Type\":0,\"ClassId\":12,\"IsPickup\":0},{\"IsPickup\":0,\"ClassId\":13,\"Name\":\"Send insured\",\"Id\":13,\"Type\":2,\"OptionFields\":[{\"Name\":\"Insured amount (&euro;)\",\"Id\":\"1\"}]},{\"IsPickup\":0,\"ClassId\":2,\"Name\":\"Cash service\",\"Type\":0,\"OptionFields\":[{\"Name\":\"Amount\",\"Id\":\"1\"}],\"Id\":2},{\"Id\":35,\"OptionFields\":[{\"Id\":\"1\",\"Name\":\"Colli count\"}],\"Type\":2,\"Name\":\"Colli count\",\"ClassId\":35,\"IsPickup\":0},{\"ClassId\":5,\"IsPickup\":0,\"Name\":\"Delivery with signature\",\"Id\":5,\"Type\":0},{\"Type\":2,\"OptionFields\":[{\"Id\":\"1\",\"Name\":\"Pickup service\"}],\"Id\":59,\"Name\":\"Pickup service (checkbox)\",\"IsPickup\":0,\"ClassId\":59},{\"IsPickup\":1,\"ClassId\":61,\"Id\":61,\"Type\":0,\"Name\":\"UPS Access Point\"}],\"HasPickup\":true};var shiptimize_extraoptions=[\"2\",\"47\",\"46\",\"49\",\"42\",\"62\",\"55\",\"73\",\"80\"];var shiptimize_checkboxes={\"13\":\"sendinsured\",\"31\":\"sendinsured\",\"32\":\"activatepickup\",\"57\":\"sendinsured\",\"70\":\"fragile\",\"56\":\"activatepickup\",\"59\":\"activatepickup\"};shiptimize_labels = {
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