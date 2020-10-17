#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
. $wifi_config

enable=1
wifiessid=$1
wifiessid2=`StrToInt $wifiessid`
wifikeytype=$2
if [ -n "$3" ] ;
then
	wifikey=$3
	wifikey2=`StrToInt $wifikey`
else
	wifikey=
fi

gen_wpa_config()
{
    rm $wpa_config $wpa_config_tmp
    echo "ctrl_interface=/var/wpa_supplicant" >> $wpa_config_tmp

    echo "ap_scan=1" >>  $wpa_config_tmp
	echo "update_config=1" >>  $wpa_config_tmp

    if [ $wifikeytype = 1 ]
    then
        echo "network={" >>  $wpa_config_tmp
        echo "ssid=\"${wifiessid}\" " >>  $wpa_config_tmp
        echo   "key_mgmt=NONE" >>  $wpa_config_tmp
        echo "}" >>  $wpa_config_tmp
    elif [ $wifikeytype = 2 ]
    then
        echo "network={" >>  $wpa_config_tmp
        echo "ssid=\"${wifiessid}\" " >>  $wpa_config_tmp
        echo   "wep_key${wifiwhichkey}=${wifikey}" >>  $wpa_config_tmp 
        echo   "key_mgmt=NONE" >>  $wpa_config_tmp
        echo   "wep_tx_keyidx=${wifiwhichkey}" >>  $wpa_config_tmp
        echo   "auth_alg=SHARED" >>  $wpa_config_tmp
        echo " }" >>  $wpa_config_tmp

    elif [ $wifikeytype = 3 ]
    then
        wpa_passphrase  "$wifiessid" "$wifikey" >>  $wpa_config_tmp
    fi
	
	cp -f $wpa_config_tmp $wpa_config
}

cat $wifidev_config > $wifi_config_tmp
echo "wifidev=\"${wifidev}\"" >> $wifi_config_tmp
echo "wifienable=\"${enable}\"" >> $wifi_config_tmp
echo "#wifiessid=\"${wifiessid}\"" >> $wifi_config_tmp
echo "wifiessid=\"${wifiessid2}\"" >> $wifi_config_tmp
echo "wifikeytype=$wifikeytype" >> $wifi_config_tmp
echo "wifiwhichkey=$wifiwhichkey" >> $wifi_config_tmp
echo "#wifikey=\"$wifikey\"" >> $wifi_config_tmp
echo "wifikey=\"$wifikey2\"" >> $wifi_config_tmp

cat $wifi_config_tmp  > $wifi_config

gen_wpa_config

