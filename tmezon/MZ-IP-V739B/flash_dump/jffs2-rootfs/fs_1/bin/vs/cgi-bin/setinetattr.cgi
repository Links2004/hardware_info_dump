#!/bin/sh

IFCONF=/etc/network/ifattr
IFCONF_BAK=/tmpfs/ifattr
IFRESOLV=/mnt/config/network/resolv.conf
RESOLV=/etc/resolv.conf
DHCPC=/bin/vs/dhcp.sh
NETDEV=/tmpfs/netdev
iface=`cat $NETDEV`
net_serv=/tmpfs/net_serv

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

#parse the QUERY_STRING and get the param
p_dhcp="`get_param "dhcp"`"
p_dnstype="`get_param "dnsstat"`"
p_address="`get_param "ipaddr"`"
p_netmask="`get_param "netmask"`"
p_gateway="`get_param "gateway"`"
p_dns1="`get_param "fdnsip"`"
p_dns2="`get_param "sdnsip"`"
p_hwaddr="`get_param "hwaddr"`"

#echo IP:$p_address

if [ "$p_dhcp" = "on" ];then
    p_dhcp=y
elif [ "$dp_hcp" = "off" ];then
    p_dhcp=n
else
    p_dhcp=n
fi

if [ "$p_dnstype" = "1" ];then
### 使用dhcp分配的dns server
    p_dnstype=server
elif [ "$p_dnstype" = "0" ];then
    p_dnstype=specify
else    
    p_dnstype=specify
fi

##. $IFCONF

#save ifattr
cp -f $IFCONF $IFCONF_BAK > /dev/null

if [ "$p_dhcp" = y ];then
    sed -e "s/^dhcp=.*/dhcp=$p_dhcp/" \
        -e "s/^dnstype=.*/dnstype=$p_dnstype/" \
        $IFCONF_BAK > $IFCONF
    
elif [ "$p_dhcp" = "n" ];then
    sed -e "s/^dhcp=.*/dhcp=$p_dhcp/" \
        -e "s/^dnstype=.*/dnstype=$p_dnstype/" \
        -e "s/^address=.*/address=$p_address/" \
        -e "s/^netmask=.*/netmask=$p_netmask/" \
        -e "s/^gateway=.*/gateway=$p_gateway/"  \
        $IFCONF_BAK > $IFCONF
fi

#save dns
if [ "$p_dnstype" = specify ];then
    if [ "$p_dns1" = "" ] && [ "$p_dns2" = "" ]
    then
        xx=""
    else
        echo -n > $IFRESOLV
        if [ "$p_dns1" != "" ]
        then
            echo nameserver $p_dns1 >> $IFRESOLV 
        fi
        if [ "$p_dns2" != "" ]
        then
            echo nameserver $p_dns2 >> $IFRESOLV 
        fi        
    fi
    
fi    

# 没有mac参数
if [ $p_hwaddr"A" = "A" ]
then
    #echo "Do nothing"
    XY=0

else
    mac=`/bin/paraconf r 1 mac`
    ret=$?
    #echo $mac to $p_hwaddr

    if [ ${ret} -ne 0 ]
    then
        mac=$p_hwaddr
    fi
    
    if [ $mac"A" != $p_hwaddr"A" ]
    then
        /bin/paraconf w 1 mac $p_hwaddr
        echo MACCHANGE > $net_serv
        #echo "set mac to $p_hwaddr"
        ifconfig $iface down
        #ifconfig $iface hw ether $p_hwaddr
        #ifconfig $iface up
        #mac 改变, 退出, 让守护进程处理
        exit
    fi
fi

. $IFCONF
