// JavaScript Document

$(function(){


$(document).ready(function(e) {
    LoadLanguage();
	
	osd_on_load();
	
	setTimeout(function(){$("body").css("display", "block");}, 100);

});

 osd_on_load = function() {
    var form = document.form1;
    /**************时间OSD 名字OSD************************/
    if (width_1 >= 320) {
        if (show_0 == 1) {
            form.timeradio[0].checked = true;
        } else {
            form.timeradio[1].checked = true;
        }
        if (show_1 == 1) {
            form.nameradio[0].checked = true;
        } else {
            form.nameradio[1].checked = true;
        }
    }
    form.cameraname.value = ipcname;

}

 do_submit = function() {
    var form1 = document.form1;
    var form = document.form2;

    form.cururl.value = document.URL;
    //the time osd 
   // act0 = document.getElementById('Form2Act0');
   // if (form1.timeradio[0].checked == true) {
    //    act0.value = "show";
    //} else {
    //    act0.value = "hide";
   // }
   // act0.name = "-act";

    //the info osd
   // act1 = document.getElementById('Form2Act1');
    //if (form1.nameradio[0].checked == true) {
    //    act1.value = "show";
   // } else {
    //    act1.value = "hide";
    //}
    //act1.name = "-actname";

    //the name osd
    name2 = document.getElementById('Form2Name2');
    name2.value = form1.cameraname.value;
    name2.name = "-ipcname";

    form.action = "cgi-bin/hi3510/param.cgi";
    form.submit();
    return true;

}

	
})