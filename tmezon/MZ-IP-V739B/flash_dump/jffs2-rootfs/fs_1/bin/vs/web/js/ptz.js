// JavaScript Document
$(function() {
/*多语言加载*/
$(document).ready(function(e) {	
  
  	/*找出对应的网页字句*/
    pathname = window.location.pathname;
    htmlname = pathname.substr(pathname.lastIndexOf("/") + 1, pathname.length) ;

	if(htmlname.split('.')[0] == "ptz"){//只有在PTZ页面才加载
	   LoadLanguage();    
	   ptz_on_load();
		setTimeout(function(){$("body").css("display", "block");}, 100);
		
	}
});

	  /*************云台控制************/
    $("#PtzLeftTop, #PtzTop, #PtzRightTop,  #PtzLeft,#PtzStop,  #PtzRight, #PtzLeftDown, #PtzDown, #PtzRightDown, #PtzFocusAdd, #PtzFocusSub, #PtzZoomAdd, #PtzZoomSub").mouseup(function() {
        speed = 31;
        cgicmd = '/cgi-bin/hi3510/ptzstop.cgi?&-chn=0&-speed=' + speed;
        $.get(cgicmd);
    })

    $("div#PtzCtrLayer a").mousedown(function() {

        speed = 31;

        switch ($(this).attr('id')) {
		case "PtzLeftTop":	
		cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=upleft&-speed=' + speed;
		break;
        case "PtzTop":
            cgicmd = '/cgi-bin/hi3510/ptzup.cgi?&-chn=0&-speed=' + speed;
            break;
		case "PtzRightTop":
		cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=upright&-speed=' + speed;
		
		break;
        case "PtzLeft":
            cgicmd = '/cgi-bin/hi3510/ptzleft.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzRight":
            cgicmd = '/cgi-bin/hi3510/ptzright.cgi?&-chn=0&-speed=' + speed;
            break;
		case "PtzLeftDown":
		
		cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=downleft&-speed=' + speed;
		break;
		case "PtzRightDown":	
        	cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=downright&-speed=' + speed;
        	break;
        case "PtzDown":
            cgicmd = '/cgi-bin/hi3510/ptzdown.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzStop":
            cgicmd = '/cgi-bin/hi3510/ptzstop.cgi?&-chn=0&-speed=' + speed;
            break;
		  case "PtzLRScan":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=hscan&-speed=' + speed;
            break;	
		 case "PtzUPScan":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=vscan&-speed=' + speed;
            break;		
		case "PtzFocusAdd":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=foucesadd&-speed=' + speed;
            break;	
		case "PtzFocusSub":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=foucessub&-speed=' + speed;
            break;			
		case "PtzZoomAdd":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=zoomadd&-speed=' + speed;
            break;	
		case "PtzZoomSub":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=zoomsub&-speed=' + speed;
            break;			
        default:
            return true;
            break;
        }
        $.get(cgicmd);

    });
	
	   /****************限定数字输入*********************/
    $("#PTZPosInput").keypress(function(event) {
        if (((event.which >= 48) && (event.which <= 57)) || event.which == 8 || event.which == 0) return event.which;
        else return false;
    })

    $('#GotoPoint, #SetPoint, #ClearPoint').click(function() {

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
	
	 ptz_on_load = function()
{
	if( ptztype == 0){
		/*协议*/
		
		$("div#Rs485Layer").css("display", "block");
		$("div#MontorLayer").css("display", "none");
		
		$("#protocol option[value="+protocol+"]").attr("selected", true); 
		 
		/*串口属性*/
		$("#baudrate option[value="+baud+"]").attr("selected", true); 
		$("#databit option[value="+databits+"]").attr("selected", true); 
		$("#stopbit option[value="+stopbits+"]").attr("selected", true); 
		$("#parity option[value="+parity+"]").attr("selected", true); 
	
		/*地址码*/
		$("#address_h option[value="+(parseInt(address/100))+"]").attr("selected", true); 
		$("#address_m option[value="+(parseInt((address/10)%10))+"]").attr("selected", true); 
		$("#address_l option[value="+(parseInt((address%100)%10))+"]").attr("selected", true); 
	}
	else
	{
			$("div#Rs485Layer").css("display", "none");
			$("div#MontorLayer").css("display", "block");
			
			$("input[name=FlipGrp][value="  + flip + "]").prop("checked", true);
			$("input[name=MirrorGrp][value="  + mirror + "]").prop("checked", true);
	}
}

 do_submit = function()
{
	var form = document.form2;
	
		if( ptztype == 0){
	/*串口属性*/
	$("#Form2Baud").attr("name", "-baudrate");
	$("#Form2Baud").attr("value",  $("#baudrate").val());

	$("#Form2DataBit").attr("name", "-databit");
	$("#Form2DataBit").attr("value",  $("#databit").val());
	
	$("#Form2StopBit").attr("name", "-stopbit");
	$("#Form2StopBit").attr("value", $("#stopbit").val());
		
	$("#Form2Parity").attr("name", "-parity");
	$("#Form2Parity").attr("value", $("#parity").val());
	
	/*地址码*/
	value =  parseInt($("#address_h").val())*100 + parseInt($("#address_m").val())*10 + parseInt($("#address_l").val());
	
	if( value > 255)
	{
		alert(addressErrorMsg);
		return false;
	}
	$("#Form2Address").attr("name", "-address");
	$("#Form2Address").attr("value", value);
	
	/*协议*/
	$("#Form2Protocol").attr("name", "-protocol");
	$("#Form2Protocol").attr("value",  $("#protocol").val());
	
	$("#Form2Flip").attr("disabled", "disabled");
	$("#Form2Mirror").attr("disabled", "disabled");
	}
	else
	{
		$("#Form2Baud").attr("disabled", "disabled");
		$("#Form2DataBit").attr("disabled", "disabled");
		$("#Form2StopBit").attr("disabled", "disabled");
		$("#Form2Parity").attr("disabled", "disabled");
		$("#Form2Protocol").attr("disabled", "disabled");
		
		$("#Form2Flip").attr("name", "-flip");
		$("#Form2Flip").attr("value",  $("input[name=FlipGrp]:checked").val());
		
		$("#Form2Mirror").attr("name", "-mirror");
		$("#Form2Mirror").attr("value",  $("input[name=MirrorGrp]:checked").val());
	}
	form.cururl.value=document.URL ;
	form.action="cgi-bin/hi3510/param.cgi";
	
	form.submit();
}
	
	
})


