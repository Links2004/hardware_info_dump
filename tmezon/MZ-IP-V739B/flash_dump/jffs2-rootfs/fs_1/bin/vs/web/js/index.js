// JavaScript Document
var Player = new PlayerObj();
var g_speed = 3;
var pswd;

function GetPlayerLayerWidthHeight() {
    var MinHeight = 430;
    var MinWidth = 900;

    width = document.documentElement.clientWidth - parseInt($("#LeftToolLayer").css("width")) - 20;
    height = document.documentElement.clientHeight - parseInt($(".header li").css("height")) - 30;

    if (height < MinHeight) height = MinHeight;
    if (width < MinWidth) width = MinWidth;

    return {
        w: width,
        h: height
    };
}

function LoadPlayer() {
    return Player.Load();
}

function StartPlay() {
    return Player.Play(GetPlayerLayerWidthHeight().w, GetPlayerLayerWidthHeight().h);
}

function StopPlay() {
    return Player.StopPlay();
}

function PlayerResize(w, h) {
    return Player.PlayerResize(w, h);
}

function GetVideoWidthHeight() {
    return Player.GetVideoWidthHeight();
}

function RePlay(w, h) {
    StopPlay();
    return StartPlay();
}

function Record() {
    return Player.Record();
}

function Snap() {
    return Player.Snap();
}

function PlayBack() {
    return Player.PlayBack(pswd);
}

function StartTalk(stat) {
    return Player.StartTalk(stat);
}

function SetMute(stat) {
    return Player.SetMute(stat);
}

$(function() {
    var prevObjId = "#ImageSpan";
    var w_1, h_1, w_2, h_2;
    $(document).ready(function(e) {

        $("#LoginLayer").css("margin-left", parseInt((document.documentElement.clientWidth - $("#LoginLayer").width()) / 2) + "px");
        $("#MainMenuLayer").css("margin-left", parseInt((document.documentElement.clientWidth - $("#MainMenuLayer ul").width()) / 2) + "px");
        $("#LoginLayer").css("margin-top", parseInt((document.documentElement.clientHeight - $("#LoginLayer").height()) / 2) + "px");	
		$(".side a span:first-child").addClass("SideAFirstchildSpan");
		
        /***********************获取图像高宽*******************/
        var cgiurl = "cgi-bin/hi3510/getvencattr.cgi?-chn=11";
        $.get(cgiurl,
        function(data) {
            eval(data);
            w_1 = width_1;
            h_1 = height_1;
        });
        cgiurl = "cgi-bin/hi3510/getvencattr.cgi?-chn=12";
        $.get(cgiurl,
        function(data) {
            eval(data);
            w_2 = width_2;
            h_2 = height_2;
        });
        /***********************动态加载多国语言*******************/
        LoadLanguage();

        GetStrFromXML('DownLoadPlayerMsg', 'HueImgTitile', 'BrightnessImgTitile', 'ContrastImgTitle', 'SaturationImgTitile', 'GotoPointTitile', 'SetPointTitile', 'ClearPointTitile', 'NoAuthErrorMsg', 'LoginCheckErrorMsg');
        /*注意xmldate,,,,是一个全局变量，它保存的是由GetStrFromXML的参数获取的字符串*/
        eval(xmldate);

        DownLoadPlayerMsgSpan = DownLoadPlayerMsg;
        NoAuthErrorMsgSpan = NoAuthErrorMsg;
        LoginCheckErrorMsgSpan = LoginCheckErrorMsg;
        $("#HueImg").attr("title", HueImgTitile);
        $("#BrightnessImg").attr("title", BrightnessImgTitile);
        $("#ContrastImg").attr("title", ContrastImgTitle);
        $("#SaturationImg").attr("title", SaturationImgTitile);
        $("#GotoPoint").attr("title", GotoPointTitile);
        $("#SetPoint").attr("title", SetPointTitile);
        $("#ClearPoint").attr("title", ClearPointTitile);

        var language = getCookie("language");
				if (language == "en") {
            $("#LanSelect").get(0).selectedIndex = 0;
        } else if ((language == "zh-cn") || (language == "zh-CN")) {
            $("#LanSelect").get(0).selectedIndex = 1;
        } else if (language == "tw") {
            $("#LanSelect").get(0).selectedIndex = 2;
        } else if (language == "pt") {
            $("#LanSelect").get(0).selectedIndex = 3;
        } else if (language == "es") {
            $("#LanSelect").get(0).selectedIndex = 4;
        } else if (language == "ru") {
            $("#LanSelect").get(0).selectedIndex = 5;
        }
				else {
            $("#LanSelect").get(0).selectedIndex = 0;
        }

        /***********************登录处理*******************/
        $("#LonginUsername").val("");
        $("#LonginPassword").val("");

        var username = getCookie("username");
        if (username) {
            $("#LonginUsername").val(Base64.decode(username));
            $("#LonginPassword").focus();
        }

        type = Number(GetPlayStream());
        if (type == 11) {
            $("#StreamSelect").get(0).selectedIndex = 0;
        } else if (type == 12) {
            $("#StreamSelect").get(0).selectedIndex = 1;
        } else {
            $("#StreamSelect").get(0).selectedIndex = 0;
        }

        $("#PTZPosInput").val(1);

        var username = getCookie("username");
        var passwd = getCookie("password");
        if ((Number(GetAutoLogin()) == 1) && (passwd) && (username)) {
            $("#LonginUsername").val(Base64.decode(username));
            $("#LonginPassword").val(Base64.decode(passwd));

            $('#Login').click();

        } else {
            /********************延时1S目的让多语言加载完成*******************/
            setTimeout(function() {
                $('#LoginBgLayer').css('display', 'block');
            },
            500);
        }

        return true;

    });

    /*************注销登录************/
    $("#Logout").click(function() {
        delCookie("password");
        $('#AutoLogin').removeAttr('checked');
        StopPlay();
        window.location.reload();
    })
    /*************切换到预览界面************/
    $('#home').click(function() {
		$("#OCXCtlLayer").css("display", "block");
        $('#mainpageLayer').css('display', 'block');
        $('#AdvanceLayer').css('display', 'none');
        window.onresize();
    })

    /*************切换到参数设置界面************/
    $('#ParametersSet').click(function() {

        if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
		$("#OCXCtlLayer").css("display", "none");
        $('.side a, .side h1').css('display', 'none');
        $('#mainpageLayer').css('display', 'none');
        $('#AdvanceLayer').css('display', 'block');
        $('#NetworkLayer, #NetworkLayer a, #NetWorkSpan').css('display', 'block');
        $('#EventLayer, #EventLayer a, #EventSpan').css('display', 'block');

        $('#NetworkLayer a:first').click();
    })
    /*************切换到系统设置界面************/
    $('#SystemSet').click(function() {
		$("#OCXCtlLayer").css("display", "none");
        $('.side a, .side h1').css('display', 'none');
        $('#mainpageLayer').css('display', 'none');
        $('#AdvanceLayer').css('display', 'block');
        $('#SystemLayer, #SystemLayer a, #SystemSpan').css('display', 'block');

        if (!CheckAuth()) {
            $('#DeviceinfoSpan').click();
            return true;
        }

        $('#SystemLayer a:first').click();
    })
    /*************切换到媒体设置界面************/
    $('#Media').click(function() {

        if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
		$("#OCXCtlLayer").css("display", "none");
        $('.side a, .side h1').css('display', 'none');
        $('#mainpageLayer').css('display', 'none');
        $('#AdvanceLayer').css('display', 'block');
        $('#MediaLayer, #MediaLayer a, #MediaSpan').css('display', 'block');

        $('#MediaLayer a:first').click();
    })

    /*************系统设置右侧菜单折叠************/
    $("#MediaSpan,#EventSpan,#NetWorkSpan,#SystemSpan").click(function() {
        return true;
        $("#MediaLayer").css("display", "none");
        $("#NetworkLayer").css("display", "none");

        $("#EventLayer").css("display", "none");
        $("#SystemLayer").css("display", "none");

        switch ($(this).attr("id")) {
        case "MediaSpan":
            $("#MediaLayer").css("display", "block");
            break;
        case "EventSpan":
            $("#EventLayer").css("display", "block");
            break;
        case "NetWorkSpan":
            $("#NetworkLayer").css("display", "block");
            break;
        case "SystemSpan":
            $("#SystemLayer").css("display", "block");
            break;
        }
    })

    /*************系统设置右侧网页跳转************/
    $(".side a").click(function() {
        /*****************签权*************/
        if (!CheckAuth() && ($(this).children("span:first").attr("id") != "DeviceinfoSpan")) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }

        /*加粗当前字体*/
        $(this).children("span:first").css("color", "#F00");
        $(this).children("span:first").css("font-weight", "bold");
       /* $(this).css("background", "url(images/now_bar.png)");*/



        /*恢复上次字体*/
        if (prevObjId != ("#" + $(this).children("span:first").attr("id"))) {
            $(prevObjId).removeAttr("style");
            prevObjId = "#" + $(this).children("span:first").attr("id");
        }

        /******跳转相应的页面******/
        switch ($(this).children("span:first").attr("id")) {
        case "ImageSpan":
            $("#pageframe")[0].contentWindow.location = 'display.html';
            break;
        case "VideoSpan":
            $("#pageframe")[0].contentWindow.location = 'video.html';
            break;
        case "BasicSettingsSpan":
            $("#pageframe")[0].contentWindow.location = 'network.html';
            break;
        case "DDNSSpan":
            $("#pageframe")[0].contentWindow.location = 'ddns.html';
            break;
        case "MobileSpan":
            $("#pageframe")[0].contentWindow.location = 'osd.html';
            break;
        case "UserSpan":
            $("#pageframe")[0].contentWindow.location = 'user.html';
            break;
        case "EmailSpan":
            $("#pageframe")[0].contentWindow.location = 'email.html';
            break;
        case "MDSpan":
            $("#pageframe")[0].contentWindow.location = 'md.html';
            break;
        case "AlarmInSpan":
            $("#pageframe")[0].contentWindow.location = 'alarmin.html';
            break;
        case "AlarmOutSpan":
            $("#pageframe")[0].contentWindow.location = 'alarmout.html';
            break;
        case "AutoSnapSpan":
            $("#pageframe")[0].contentWindow.location = 'autosnap.html';
            break;
        case "LanguageSpan":
            $("#pageframe")[0].contentWindow.location = 'base.html';
            break;
        case "TimeSpan":
            $("#pageframe")[0].contentWindow.location = 'time.html';
            break;
        case "InitSpan":
            $("#pageframe")[0].contentWindow.location = 'initializemain.html';
            break;
        case "DeviceinfoSpan":
            $("#pageframe")[0].contentWindow.location = 'deviceinfo.html';
            break;
        case "LogSpan":
            $("#pageframe")[0].contentWindow.location = 'syslog.html';
            break;
        case "PTZSpan":
            $("#pageframe")[0].contentWindow.location = 'ptz.html';
            break;
        case "ODSpan":
            $("#pageframe")[0].contentWindow.location = 'od.html';
            break;
        case "RecordSpan":
            $("#pageframe")[0].contentWindow.location = 'record.html';
            break;
        case "StorageSpan":
            $("#pageframe")[0].contentWindow.location = 'storage.html';
            break;
		   case "WifiSpan":
            $("#pageframe")[0].contentWindow.location = 'wifi.html';
            break;	
			case "P2PSpan":
            $("#pageframe")[0].contentWindow.location = 'p2p.html';
            break;
		case "FTPSpan":
            $("#pageframe")[0].contentWindow.location = 'ftp.html';
            break;			
			
        }
    })

    /*******************码流类型选择*******************/
    $("#StreamSelect").change(function() {
        Type = $("#StreamSelect").children('option:selected').val();
        SetPlayStream(Type);
    })
    /*****************为解决resize窗口时，IE多次响应的问题*********************/
    var debounce = function(func, threshold, execAsap) {
        var timeout;
        return function debounced() {
            var obj = this,
            args = arguments;
            function delayed() {
                if (!execAsap) func.apply(obj, args);
                timeout = null;
            };
            if (timeout) clearTimeout(timeout);
            else if (execAsap) func.apply(obj, args);
            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    /*窗口缩放时的控件处理*/
    window.onresize = debounce(function() {
        return true;
        /*还在登录不处理*/
        if ($("#mainpageLayer").css("display") == "none") return true;

        var BrowserType = GetBrowserVer();
        var ImageSize = parseInt($("#ImageSize").children('option:selected').val());
        if ((ImageSize == 0)) //IE OCX
        {
            PlayerResize(GetPlayerLayerWidthHeight().w, GetPlayerLayerWidthHeight().h);
        }
        /***************调整mainpageLayer大小，让它能同时显示视频和左侧工具栏******************/
        var VideoWH = GetVideoWidthHeight();
        width = parseInt(VideoWH.w) + parseInt($('#LeftToolLayer').css('width'));
        if (width > document.documentElement.clientWidth) {
            width += 10;
            width += 'px';
            $('#mainpageLayer').css('width', width);
            $('#headerLayer').css('width', width);
        } else {
            width = document.documentElement.clientWidth;
            width += 'px';
            $('#mainpageLayer').css('width', width);
            $('#headerLayer').css('width', width);
        }

    },
    100, true);
    
    var count = 0;

    /********************登录确认***********************/
    $('#Login').click(function() {
    	var pcyear;
    	var pcmonth;
    	var pcday;
    	var pchour;
    	var pcminute;
    	var pcsecond;
    	now = new Date();
			pcyear=now.getYear();
			if( pcyear < 1000 )
		  	   	pcyear += 1900;
			if((pcyear < 1971)||(pcyear > 2036))
			{			
				alert(YearErrorMsg );
				return false;
			}    		
			pcmonth=now.getMonth()+1;
			if(pcmonth<10) pcmonth="0"+pcmonth;
			pcday=now.getDate();
			if(pcday<10) pcday="0"+pcday;
			pchour=now.getHours();
			if(pchour<10) pchour="0"+pchour;
			pcminute=now.getMinutes();
			if(pcminute<10) pcminute="0"+pcminute;
			pcsecond=now.getSeconds();
			if(pcsecond<10) pcsecond="0"+pcsecond;
			var pctime = pcyear+'.'+pcmonth+'.'+pcday+'.'+pchour+'.'+pcminute+'.'+pcsecond;
        
        var timezoneurl = now.getTimezoneOffset();
		if(timezoneurl < 0)
		{
			timezoneurl += 2000;
		}
        var url = "/cgi-bin/hi3510/checkuser.cgi?";
        url += ("&-name=" + $("#LonginUsername").val());
        url += ("&-passwd=" + $("#LonginPassword").val());
        url += ("&-time=" + pctime);
        url += ("&-timezone=" + timezoneurl);          

        var url2 = "/cgi-bin/hi3510/doorConnect.cgi?";
	  	url2 += ("&-door=" + $("#DoorSelect").children('option:selected').val());
        $.get(url,
        function(data) {
            eval(data);
            if(check == 1) {
                selectIndex = $("#LanSelect").children('option:selected').val();

                switch (selectIndex) {
                case "0":
                    setCookie("language", "en", 365);
                    break;
                case "1":
                    setCookie("language", "zh-cn", 365);
                    break;
				 				case "2":
                    setCookie("language", "tw", 365);
                    break;
                case "3":
                    setCookie("language", "pt", 365);
                    break;
                case "4":
                    setCookie("language", "es", 365);
                    break;  
                case "5":
                    setCookie("language", "ru", 365);
                    break;      
                default:
                    setCookie("language", "en", 365);
                    break;
                }

                delCookie("username");
                setCookie("username", Base64.encode($("#LonginUsername").val()), 365);
                delCookie("password");
                setCookie("password", Base64.encode($("#LonginPassword").val()), 365);
                delCookie("authLevel");
                setCookie("authLevel", authLevel, 365);

				setCookie("unlockpsw","",365);
                $("#ContainerLayer").css("display", "block");
                $("#headerLayer").css("display", "block");
                $("#mainpageLayer").css("display", "block");
                $("#LogoutLayer").css("display", "block");
                $("#LoginBgLayer").css("display", "none");
                $("#LogoLayer").css("display","block");

                BrowerType = GetBrowserVer();

                if ((BrowerType.brower == "IE")) $("#OCXCtlLayer").css('display', 'block');
                else $("#OCXCtlLayer").css('display', 'none');

                if (parseInt($("#StreamSelect").children('option:selected').val()) == 11) $("#StreamSelect1").get(0).selectedIndex = 0;
                else $("#StreamSelect1").get(0).selectedIndex = 1;
		if (parseInt($("#DoorSelect").children('option:selected').val()) == 0) $("#DoorSelect1").get(0).selectedIndex = 0;
                else if (parseInt($("#DoorSelect").children('option:selected').val()) == 1) $("#DoorSelect1").get(0).selectedIndex = 1;
		else if (parseInt($("#DoorSelect").children('option:selected').val()) == 2) $("#DoorSelect1").get(0).selectedIndex = 2;
		else if (parseInt($("#DoorSelect").children('option:selected').val()) == 3) $("#DoorSelect1").get(0).selectedIndex = 3;
		else $("#DoorSelect1").get(0).selectedIndex = 0;

		$.get(url2,function(data1) {eval(data);});

                if(false == StartPlay())
		{
			alert(DownLoadPlayerMsgSpan);
			return 0;
		}
				StartTalk(0);
				SetMute(1);			
            } else {
                $('#LoginBgLayer').css('display', 'block');
                alert(LoginCheckErrorMsgSpan);
            }

        });
        
        setInterval(function(){
			var cgiurl = 'cgi-bin/hi3510/getnetlinknum.cgi?&-getnetlinknum';
			cgiurl += "&-time=" + new Date().getTime();
			$.get(cgiurl,function(data) {
					eval(data);
					$('#PhoneCount').html(parseInt(phonelinknum));
					$('#IECount').html(parseInt(ielinknum));
			});
		},2000);

    })

    $('#ImageSize').change(function() {
        size = Number($(this).children('option:selected').val());
        switch (size) {
        case 0:
            var PlayerWH = GetPlayerLayerWidthHeight();
            w = PlayerWH.w;
            h = PlayerWH.h;
            break;
        case 1:
            switch (GetPlayStream()) {
            case '11':
                w = w_1;
                h = h_1;
                break;
            case '12':
                w = w_2;
                h = h_2;
                break;
            }
            break;
        }
        PlayerResize(w, h);

        /***************调整mainpageLayer大小，让它能同时显示视频和左侧工具栏******************/
        width = parseInt(w) + parseInt($('#LeftToolLayer').css('width'));
        if (width > document.documentElement.clientWidth) {
            width += 20;
            width += 'px';
            $('#mainpageLayer').css('width', width);
        } else {
            width = document.documentElement.clientWidth;
            width += 'px';
            $('#mainpageLayer').css('width', width);
            /********************如果视频屏幕小于屏幕大学，调整视频区域让它居中显示*******************/
            if ((size == 1) && ((document.documentElement.clientWidth - parseInt($('#LeftToolLayer').css('width')) - 20) > parseInt(w))) {
                left = parseInt((document.documentElement.clientWidth - parseInt($('#LeftToolLayer').css('width')) - 20 - parseInt(w)) / 2);
                $('#DisplayareaLayer').css("margin-left", left + "px");
            } else $('#DisplayareaLayer').css("margin-left", "5px");
        }
    });

    var cgiurl = "cgi-bin/hi3510/getvdisplayattr.cgi?&-ircutenable=&-awbswitch=&-powerfreq=&-flip=&-mirror=&-scene=&-hue=&-brightness&-saturation&-contrast";
    cgiurl += "&-time=" + new Date().getTime();

    $.get(cgiurl,

    function(data) {
        eval(data);
		$("#SpeedSlider").slider({
            range: "min"
        },
        {
            min: 1
        },
        {
            max: 3
        },
        {
            create: function(event, ui) {
                document.getElementById('SpeedText').innerHTML = 1;
				
            },
            stop: function(event, ui) {
			
			 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
			
				document.getElementById('SpeedText').innerHTML =ui.value;
				g_speed = ui.value;
       
            }
        });

        $("#HueSlider").slider({
            range: "min"
        },
        {
            min: 0
        },
        {
            max: 100
        },
        {
            value: parseInt(hue)
        },
        {
            create: function(event, ui) {
                document.getElementById('HueText').innerHTML = parseInt(hue);
            },
            stop: function(event, ui) {
			
			 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
			
                document.getElementById('HueText').innerHTML = ui.value;
                /*一定要4个同时设置下去不然会报错*/
                cgicmd = '/cgi-bin/hi3510/setvdisplayattr.cgi?';
                cgicmd += '&-hue=' + ui.value;
                cgicmd += '&-brightness=' + $("#BriSlider").slider("option", "value");
                cgicmd += '&-saturation=' + $("#SatSlider").slider("option", "value");
                cgicmd += '&-contrast=' + $("#ConSlider").slider("option", "value");
                $.get(cgicmd);
            }
        });

        $("#BriSlider").slider({
            range: "min"
        },
        {
            min: 0
        },
        {
            max: 100
        },
        {
            value: parseInt(brightness)
        },
        {
            create: function(event, ui) {
                document.getElementById('BriSliderText').innerHTML = parseInt(brightness);
            },
            stop: function(event, ui) {
			
			 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
			
                document.getElementById('BriSliderText').innerHTML = ui.value;
                /*一定要4个同时设置下去不然会报错*/
                cgicmd = '/cgi-bin/hi3510/setvdisplayattr.cgi?';
                cgicmd += '&-hue=' + $("#HueSlider").slider("option", "value");
                cgicmd += '&-brightness=' + ui.value;
                cgicmd += '&-saturation=' + $("#SatSlider").slider("option", "value");
                cgicmd += '&-contrast=' + $("#ConSlider").slider("option", "value");
                $.get(cgicmd);
            }
        });

        $("#ConSlider").slider({
            range: "min"
        },
        {
            min: 0
        },
        {
            max: 100
        },
        {
            value: parseInt(contrast)
        },
        {
            create: function(event, ui) {
                document.getElementById('ConSliderText').innerHTML = parseInt(contrast);
            },
            stop: function(event, ui) {
			
			 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
			
                document.getElementById('ConSliderText').innerHTML = ui.value;
                /*一定要4个同时设置下去不然会报错*/
                cgicmd = '/cgi-bin/hi3510/setvdisplayattr.cgi?';
                cgicmd += '&-hue=' + $("#HueSlider").slider("option", "value");
                cgicmd += '&-brightness=' + $("#BriSlider").slider("option", "value");
                cgicmd += '&-saturation=' + $("#SatSlider").slider("option", "value");
                cgicmd += '&-contrast=' + ui.value;
                $.get(cgicmd);
            }
        });
        $("#SatSlider").slider({
            range: "min"
        },
        {
            min: 0
        },
        {
            max: 100
        },
        {
            value: parseInt(saturation)
        },
        {
            create: function(event, ui) {
                document.getElementById('SatSliderText').innerHTML = parseInt(saturation);
            },
            stop: function(event, ui) {
			
			 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
			
                document.getElementById('SatSliderText').innerHTML = ui.value;
                /*一定要4个同时设置下去不然会报错*/
                cgicmd = '/cgi-bin/hi3510/setvdisplayattr.cgi?';
                cgicmd += '&-hue=' + $("#HueSlider").slider("option", "value");
                cgicmd += '&-brightness=' + $("#BriSlider").slider("option", "value");
                cgicmd += '&-saturation=' + ui.value;
                cgicmd += '&-contrast=' + $("#ConSlider").slider("option", "value");
                $.get(cgicmd);
            }
        });

        if (flip == "off") $('input:radio[name="flipgrp"]').get(1).checked = true;
        else $('input:radio[name="flipgrp"]').get(0).checked = true;

        if (mirror == "off") $('input:radio[name="mirrorgrp"]').get(1).checked = true;
        else $('input:radio[name="mirrorgrp"]').get(0).checked = true;

        if (powerfreq == "60") $('input:radio[name="Powerfreqgrp"]').get(1).checked = true;
        else $('input:radio[name="Powerfreqgrp"]').get(0).checked = true;

        if (scene == "indoor") $("#SceneSelect option[value=1]").attr("selected", true);
        else if (scene == "outdoor") $("#SceneSelect option[value=2]").attr("selected", true);
        else $("#SceneSelect option[value=0]").attr("selected", true);

    }

    );

    $('#flipOn, #flipOff, #mirrorOn, #mirrorOff, #powerfreq50, #powerfreq60').click(function() {

	 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
	
	
        cgicmd = '/cgi-bin/hi3510/setvdisplayattr.cgi?'

        if ($('input:radio[name="flipgrp"]:checked').val() == "on") cgicmd += '&-flip=on';
        else cgicmd += '&-flip=off';

        if ($('input:radio[name="mirrorgrp"]:checked').val() == "on") cgicmd += '&-mirror=on';
        else cgicmd += '&-mirror=off';

        if ($('input:radio[name="Powerfreqgrp"]:checked').val() == "50") cgicmd += '&-powerfreq=50';
        else cgicmd += '&-powerfreq=60';

        $.get(cgicmd);
    });

    /*************云台控制************/
    $("#PtzTop, #PtzLeft, #PtzRight, #PtzDown").mouseup(function() {
	
	 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
	
        //speed = 31;
		speed = g_speed;
        cgicmd = '/cgi-bin/hi3510/ptzstop.cgi?&-chn=0&-speed=' + speed;
        $.get(cgicmd);
    })

    $("#PtzTop, #PtzLeft, #PtzRight, #PtzDown").mousedown(function() {

	 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
	
        //speed = 31;
		speed = g_speed;

        switch ($(this).attr('id')) {
        case "PtzTop":
            cgicmd = '/cgi-bin/hi3510/ptzup.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzLeft":
            cgicmd = '/cgi-bin/hi3510/ptzleft.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzRight":
            cgicmd = '/cgi-bin/hi3510/ptzright.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzDown":
            cgicmd = '/cgi-bin/hi3510/ptzdown.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzStop":
            cgicmd = '/cgi-bin/hi3510/ptzstop.cgi?&-chn=0&-speed=' + speed;
            break;
        default:
            return true;
            break;
        }
        $.get(cgicmd);

    });

    /*************************主页码流或控件重新选择*****************************/
    $('#StreamSelect1').change(function() {

        SetPlayStream($("#StreamSelect1").children('option:selected').val());
        StreamType = parseInt($("#StreamSelect1").children('option:selected').val());
        RePlay(GetPlayerLayerWidthHeight().w, GetPlayerLayerWidthHeight().h);

        /***************调整mainpageLayer大小，让它能同时显示视频和左侧工具栏******************/
        var VideoWH = GetVideoWidthHeight();
        width = parseInt(VideoWH.w) + parseInt($('#LeftToolLayer').css('width'));

        $("#DisplayareaLayer").css("margin-left", "5px");
        if (width > document.documentElement.clientWidth) {
            width += 'px';
            $('#mainpageLayer').css('width', width);
        }
		
		$("#RecordSwitch").css("display", "inline-block");
		$("#RecordIngSwitch").css("display", "none");
		$("#VolOnSwitch").css("display", "none");
		$("#VolOffSwitch").css("display", "inline-block");
		$("#MicroOnSwitch").css("display", "none");
		$("#MicroOffSwitch").css("display", "inline-block");
		
        $("#ImageSize").get(0).selectedIndex = 0;
    })
    
    /**********************************门口机重新选择*************************************/
		$('#DoorSelect1').change(function() {
			var url2 = "/cgi-bin/hi3510/doorConnect.cgi?";
			url2 += ("&-reopen=" + $("#DoorSelect1").children('option:selected').val());
			$.get(url2,function(data1) {eval(data);});
			/***************调整mainpageLayer大小，让它能同时显示视频和左侧工具栏******************/		
		})

    $('#DefaultBtn, #UpdateBtn').click(function() {
	
	 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
	
        /***********************恢复默认值*****************************/
        if ($(this).attr('id') == "DefaultBtn") {
            var cgiurl = 'cgi-bin/hi3510/setvdisplayattr.cgi?&-setcscdefault&-setdirdefault';
            $.get(cgiurl);
        }

        /***********************重新获取参数值*****************************/
        cgiurl = "cgi-bin/hi3510/getvdisplayattr.cgi?&-ircutenable=&-awbswitch=&-powerfreq=&-flip=&-mirror=&-scene=&-hue=&-brightness&-saturation&-contrast";
        cgiurl += "&-time=" + new Date().getTime();

        $.get(cgiurl,
        function(data) {
            eval(data);
			$('#SpeedText').html(1);
            $('#HueText').html(parseInt(hue));
            $('#BriSliderText').html(parseInt(brightness));
            $('#SatSliderText').html(parseInt(saturation));
            $('#ConSliderText').html(parseInt(contrast));
			
			$("#SpeedSlider").slider("option", "value", 1);
            $("#HueSlider").slider("option", "value", parseInt(hue));
            $("#BriSlider").slider("option", "value", parseInt(brightness));
            $("#SatSlider").slider("option", "value", parseInt(saturation));
            $("#ConSlider").slider("option", "value", parseInt(contrast));

            if (flip == "off") $('input:radio[name="flipgrp"]').get(1).checked = true;
            else $('input:radio[name="flipgrp"]').get(0).checked = true;

            if (mirror == "off") $('input:radio[name="mirrorgrp"]').get(1).checked = true;
            else $('input:radio[name="mirrorgrp"]').get(0).checked = true;

            if (powerfreq == "60") $('input:radio[name="Powerfreqgrp"]').get(1).checked = true;
            else $('input:radio[name="Powerfreqgrp"]').get(0).checked = true;

            if (scene == "indoor") $("#SceneSelect option[value=1]").attr("selected", true);
            else if (scene == "outdoor") $("#SceneSelect option[value=2]").attr("selected", true);
            else $("#SceneSelect option[value=0]").attr("selected", true);

        });
    })

    $('#AutoLogin').click(function() {
        if ($(this).prop("checked") == true) {
            SetAutoLogin(1)
        } else {
            SetAutoLogin(0)
        }

    })

    /****************限定数字输入*********************/
    $("#PTZPosInput").keypress(function(event) {
        if (((event.which >= 48) && (event.which <= 57)) || event.which == 8 || event.which == 0) return event.which;
        else return false;
    })

    $('#GotoPoint, #SetPoint, #ClearPoint').click(function() {

	 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
	
        point = parseInt($('#PTZPosInput').val());

        switch ($(this).attr('id')) {
        case "GotoPoint":
            cgicmd = '/cgi-bin/hi3510/ptzgotopoint.cgi?&-chn=0&-point=' + point;
            break;
        case "SetPoint":
            cgicmd = '/cgi-bin/hi3510/ptzsetpoint.cgi?&-chn=0&-point=' + point;
            break;
        case "ClearPoint":
            cgicmd = '/cgi-bin/hi3510/ptzclearpoint.cgi?&-chn=0&-point=' + point;
            break;
        }

        $.get(cgicmd);

    })

    $('#RecordSwitch, #RecordIngSwitch').click(function() {
	 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
	
	
		ret = Record();
       	
        if (($(this).attr("id") == "RecordSwitch") && (ret == 1)) {
		$("#RecordSwitch").css("display", "none");
		$("#RecordIngSwitch").css("display", "inline-block");
        } else {
		 	$("#RecordSwitch").css("display", "inline-block");
		$("#RecordIngSwitch").css("display", "none");
        }
    })

    $('#CaptureSwitch').click(function() {
	
	 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
	
        Snap();
    });

    $('#PlaybackSwitch').click(function() {
	
	 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
        PlayBack();
    });

    $('#MicroOnSwitch, #MicroOffSwitch').click(function() {		
	
	if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
	
        if ($(this).attr("id") == "MicroOnSwitch") {
			ret = StartTalk(1);
			if(ret == true){
				$(this).css("display", "none");
				$("#MicroOffSwitch").css("display", "inline-block");
			}
            
        } else {
			 ret = StartTalk(0);
			 if(ret == true){
			$(this).css("display", "none");
			$("#MicroOnSwitch").css("display", "inline-block");
			 }
        }
    });
    $('#VolOnSwitch, #VolOffSwitch').click(function() {
		
		if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
		
        if ($(this).attr("id") == "VolOffSwitch") {
			 ret = SetMute(0);
			 if(ret == true){
				 $(this).css("display", "none");
				$("#VolOnSwitch").css("display", "inline-block");
			 }
        } else {
			ret = SetMute(1);
			 if(ret == true){
				$(this).css("display", "none");
				$("#VolOffSwitch").css("display", "inline-block");
			 }
        }
    })

		
	 $('#UnlockSwitch').click(function() {		
		var getResult;
		cgiurl = '/cgi-bin/hi3510/getunlockpwd.cgi?';
		cgiurl += "&-time=" + new Date().getTime();
		$.get(cgiurl,function(data) {
				eval(data);
				getResult = result;	
		});
		var pwd = showModalDialog("unlock.html",null,"dialogHeight:100px;dialogWidth:400px;status:no;help:no;resizable:no; edge: raised; center: yes; ");
		if( getResult == pwd){
			cgiurl = '/cgi-bin/hi3510/doorUnlock.cgi?';
			cgiurl += "&-time=" + new Date().getTime();
			$.get(cgiurl,function(data) {
				eval(data);
//					delCookie("unlockpsw");
//					setCookie("unlockpsw", Base64.encode("pwd"), 365);
					alert(UnLockSuccessMsg);
			});
		}else{
			alert(UnLockFaileMsg);
		}
   });

    $("#LanSelect").change(function() {

        selectIndex = $("#LanSelect").children('option:selected').val();

        switch (selectIndex) {
        case "0":
            setCookie("language", "en", 365);
            break;
        case "1":
            setCookie("language", "zh-cn", 365);
            break;
		 		case "2":
            setCookie("language", "tw", 365);
            break;
        case "3":
            setCookie("language", "pt", 365);
            break;
        case "4":
            setCookie("language", "es", 365);
            break;  
        case "5":
            setCookie("language", "ru", 365);
            break;       
        default:
            setCookie("language", "en", 365);
            break;
        }
        window.location.reload();

    })

    /******************登录确认输入*************************/
    $("#LoginLayer").keydown(function(event) {
        if (event.which == 13) //Enter
        $('#Login').click();

    })

    CheckAuth = function() {
        var authLevel = getCookie("authLevel");
        if (authLevel != "255") {
            return false;
        }
        return true;
    }
  /******************场景模式选择*************************/
    $("#SceneSelect").change(function() {
	
	 if (!CheckAuth()) {
            alert(NoAuthErrorMsgSpan);
            return true;
        }
	
        cgiurl = '/cgi-bin/hi3510/setvdisplayattr.cgi?';
        if ($("#SceneSelect option:selected").val() == 1) cgiurl += '&-scene=' + "indoor"
        else if ($("#SceneSelect option:selected").val() == 2) cgiurl += '&-scene=' + "outdoor"
        else cgiurl += '&-scene=' + "auto";
			$.get(cgiurl);
    })

})
