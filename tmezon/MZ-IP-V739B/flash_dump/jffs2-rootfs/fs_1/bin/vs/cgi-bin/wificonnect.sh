#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
. $wifi_config
export wifidev

wifiko()
{
    wifim=`/bin/paraconf r 1 WIFI_MODE`
    if [ $1 = "load" ] && [ $wifim = "AP" ]
    then
        $drvload_ap
		ifconfig $wifidev "$ap_ip"
		udhcpd
    elif [ $1 = "load" ]
    then
        $drvload
    elif [ $1 = "unload" ]
    then
        $drvunload
    fi
}

wifi_load()
{
		echo "oooooooo: load wifi: dev is $wifidev."
        wifiko load   
        wpa_supplicant -B -d -Dnl80211 -i $wifidev -c $wpa_config >/tmpfs/wifi.connect 2>&1        
}

wifi_connect()
{
	echo "oooooooo: connect wifi: dev is $wifidev."
	wpa_cli -i $wifidev -p /var/wpa_supplicant disconnect >/tmpfs/wifi.disconnect1 2>&1
	wpa_cli -i $wifidev -p /var/wpa_supplicant terminate  >/tmpfs/wifi.disconnect2 2>&1
	wpa_supplicant -B -d -Dnl80211 -i $wifidev -c $wpa_config >/tmpfs/wifi.connect 2>&1
	wpa_cli -i $wifidev -p /var/wpa_supplicant disconnect
	wpa_cli -i $wifidev -p /var/wpa_supplicant select_network 0
	wpa_cli -i $wifidev -p /var/wpa_supplicant enable_network 0
}

wifi_disconnect()
{
	echo "oooooooo: disconnect wifi: dev is $wifidev."
	wpa_cli -i $wifidev  -p /var/wpa_supplicant disconnect >/tmpfs/wifi.disconnect1 2>&1
}

###生成wpa_config文件
### wpa_config {configfile}
### $1 wpa_config filename
gen_wpa_config()
{
    rm $wpa_config

    echo "ctrl_interface=/var/wpa_supplicant" >> $wpa_config
    echo "ap_scan=1" >>  $wpa_config
	echo "update_config=1" >>  $wpa_config
	
    #wifikeytype define in file $wifi_config
    #wifikeytype =1: no key
    #wifikeytype =2: wep
    #wifikeytype =3:wpa
    if [ $wifikeytype = 1 ]
    then
        echo "network={" >>  $wpa_config
        echo "ssid=\"${wifiessid}\" " >>  $wpa_config
        echo   "key_mgmt=NONE" >>  $wpa_config
        echo "}" >>  $wpa_config
    elif [ $wifikeytype = 2 ]
    then
        echo "network={" >>  $wpa_config
        echo "ssid=\"${wifiessid}\" " >>  $wpa_config
        echo   "wep_key${wifiwhichkey}=${wifikey}" >>  $wpa_config 
        echo   "key_mgmt=NONE" >>  $wpa_config
        echo   "wep_tx_keyidx=${wifiwhichkey}" >>  $wpa_config
        echo   "auth_alg=SHARED" >>  $wpa_config
        echo " }" >>  $wpa_config

    elif [ $wifikeytype = 3 ]
    then
        wpa_passphrase  $wifiessid $wifikey >>  $wpa_config
    fi
}

wifi_status()
{
	wpa_status=`wpa_cli -i $wifidev  -p /var/wpa_supplicant status 2>/dev/null | grep wpa_state | sed -n 's/wpa_state=//gp'`
	echo "oooooooo: wifi status is $wpa_status"
	if [ -z $wpa_status ]
	then
		echo "ERROR"
	else
		echo $wpa_status
	fi
}

echo "oooooooo: connect wifi: arg1 is $1; dev is $wifidev; cofig file is $wpa_config."

case "$1" in 
    "status")
        wifi_status=$(wifi_status)
        echo $wifi_status
        ;;
    
    "load")
        wifi_load
        ;;
    
    "unload")
        wifiko unload
        ;;
        
    "connect")
        wifi_connect
        ;;
        
    "disconnect")
        wifi_disconnect
        ;;
        
     "start")
        wifi_disconnect
        wifiko unload
        wifiko load
        wifi_connect
        ;;
     "test")
        wifi_disconnect
        wifi_connect
        
        ;;
    "stop")
        wifi_disconnect
        wifiko unload
        ;;
    *)
        echo "`basename $0` {connect|disconnect|status|load|unload|stop}"
        ;;
esac
