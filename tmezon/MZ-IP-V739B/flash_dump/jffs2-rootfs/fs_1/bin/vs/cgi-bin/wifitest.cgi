#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
. $wifidev_config

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


wifiessid="`get_param "ssid"`"
wifikeytype="`get_param "wktype"`"
wifiwhichkey="`get_param "wepid"`"
wifikey="`get_param "key"`"

#echo "wifikey $wifikey"
#echo "ssid=$wifiessid"

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
	echo 200 OK HTTP 1.1                                                                                
	echo                                                                                                
	echo var wifi_linkstatus=\"ERROR\"\;                                                        
                                                                                                    
	echo -e "\r\n"      		
	exit
    	fi
        wpa_passphrase  $wifiessid $wifikey >>  $wpa_config_tmp
    fi
}


wifi_status()
{
    wpa_status=`wpa_cli -i $wifidev -p /var/wpa_supplicant status 2>/dev/null | grep wpa_state | sed -n 's/wpa_state=//gp'`
    if [ -z $wpa_status ]
    then
        echo "ERROR"
    else
        echo $wpa_status
    fi
}

wpa_cli -i $wifidev -p /var/wpa_supplicant disconnect >/tmpfs/wifi.disconnect1 2>&1
wpa_cli -i $wifidev -p /var/wpa_supplicant terminate  >/tmpfs/wifi.disconnect2 2>&1


gen_wpa_config_tmp
wpa_supplicant -B -d -Dnl80211 -i $wifidev -c $wpa_config_tmp >/tmpfs/wifi.connect 2>&1    

cnt=0
while [ $cnt -lt 20 ]
do
    linkstatus=`wpa_cli -i $wifidev -p /var/wpa_supplicant status 2>/dev/null | grep wpa_state | sed -n 's/wpa_state=//gp'`
    if [ -z $linkstatus ]
    then
        linkstatus=ERROR
        break
    else
         ### 只有COMPLETED 才是链接成功, 可能的值为 SCANNING, ASSOCIATING,SCANNING
         if [ ${linkstatus} = COMPLETED ]
         then
            break
         else
            sleep 1
             cnt=`expr $cnt + 1`
             echo "$linkstatus"
            #echo "cnt is $cnt"
         fi
        
    fi
done

## 重新启动wpa_supplicant
wpa_cli -i $wifidev -p /var/wpa_supplicant disconnect >/tmpfs/wifi.disconnect1 2>&1
sleep 1
wpa_cli -i $wifidev -p /var/wpa_supplicant terminate  >/tmpfs/wifi.disconnect2 2>&1
sleep 1
wpa_supplicant -B -d -Dnl80211 -i $wifidev -c $wpa_config >/tmpfs/wifi.connect 2>&1    
sleep 1

echo 200 OK HTTP 1.1 
echo
echo var wifi_linkstatus=\"${linkstatus}\"\;
echo -e "\r\n"
