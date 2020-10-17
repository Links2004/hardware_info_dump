﻿// JavaScript Document
$(function() {

    var progressbar = $("#progressbar");
//    progressLabel = $(".progress-label");

    progressbar.progressbar({
        value: 0,
        change: function() {
    //        progressLabel.text(progressbar.progressbar("value") + "%");
        }
    });

    $(document).ready(function(e) {
        LoadLanguage();
			
		setTimeout(function(){$("body").css("display", "block");}, 100);
    });

    var intval = 0;

    progress = function() {

        var val = $("#progressbar").progressbar("value") || 0;

        $("#progressbar").progressbar("value", val + 1);

        if (val >= 100) window.location.reload(true);

    }

    $("#Reboot").click(function() {
        if (confirm(RebootMsg) == true) {

            $("#ContentLayer").css("display", "none");
            $("#MsgLayer").css("display", "block");
            $("#Msg").html(RebootWaitMsg);

            setInterval("progress()", 600); //1min
            $.get("cgi-bin/hi3510/reboot.cgi");
        } else {
            return false;
        }
    })

    $("#Factorydefault").click(function() {

        if (confirm(ResetMsg) == true) {

            $("#ContentLayer").css("display", "none");
            $("#MsgLayer").css("display", "block");
            $("#Msg").html(RebootWaitMsg);

			 if ((sensortype == "ar0130_960P") || (sensortype == "ar0130_960p") || (sensortype == "ar0130")) {
				var cgiurl = "http://" + window.document.location.host + "/cgi-bin/bconf.cgi?cmd=bconf.cgi&-action=set";
				cgiurl += "&-board=" + boardtype;
				cgiurl += "&-sensor=" + "ar0130_960P";
				cgiurl += '&-time="' + new Date().getTime() + '"';
				
            	$.ajax({
					url: cgiurl,
					type: "GET",
					dataType: "text",
					timeout: 3000,
					error: function(data) {
						alert("set sensor error");
					},
					success: function(data) {},
					async: false
				})
				
			}
			
			
            setInterval("progress()", 900); //1.5min
            $.get("cgi-bin/hi3510/sysreset.cgi");
        } else {
            return false;
        }
    })

    $("#SaveToFile").click(function() {
        window.parent.parent.location.href = "cgi-bin/hi3510/backup.cgi";
    })

    $("#RestoreOKSpan").click(function() {

        if (document.form4.setting_file.value == "") {
            alert(InputFileMsg);
            return false;
        }

        if (confirm(UploadMsg) == true) {
            $("#ContentLayer").css("display", "none");
            $("#MsgLayer").css("display", "block");
            $("#Msg").html(RebootWaitMsg);

            setInterval("progress()", 900); //1.5min
            form = document.form4;
            form.action = "cgi-bin/hi3510/restore.cgi";
            form.submit();
            return true;
        } else {
            return false;
        }

    })

    $("#Restore").change(function() {
        $("#RestoreInputText").val($(this).val());
    })

    $("#UpgradeOKSpan").click(function() {

        if (document.form5.setting_file.value == "") {
            alert(InputFileMsg);
            return false;
        }

        if (confirm(UpgradeMsg) == true) {
            $("#ContentLayer").css("display", "none");
            $("#MsgLayer").css("display", "block");
            $("#Msg").html(UpgradeWaitMsg);

            setInterval("progress()", 2100); //3.5min=3.5*60*1000/100
            form = document.form5;
            form.action = "cgi-bin/hi3510/upgrade.cgi";
            form.submit();

            return true;
        } else {
            return false;
        }

    })

    $("#Upgrade").change(function() {
        $("#UpgradeInputText").val($(this).val());
    })

})