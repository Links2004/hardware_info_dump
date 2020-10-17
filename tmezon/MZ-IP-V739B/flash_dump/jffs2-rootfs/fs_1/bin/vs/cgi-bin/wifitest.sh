#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
. $wifidev_config

wifiessid="$1"
wifiessid2=`StrToInt "$wifiessid"`
wifikeytype="$2"
wifikey="$3"

gen_wpa_config_tmp()
{
    rm $wpa_config_tmp 2>/dev/null
    echo "ctrl_interface=/var/wpa_supplicant" >> $wpa_config_tmp

    echo "ap_scan=1" >>  $wpa_config_tmp
    #wifikeytype define in file $wifi_config
    #wifikeytype =1: no key
    #wifikeytype =2: wep
    #wifikeytype =3:wpa

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
        if [ $wifikey"A" = "A" ]
        then  
                                exit
        fi
        wpa_passphrase  $wifiessid $wifikey >>  $wpa_config_tmp
    fi
}

wpa_cli -i $wifidev -p /var/wpa_supplicant disconnect >/tmpfs/wifi.disconnect1 2>&1
wpa_cli -i $wifidev -p /var/wpa_supplicant terminate  >/tmpfs/wifi.disconnect2 2>&1
gen_wpa_config_tmp
wpa_supplicant -B -d -Dnl80211 -i $wifidev -c $wpa_config_tmp >/tmpfs/wifi.connect 2>&1    

cnt=0
while [ $cnt -lt 20 ]
do
#wpa_cli -i wlan0 -p /var/wpa_supplicant status | grep wpa_state | sed -n 's/wpa_state=//gp'
    linkstatus=`wpa_cli -i wlan0 -p /var/wpa_supplicant status | grep wpa_state | sed -n 's/wpa_state=//gp'`
    if [ -z $linkstatus ]
    then
        linkstatus=ERROR
        break
    else
         if [ ${linkstatus} = COMPLETED ]
         then
            break
         else
			sleep 1
			cnt=`expr $cnt + 1`
         fi
        
    fi
done

echo var wifi_linkstatus=\"${linkstatus}\"\;

wpa_cli -i $wifidev -p /var/wpa_supplicant disconnect >/tmpfs/wifi.disconnect1 2>&1
wpa_cli -i $wifidev -p /var/wpa_supplicant terminate  >/tmpfs/wifi.disconnect2 2>&1
wpa_supplicant -B -d -Dnl80211 -i $wifidev -c $wpa_config >/tmpfs/wifi.connect 2>&1
