#!/bin/sh

IFCONF=/etc/network/ifattr
IFRESOLV=/mnt/config/network/resolv.conf
NETDEV=/tmpfs/netdev

. $IFCONF

iface=`cat $NETDEV`

if [ ${dhcp} = "y" ];then 
    dhcpflag=on
elif [ ${dhcp} = "n" ];then
    dhcpflag=off
fi

if [ ${dnstype} = "server" ] ; then
    dnsstat=1
elif [ ${dnstype} = "specify" ] ; then
    dnsstat=0
fi

DNS1=`grep nameserver $IFRESOLV | sed -n '1 s/^nameserver *//'p`
DNS2=`grep nameserver $IFRESOLV | sed -n '2 s/^nameserver *//'p`

MAC=`ip address show $iface|awk  '/link\/ether/ {print $2}'`

ipinfo=`ifconfig $iface | grep "inet addr"`
##echo ipinfo is $ipinfo

address=`echo $ipinfo | awk '{print $2}'| sed -n "s/addr://p"`
##echo $address
##address=`echo $ipinfo |sed -n "s/ /\n/gp"| grep -E 'addr'|sed -n "s/\addr://p"`
netmask=`echo $ipinfo | awk '{print $4}'| sed -n "s/Mask://p"`
##netmask=`ifconfig $iface | grep 'inet addr'|sed -n "s/ /\n/gp"| grep -E 'Mask'|sed -n "s/\Mask://p"`
gateway=`route | awk -v k="$iface"  '{if ($1=="default" && $8==k) print $2}' `
#gateway=`route|grep $iface | awk '(/default/) {print $2}'`
#TODOLFF 
if [ $iface = eth0 ];then
    NETTYPE=LAN
else
    NETTYPE=WIRELESS
fi

if [ "$1" != "nohead" ]
then
echo -e "Content-Type:text/plain\r"
echo -e "\r"
fi

echo -e "var dhcpflag = \"$dhcpflag\" ;\r"
echo -e "var ip = \"$address\" ;\r"
echo -e "var netmask = \"$netmask\" ;\r"
echo -e "var gateway = \"$gateway\" ;\r"
echo -e "var dnsstat = \"$dnsstat\" ;\r"
echo -e "var fdnsip = \"$DNS1\" ;\r"
echo -e "var sdnsip = \"$DNS2\" ;\r"
echo -e "var macaddress = \"$MAC\" ;\r"
echo -e "var networktype = \"$NETTYPE\" ;\r"
echo -e "var httpport = \"80\" ;\r"                                         
