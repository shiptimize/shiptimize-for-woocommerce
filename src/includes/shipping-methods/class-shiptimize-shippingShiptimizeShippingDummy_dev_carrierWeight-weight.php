<?php
    use Wbs\ShippingMethod; 

    /** 
     * Declares a shipping method for carrier Dummy dev carrier 
     */ 
    class ShiptimizeShippingDummy_dev_carrierWeight extends ShippingMethod { 
        /**
         * Constructor.
         *
         * @param int $instance_id Instance ID.
         */
        public function __construct( $instance_id = 0){ 

          $this->instance_id        = absint( $instance_id );
          $this->id                 = 'shipping_shiptimize_29_weight';
          $this->plugin_id = 'wbs';
          $this->title       =  'Dummy dev carrier for Weight Based Shipping'; //name for end user 
          $this->method_title =  'Shiptimize: Dummy dev carrier for Weight Based Shipping'; //name for admin 
          $this->method_description = 'Shiptimize Dummy dev carrier'; // description for admin 
          $this->has_pickup = false;
          
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
                var shiptimize_carrier={\"Name\":\"Dummy dev carrier\",\"HasPickup\":false,\"Id\":29,\"OptionList\":[{\"Name\":\"Colli count\",\"OptionFields\":[{\"Id\":\"1\",\"Name\":\"Colli count\"}],\"Type\":2,\"ClassId\":35,\"IsPickup\":0,\"Id\":35}]};var shiptimize_extraoptions=[\"2\",\"47\",\"46\",\"49\",\"42\",\"62\",\"55\",\"73\",\"80\"];var shiptimize_checkboxes={\"13\":\"sendinsured\",\"31\":\"sendinsured\",\"32\":\"activatepickup\",\"57\":\"sendinsured\",\"70\":\"fragile\",\"56\":\"activatepickup\",\"59\":\"activatepickup\"};shiptimize_labels = {
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