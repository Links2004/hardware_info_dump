$(function() {

    var MaxWifiSignal = 255;
	var able1;
	var sid1;
	var mode1;
	var psw1;
	
    $(document).ready(function(e) {
        LoadLanguage();

		if(wifienable == "0")
		{
			able1 = 0;
		}else
		{
			able1 = 1;
		}
		
        if (wifienable == "0") $("#WifiEnable").prop("checked", false);
        else $("#WifiEnable").prop("checked", true);

        $("#CurHotPointSSIDInput").html(wifissid);

        if (linkstatus == 1) $("#CurHotPointStatus").html(ConnectSpan);
        else $("#CurHotPointStatus").html(DisconnectSpan);
		
		$("#ConfSSIDInput").val(wifissid);
		$("#AuthModeSelect option[value="+ wifikeytype + "]").prop("selected",true);
		$("#WPAPasswd").val(wifikey);
		$("#WPAPasswdText").val(wifikey);
		$("#WPAPasswdText").width($("#WPAPasswd").width());
		$("#WPAPasswdText").height($("#WPAPasswd").height());
		
		
		sid1 = $("#ConfSSIDInput").val();
		mode1 = $("#AuthModeSelect option:selected").val();
		psw1 = $("#WPAPasswd").val();
		
    });
	
    $("#Search").click(function() {
        var cgiurl = "http://" + window.document.location.host + "/cgi-bin/hi3510/scanwifi.cgi?cmd=scanwifi";
       cgiurl += '&-time="' + new Date().getTime() + '"';
        $.get(cgiurl,
        function(data) {
			
            count = data.split("\n").length - 1; //算出行数
            eval(data);
            var singal = new Array();
            var ssid = new Array();
            var secret = new Array();

            for (i = 1, k = 0; i < count; i++, k++) {
                singal[k] = eval("signal_" + i);
                ssid[k] = eval("ssid_" + i);
                secret[k] = eval("secret_" + i);
            }

            for (i = 0; i < k; i++) //排序，把信号最大的放在前面。
            {
                for (j = i + 1; j < k; j++) {
                    if (singal[i] > singal[j]) {
                        tmp = singal[i];
                        singal[i] = singal[j];
                        singal[j] = tmp;

                        tmp = ssid[i];
                        ssid[i] = ssid[j];
                        ssid[j] = tmp;

                        tmp = secret[i];
                        secret[i] = secret[j];
                        secret[j] = tmp;
                    }	
                }
            }

            $("#SearchResultTable").html("");
            for (i = 0; i < k; i++) {
                per = parseInt(singal[i] / MaxWifiSignal * 100) + "%";
		$("#SearchResultTable").append('<tr>' + '<td>' + ssid[i] + "</td>" + '<td>' + per + "</td>" + '<td>' + secret[i] + "</td>" + "</tr>");
                $("#SearchResultTable tr:odd").addClass("SearchResultTableTrOdd");
                $("#SearchResultTable tr:even").addClass("SearchResultTableTrEven");
                $("#SearchResultTable tr td:first-child").width($("#SearchResultHead tr td:first-child").width());
                $("#SearchResultTable tr td:last-child").width($("#SearchResultHead tr td:last-child").width());
            }
        },
        "text")
    })

    $(document).on("mouseenter", " #SearchResultTable tr",
    function() {
        $(this).removeAttr("class");
        $(this).addClass("SearchResultTableTrHover");
    });
    $(document).on("mouseleave", " #SearchResultTable tr",
    function() {
        $(this).removeClass("SearchResultTableTrHover");
        $("#SearchResultTable tr:odd").addClass("SearchResultTableTrOdd");
        $("#SearchResultTable tr:even").addClass("SearchResultTableTrEven");
	 })

    $(document).on("click", "#SearchResultTable tr",
    function() {
        $("#ConfSSIDInput").val($(this).children("td:first").text());
        Auth = ($(this).children("td:last").text());
		 $("#AuthModeSelect option").removeAttr("selected");
        if ((Auth.search("WPA-") != -1) || (Auth.search("WPA2-") != -1)) $("#AuthModeSelect option:eq(2)").prop("selected",true);
        else if (Auth.search("WEP") != -1)  $("#AuthModeSelect option:eq(1)").prop("selected",true);
        else $("#AuthModeSelect option:eq(0)").prop("selected",true);
			 
		$("#WPAPasswd").val("");
		$("#WPAPasswdText").val("");
    })

    $("#cancel").click(function() {
        window.location.reload(true);
    })

    $("#TestConnect").click(function() {
    var cgiurl = "http://" + window.document.location.host + "/cgi-bin/hi3510/wifitest.cgi?";
		var select = $("#AuthModeSelect option:selected").val();
		if(select == 2 || select == 3){
			var psw = $("#WPAPasswd").val();
			if(psw.length == 0){
				alert("Length error");
				return;
			}
		}
		cgiurl += "&-ssid=" + $("#ConfSSIDInput").val();
		cgiurl += "&-wktype=" + $("#AuthModeSelect option:selected").val();
		cgiurl += "&-key=" + $("#WPAPasswd").val();
		//cgiurl += '&-time="' + new Date().getTime() + '"';
		$(this).prop("disabled", true);
		$("#TestMsgSpan").html(TestConnectSpan);
        $.get(cgiurl, function(data){
			eval(data);
			if(("undefined" != typeof wifi_linkstatus)&&(wifi_linkstatus == "COMPLETED"))$("#TestMsgSpan").html(TestConnectSuccessSpan);
			else $("#TestMsgSpan").html(TestConnectFailureSpan);
			},
			 "text");
    })

	$("#ShowPasswordInput").click(function() {
        if ($(this).prop("checked")) {
			$("#WPAPasswdText").css("display", "inline-block");
			$("#WPAPasswd").css("display", "none");
        } else {
			$("#WPAPasswdText").css("display", "none");
            $("#WPAPasswd").css("display", "inline-block");
        }
    })
	
	
	$("#WPAPasswdText, #WPAPasswd").keyup(function(e) {
        if($(this).attr("id") == "WPAPasswdText") $("#WPAPasswd").val($(this).val());
		else $("#WPAPasswdText").val($(this).val());
    });
	   	
	$("#apply").click(function(){
        var form = document.form2;
       form.cururl.value = document.URL;

		$("#Form2WifiEnable").prop("name", "-enable");
		if($("#WifiEnable").prop("checked")) $("#Form2WifiEnable").val(1);
		else  $("#Form2WifiEnable").val(0);

		$("#Form2WifiSSID").prop("name", "-ssid");
		$("#Form2WifiSSID").val($("#ConfSSIDInput").val());

		$("#Form2WifiKeytype").prop("name", "-wktype");
		$("#Form2WifiKeytype").val($("#AuthModeSelect option:selected").val());

		$("#Form2WifiWhichkey").prop("name", "-wepid");
		$("#Form2WifiWhichkey").val(0);
		
		$("#Form2WifiKey").prop("name", "-key");
		$("#Form2WifiKey").val($("#WPAPasswd").val());
		
	   var able2 = $("#Form2WifiEnable").val();
	   var sid2 = $("#ConfSSIDInput").val();
	   var mode2 = $("#AuthModeSelect option:selected").val();
	   var psw2 = $("#WPAPasswd").val();
		
		if(( psw2.search("&") != -1 )||( psw2.search(" ") != -1 )||( sid2.search("&") != -1 )||( sid2.search(" ") != -1 ))
		//if( wifikeypsw.search(/[^a-zA-Z0-9_\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\`\{\|\}\~\s]/) != -1 )
		{
	 		alert("Invalid space and \"&\"");		
	  		return;
			//alert(wifikeypsw);
		}

		if(mode2 == 3)
		{
			if(psw2.length < 8)
			{
				alert(PswLengthSpan);
				return;
			}
		}
		
		if(mode2 == 2)
		{
			if(psw2.length == 0)
			{
				alert("Password can not be none");
				return;
			}
		}		
		
		if(( psw2.search("&") != -1 )||( psw2.search(" ") != -1 )||( sid2.search("&") != -1 )||( sid2.search(" ") != -1 ))
		//if( wifikeypsw.search(/[^a-zA-Z0-9_\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\`\{\|\}\~\s]/) != -1 )
		{
	 		alert("Invalid space and \"&\"");		
	  		return;
			//alert(wifikeypsw);
		}		
		
		if((able1 != able2)||(sid1 != sid2)||(mode1 != mode2)||(psw1 != psw2)) 
		{
		    	alert(IPChangeMsg);
			form.action="/cgi-bin/hi3510/param.cgi?cmd=setwifiattr&";
			//form.action="/cgi-bin/hi3510/setwifiattr.cgi?&-ssid=sid2&-wktype=mode2&-key=psw2";
			form.submit();
			window.location.reload(false);
			
		}else
		{
			return;
		}
		
		
	})
	
})
