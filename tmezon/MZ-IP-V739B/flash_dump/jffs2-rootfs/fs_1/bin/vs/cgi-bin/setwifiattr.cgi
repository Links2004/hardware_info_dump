#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
. $wifi_config

if [ "$REQUEST_METHOD" = "GET" ]
then
    CGIPARAM=$QUERY_STRING
elif [ "$REQUEST_METHOD" = "POST" ]
then
    read CGIPARAM
else
    CGIPARAM=$1
fi

CMD_LINE="`echo $CGIPARAM | sed -n "s/&/\n/gp"`"
get_param()
{
    echo "${CMD_LINE}" | grep "${1}=" | sed -n "s/\-${1}=//p" 
}

wifiessidold=$wifiessid
wifiwhichkeyold=$wifiwhichkey
ssid="`get_param "ssid"`"
wktype="`get_param "wktype"`"
wepid="`get_param "wepid"`"
enable="`get_param "enable"`"
wifiessid=$ssid
wifiessid2=`StrToInt $wifiessid`
wifiwhichkey=$wepid
wifikeytype=$wktype
wifikeyold="$wifikey"
wifikey="`get_param "key"`"
wifikey2=`StrToInt $wifikey`

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
echo "#wifiessid=${wifiessid}" >> $wifi_config_tmp
echo "wifiessid=\"${wifiessid2}\"" >> $wifi_config_tmp
echo "wifikeytype=$wifikeytype" >> $wifi_config_tmp
echo "wifiwhichkey=$wifiwhichkey" >> $wifi_config_tmp
echo "#wifikey=\"$wifikey\"" >> $wifi_config_tmp
echo "wifikey=\"$wifikey2\"" >> $wifi_config_tmp
cat $wifi_config_tmp  > $wifi_config

gen_wpa_config

echo "oooooooo: gen_cofig: $wifi_config_tmp and $wifi_config"

echo -e "\r\n"
echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" content=\"0;URL=$HTTP_REFERER\"></head><body></body></html>"

