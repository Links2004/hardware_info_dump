// JavaScript Document
$(function() {

    var MainStreamBitRateMax = 0;
    var MainStreamBitRateMin = 0;

    $(document).ready(function(e) {
		LoadLanguage();
		loadMainStream();
		//loadSubStream();
		loadMobileStream();
		setTimeout(function() {
            $("body").css("display", "block");
        },
        100);
    });

    function loadMainStream() {

        /*****************分辨率*******************/
        /*if ((sensortype == "ar0130_960P") || (sensortype == "ar0130_960p") || (sensortype == "ar0130")) {
            $("#MainStreamSizeSelect").prop("disabled", false);
            $("#MainStreamSizeSelect option").each(function(index, element) {
                if (($(this).val() != "960") && ($(this).val() != "720")) {
                    $(this).remove();
                }
            });
        }*/

        /***********遍历列表,查找对应的分辨率**************/
        var haveRes = 0;
        $("#MainStreamSizeSelect option").each(function(index, element) {
            if ($(this).text() == (width_1 + "x" + height_1)) {
                haveRes = 1;
                $(this).attr("selected", true);
            }
        });
        if (haveRes == 0) //如果当前没有这个分辨率则插进去并选中它
       		$("#MainStreamSizeSelect").append("<option selected=\"selected\">" + width_1 + "x" + height_1 + "</option>");

        /*****************比特率*******************/
        $("#MainStreamBitSelect option").each(function(index, element) {
            if ($(this).val() == bps_1) {
                $("#MainStreamBitSelect option[value=" + bps_1 + "]").attr("selected", true);
                return false;
            }
            if (index == $("#MainStreamBitSelect option").length - 1) {
                $("#MainStreamBitSelect option:last").attr("selected", true);
                $("#MainStreamUserDefineInput").css('display', "inline");
                $("#MainStreamUserDefineInput").val(bps_1);
                $("#MainStreamBitSelect option:last").val(bps_1);
            }
        });

        /*****************帧率*******************/
        if (vinorm == 1) var fpsMax = 30; //N
        else var fpsMax = 25; //P
        for (i = 1; i <= fpsMax; i++) $("#MainStreamFpsSelect").append('<option value="' + i + '">' + i + '</option>');
        $("#MainStreamFpsSelect option[value=" + fps_1 + "]").attr("selected", true);

        /*****************码率控制 *******************/
        $("#MainStreamBitRateCtrSelect option[value=" + brmode_1 + "]").attr("selected", true);
        if (brmode_1 == 4) {
            $("#MainStreamFIXQPLevel option[value=" + fixqplevel_1 + "]").prop("selected", true);
        }

        $("#MainStreamBitRateCtrSelect").change();

        if (vinorm == 0) $("input[type=radio][name=ModeGrp]:eq(0)").prop("checked", true);
        else $("input[type=radio][name=ModeGrp]:eq(1)").prop("checked", true);

        /*****************GOP*******************/
        $("#MainStreamGopInput").val(gop_1);
        $("#MainStreamGopInputTips").html(GopInputTipsSpan + fps_1);
		
		/*****************Audio*******************/
		$("input[name=MainStreamAudioGrp][value=" + bIsGetAudio_1 + "]").prop("checked", true);
    }

    function loadSubStream() {
        /*pyu:*/
        /*****************分辨率*******************/
    }

    function loadMobileStream() {
        /* pyu: */
        /*****************分辨率*******************/
        $("#MobileStreamSizeSelect").children("option[value=" + height_2 + "]").attr("selected", true);

        /*****************图像质量*******************/
        $("#MobileStreamImageQuality option[value=" + piclevel_2 + "]").attr("selected", true);
    }

    function submitMainStream() {
        /***************比特率***************************/
        $("#Form2Bps").val($("#MainStreamBitSelect option:selected").val());
        $("#Form2Bps").attr("name", "-bps");

        /***************帧率***************************/
        $("#Form2Fps").val($("#MainStreamFpsSelect option:selected").val());
        $("#Form2Fps").attr("name", "-fps");

        /*****************码率控制 *******************/
        $("#Form2BrMode").val($("#MainStreamBitRateCtrSelect option:selected").val());
        $("#Form2BrMode").attr("name", "-brmode");

        if ($("#MainStreamBitRateCtrSelect option:selected").val() == 4) { //fixqp
            $("#Form2FixQpLevel").removeAttr("disabled");
            $("#Form2FixQpLevel").attr("name", "-fixqplevel");
            $("#Form2FixQpLevel").val($("#MainStreamFIXQPLevel option:selected").val());
        }

        /*****************GOP *******************/
        $("#Form2Gop").val($("#MainStreamGopInput").val());
        $("#Form2Gop").attr("name", "-gop");

        /**************通道号*********************/
        $("#Form2Chn").val(11);
        $("#Form2Chn").attr("name", "-chn");

		/*****************Audio*******************/
        $("#Form2MainStreamAudioChn").val(11);
        $("#Form2MainStreamAudioChn").attr("name", "-chn");
		
        $("#Form2MainStreamIsGetAudio").val($("input[name=MainStreamAudioGrp]:checked").val());
        $("#Form2MainStreamIsGetAudio").attr("name", "-isgetaudio");


        return true;
    }

    function submitAdvanceAttr() {

        var change = 0;
        /**************分辨率,主要针对ar0130的960P和720P*********************/
        if ($("#MainStreamSizeSelect option:selected").val() != height_1) {
            $("#Form2VideoMode").removeAttr("disabled");

            $("#Form2VideoMode").attr("name", "-videomode");
            $("#Form2SetBoardCmd").attr("name", "cmd");
            $("#Form2SetBoardCmd").val("bconf");

            $("#Form2Board").attr("name", "-board");
            $("#Form2Sensor").attr("name", "-sensor");

            var cgiurl = "http://" + window.document.location.host + "/cgi-bin/bconf.cgi?cmd=bconf.cgi&-action=set";
            cgiurl += "&-board=" + boardtype;
            cgiurl += '&-time="' + new Date().getTime() + '"';
            if ($("#MainStreamSizeSelect option:selected").val() == 720) {
                $("#Form2VideoMode").val(29);
                $("#Form2Board").val(boardtype);
                $("#Form2Sensor").val("ar0130");
                cgiurl += "&-sensor=" + "ar0130";
            } else if ($("#MainStreamSizeSelect option:selected").val() == 960) {
                $("#Form2VideoMode").val(32);
                $("#Form2Board").val(boardtype);
                $("#Form2Sensor").val("ar0130_960P");
                cgiurl += "&-sensor=" + "ar0130_960P";
            }

            change = 1;

            $.ajax({
                url: cgiurl,
                type: "GET",
                dataType: "text",
                timeout: 3000,
                error: function(data) {
                    alert("set sensor error");
                    change = 0;
                },
                success: function(data) {},
                async: false
            })

        }

        if ((vinorm == 0 && $("input[type=radio][name=ModeGrp]:checked").val() != "P") || (vinorm == 1 && $("input[type=radio][name=ModeGrp]:checked").val() != "N")) {
            $("#Form2ViNorm").removeAttr("disabled");
            $("#Form2ViNorm").attr("name", "-vinorm");
            $("#Form2ViNorm").val($("input[type=radio][name=ModeGrp]:checked").val());
            change = 1;
        }

        if (change == 1) {

            $("#Form2SetViAttrCmd").removeAttr("disabled");
            $("#Form2SetViAttrCmd").attr("name", "cmd");
            $("#Form2SetViAttrCmd").val("setviattr");

            $("body div:first").css("display", "none");
            $("#MsgLayer").css("display", "block");
            $("#Msg").html(RebootWaitMsg);
            setInterval("progress()", 600); //1min
        }

        return true;
    }

    function submitSubStream() {
        /***************比特率***************************/
        $("#Form2SubBps").val($("#SubStreamBitSelect option:selected").val());
        $("#Form2SubBps").attr("name", "-bps");

        /***************帧率***************************/
        $("#Form2SubFps").val($("#SubStreamFpsSelect option:selected").val());
        $("#Form2SubFps").attr("name", "-fps");

        /*****************码率控制 *******************/
        $("#Form2SubBrMode").val($("#SubStreamBitRateCtrSelect option:selected").val());
        $("#Form2SubBrMode").attr("name", "-brmode");
        if ($("#SubStreamBitRateCtrSelect option:selected").val() == 4) { //fixqp
            $("#Form2SubFixQpLevel").removeAttr("disabled");
            $("#Form2SubFixQpLevel").attr("name", "-fixqplevel");
            $("#Form2SubFixQpLevel").val($("#SubStreamFIXQPLevel option:selected").val());
        }

        /*****************GOP *******************/
        $("#Form2SubGop").val($("#SubStreamGopInput").val());
        $("#Form2SubGop").attr("name", "-gop");

        /**************通道号*********************/
        /* pyu:
        $("#Form2SubChn").val(12);
        $("#Form2SubChn").attr("name", "-chn");
        */
		
		/*****************Audio*******************/
		/*pyu:
        $("#Form2SubStreamAudioChn").val(12);
        $("#Form2SubStreamAudioChn").attr("name", "-chn");
		
        $("#Form2SubStreamIsGetAudio").val($("input[name=SubStreamAudioGrp]:checked").val());
        $("#Form2SubStreamIsGetAudio").attr("name", "-isgetaudio");
        */
        return true;
    }

    function submitMobileStream() {
        /*****************图像质量*******************/
        $("#Form2MobileImageGrade").val($("#MobileStreamImageQuality option:selected").val());
        $("#Form2MobileImageGrade").attr("name", "-piclevel");

        /************** pyu: 通道号*********************/
        $("#Form2MobileChn").val(12);
        $("#Form2MobileChn").attr("name", "-chn");

        return true;
    }

    $("#apply").click(function() {
        var form1 = document.form1;
        var form = document.form2;
        form.cururl.value = document.URL;

		submitMainStream();
		//submitSubStream();
		submitMobileStream();
		submitAdvanceAttr();

        form.action = "cgi-bin/hi3510/param.cgi";
        form.submit();
    })

    $("#cancel").click(function() {
        window.location.reload(true);
    })

    $('#SubStreamBitSelect').change(function() {
        if ($(this).get(0).selectedIndex == $(this).children("option").length - 1) {
            $('#SubStreamUserDefineInput').css('display', 'inline');
            if ($('#SubStreamUserDefineInput').val().length == 0) { //如果原来没有值的话，则给一个最小值
                $('#SubStreamUserDefineInput').val($("#SubStreamBitSelect").children("option:first").val());
            }
            $('#SubStreamBitSelect option:last').val($('#SubStreamUserDefineInput').val());
        } else {
            $('#SubStreamUserDefineInput').css('display', 'none');
        }
    })

    $('#MainStreamBitSelect').change(function() {
        if ($(this).get(0).selectedIndex == $(this).children("option").length - 1) {
            $('#MainStreamUserDefineInput').css('display', 'inline');
            if ($('#MainStreamUserDefineInput').val().length == 0) { //如果原来没有值的话，则给一个最小值
                $('#MainStreamUserDefineInput').val($("#MainStreamBitSelect").children("option:first").val());
            }
            $('#MainStreamUserDefineInput option:last').val($('#MainStreamUserDefineInput').val());
        } else $('#MainStreamUserDefineInput').css('display', 'none');
    })

    /****************码率值限定数字输入*********************/
    $("#SubStreamUserDefineInput, #MainStreamUserDefineInput").keypress(function(event) {
        if (((event.which >= 48) && (event.which <= 57)) || event.which == 8 || event.which == 0) return event.which;
        else return false;
    })

    /****************码率值范围判断*********************/
    $("#SubStreamUserDefineInput, #MainStreamUserDefineInput").blur(function() {

        if ($(this).attr('id') == "SubStreamUserDefineInput") {
            var obj = "#SubStreamBitSelect";
        } else if ($(this).attr('id') == "MainStreamUserDefineInput") {
            var obj = "#MainStreamBitSelect";
        } else {
            return true;
        }

        val = $(this).val();
        if (isNaN(val) || ($(this).length == 0)) $(this).val($(obj).children('option:first').val());

        /******************默认下拉框的第一个数据为最小值，倒数第二个为最大值******************/
        var MaxVal = parseInt($(obj).children("option:eq(" + ($(obj).children("option").length - 2) + ")").val());
        var MinVal = parseInt($(obj).children('option:first').val());

        if (parseInt($(this).val()) < MinVal) {
            $(this).val(MinVal);
        } else if (parseInt($(this).val()) > MaxVal) {
            $(this).val(MaxVal);
        }

        /*将输入框的值给下拉框最后一项，方便提交时的取值*/
        $(obj).children("option:last").val($(this).val());
    })

    $("#progressbar").progressbar({
        value: 0
    });

    progress = function() {

        var val = $("#progressbar").progressbar("value") || 0;

        $("#progressbar").progressbar("value", val + 1);

        if (val >= 100) window.location.reload(true);

    }

    $("input[type=radio][name=ModeGrp]").click(function() {
        if (((vinorm == 0) && $(this).val() != "P") || ((vinorm == 1) && $(this).val() != "N")) $("#NormChangeRebootMsgLabel").html(NormChangeRebootMsg);
        else $("#NormChangeRebootMsgLabel").html("");

        if ($(this).val() == "P") {
            if ($("#MainStreamFpsSelect option:selected").val() > 25) $("#MainStreamFpsSelect option[value=25]").prop("selected", true);
            if ($("#SubStreamFpsSelect option:selected").val() > 25) $("#SubStreamFpsSelect option[value=25]").prop("selected", true);
        }

    })

    $("#MainStreamSizeSelect").change(function() {
        if ($("#MainStreamSizeSelect option:selected").val() != height_1) $("#ViewSizeChangeRebootMsgLabel").html(ViewSizeChangeRebootMsg);
        else $("#ViewSizeChangeRebootMsgLabel").html("");
    })

    $("#MainStreamFpsSelect, #SubStreamFpsSelect").change(function() {
        if ((vinorm == 0) && ($(this).children("option:selected").val() > 25)) $(this).children("option[value=25]").prop("selected", true);

        /*I帧间隔必须大于等于帧率*/
        if ($(this).attr("id") == "MainStreamFpsSelect") {
            $("#MainStreamGopInputTips").html(GopInputTipsSpan + $(this).children("option:selected").val());
            if (Number($("#MainStreamGopInput").val()) < Number($(this).children("option:selected").val())) {
                $("#MainStreamGopInput").val($(this).children("option:selected").val());
            }
        }

        /*I帧间隔必须大于等于帧率*/
        if ($(this).attr("id") == "SubStreamFpsSelect") {
            $("#SubStreamGopInputTips").html(GopInputTipsSpan + $(this).children("option:selected").val());
            if (Number($("#SubStreamGopInput").val()) < Number($(this).children("option:selected").val())) {
                $("#SubStreamGopInput").val($(this).children("option:selected").val());
            }
        }

    })

    $("#MainStreamBitRateCtrSelect").change(function() {
        if ($(this).children("option:selected").val() == 4) { //FIXQP
            $("#MainStreamBitSelect").attr("disabled", "disabled");
            $("#MainStreamFIXQPLevel").css("display", "inline");
        } else {
            $("#MainStreamBitSelect").removeAttr("disabled");
            $("#MainStreamFIXQPLevel").css("display", "none");
        }
    })

    $("#SubStreamBitRateCtrSelect").change(function() {
        if ($(this).children("option:selected").val() == 4) { //FIXQP
            $("#SubStreamBitSelect").attr("disabled", "disabled");
            $("#SubStreamFIXQPLevel").css("display", "inline");
        } else {
            $("#SubStreamBitSelect").removeAttr("disabled");
            $("#SubStreamFIXQPLevel").css("display", "none");
        }
    })
	
	/********************************检查GOP值是否合法*******************************/
    $("#MainStreamGopInput").blur(function() {
        if (Number($(this).val()) < Number($("#MainStreamFpsSelect option:selected").val())) {
            $(this).val($("#MainStreamFpsSelect option:selected").val());
        }
    })
	
	/********************************检查GOP值是否合法*******************************/
    $("#SubStreamGopInput").blur(function() {
        if (Number($(this).val()) < Number($("#SubStreamFpsSelect option:selected").val())) {
            $(this).val($("#SubStreamFpsSelect option:selected").val());
        }
    })
	
	$("#MainStreamGopInput, #SubStreamGopInput").keypress(function(event){
		  if (((event.which >= 48) && (event.which <= 57)) || event.which == 8 || event.which == 0) return event.which;
        else return false;
		})

})
