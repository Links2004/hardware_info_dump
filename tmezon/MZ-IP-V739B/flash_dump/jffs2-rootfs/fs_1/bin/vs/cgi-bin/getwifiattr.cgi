#!/bin/sh

. /mnt/config/network/wifi.conf

echo ${wifiessid} >> /tmp/tmpfile
echo ${wifikey}   >> /tmp/tmpfile

wifikey2=`IntToStr $wifikey`
wifiessid2=`IntToStr $wifiessid`
wifikey2=`AddCharForIE $wifikey2`
wifiessid2=`AddCharForIE $wifiessid2`
linkstatus=`wpa_cli -i $wifidev -p /var/wpa_supplicant status 2>/tmpfs/erro.info | grep 'wpa_state' | sed -n "s/\wpa_state=//p"`

echo 200 OK HTTP 1.1 
echo
echo var wifissid = \"${wifiessid2}\"\;
echo var wifikeytype = \"${wifikeytype}\"\;
echo var wifiwhichkey = \"${wifiwhichkey}\"\;
echo var wifikey=\"${wifikey2}\"\;
if [ -z ${linkstatus} ]
then
	echo var linkstatus=\"0\"\;
elif [ ${linkstatus} = COMPLETED ]
then
	echo var linkstatus=\"1\"\;
else
	echo var linkstatus=\"0\"\;
fi
echo var wifienable=\"${wifienable}\"\;

