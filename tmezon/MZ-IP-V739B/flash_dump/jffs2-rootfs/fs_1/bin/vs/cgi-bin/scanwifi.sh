#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
. $wifi_config

enable=1
cat $wifidev_config > $wifi_config_tmp
echo "wifidev=\"${wifidev}\"" >> $wifi_config_tmp
echo "wifienable=\"${enable}\"" >> $wifi_config_tmp
echo "wifiessid=${wifiessid}" >> $wifi_config_tmp
echo "wifikeytype=$wifikeytype" >> $wifi_config_tmp
echo "wifiwhichkey=$wifiwhichkey" >> $wifi_config_tmp
echo "wifikey=\"$wifikey\"" >> $wifi_config_tmp
cat $wifi_config_tmp  > $wifi_config

wpa_cli -i $wifidev -p /var/wpa_supplicant scan > /dev/null 2>1&
wpa_cli -i $wifidev -p /var/wpa_supplicant scan_result 1>/wifi_scan_result
wpa_cli -i $wifidev -p /var/wpa_supplicant scan > /dev/null 2>1&
wpa_cli -i $wifidev -p /var/wpa_supplicant scan_result 1>/wifi_scan_result
