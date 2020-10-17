#!/bin/sh

DDNSCONF=/mnt/config/ddns.conf
DDNSENABLE=/mnt/config/ddns_enable.conf

. $DDNSCONF
. $DDNSENABLE

echo -e "Content-Type:text/plain\r"
echo -e "\r"
echo -e "var ddnsdomain = \"$DDNS_DOMAINNAME\" ;\r"
echo -e "var ddnsusername = \"$DDNS_USERNAME\" ;\r"
echo -e "var ddnspassword = \"$DDNS_USERPASSWORD\" ;\r"
echo -e "var ddnsispname = \"$DDNS_ISPNAME\" ;\r"
echo -e "var ddnsdnsserver = \"$DDNS_DNSSERVER\" ;\r"
echo -e "var ddnsisproxy = \"$DDNS_ISPROXY\" ;\r"

echo -e "var ddnsenable = \"$DDNS_ENABLE\" ;\r"
