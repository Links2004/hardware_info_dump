#!/bin/sh
##################################################
# ddns client
# Author: leitz@sin360.net 2007.04.25
##################################################
DIRINCLUDE="/usr/sbin/ddns"
DEFAULTDNSSERVER="www.perfecteyes.com"

. ${DIRINCLUDE}/ddnsrc

. ${CONFIGFILE}

#check config
if [ "${DDNS_DOMAINNAME}" == "" ] ||  [ "${DDNS_USERNAME}" == "" ] || [ "${DDNS_USERPASSWORD}" == "" ]
then
	exit 1
fi
#set default DDNS_DNSSERVER
if [ "${DDNS_DNSSERVER}" == "" ]
then
	DDNS_DNSSERVER="${DEFAULTDNSSERVER}"
fi

SUCCESSFLAG="good"
NOCHANGEFLAG="nochg"

RegisterDomain()
{
#	deletefile ${OUTPUTFILE}
	URL="http://${DDNS_USERNAME}:${DDNS_USERPASSWORD}@${DDNS_DNSSERVER}/ddns/update?hostname=${DDNS_DOMAINNAME}&myip=${IPAddress}"
	echo "DDNS URL:${URL}"
	${WGETCMD} -O ${OUTPUTFILE} ${URL}
	result="$?"
	if [ "${result}" == "0" ]
	then
		result=`grep ${SUCCESSFLAG} ${OUTPUTFILE}`
		if [ $? == 1 ] || [ "$result" == "" ] 
		then
			result=`grep ${NOCHANGEFLAG} ${OUTPUTFILE}`
			if [ $? == 1 ] || [ "$result" == "" ] 
			then
				echo "DDNS Register ${DDNS_DOMAINNAME} ${IPAddress} Failed!"
				exit 1
			fi
		fi
		echo "DDNS Register ${DDNS_DOMAINNAME} ${IPAddress} OK!"
		exit 0
	else
		echo "DDNS Register ${DDNS_DOMAINNAME} ${IPAddress} Error!"
		exit 2
	fi
}

IPAddress=""
[ "${DDNS_ISPROXY}" == "y" ]  || [ "${DDNS_ISPROXY}" == "yes" ]  || [ "${DDNS_ISPROXY}"  == "1" ] || GetIPAddress

RegisterDomain

exit 0
