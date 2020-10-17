// JavaScript Document

/*********************************放置其它页面用得到公共函数************************/
function checkProhibitedCharacter (obj, string )
{
	if( string.search(/[^a-zA-Z0-9_\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\`\{\|\}\~\s]/) != -1 )
	{
		if(obj != null)
			obj.select();
			
		alert("include invalid character.");
		return false;
	}
	else if(( string.search("\/") != -1 )||( string.search(/\\/) != -1 )||( string.search(":") != -1 )||( string.search("&") != -1 )||( string.search("=") != -1 )||( string.search("\"") != -1 ))
	{
		obj.select();
		alert("include invalid character.(:,&,=,\\\,\/,\")");
		return false;
	}
	else
	{
		return true;
	}
}
function hasZenKaku(str){
	var code;
	for (var i = 0; i < str.length; ++i)
	{
		code = str.charCodeAt(i);
		if (code > 256 && (code < 0xff61 || code > 0xff9f)) 
		{
			return true;
		}
	}
	return false;
}

function hasHankakuKana(str)
{
	var code;
	for (var i = 0; i < str.length; ++i) 
	{
		code = str.charCodeAt(i);
		if (code >= 0xff61 && code <= 0xff9f)
 		{
			return true;
		}
	}
	return false;
}
function checkHankakuNoKana(str,cObj,strMsg)
{
		var tmp;
    if (hasZenKaku(str) == true || hasHankakuKana(str) == true)
    {
			if (strMsg==null || strMsg=='' ) alert('include invalid character.');
  		else alert(strMsg);
			cObj.select();
			return false;
		}
		return true;
}

// by zhangxinxu welcome to visit my personal website http://www.zhangxinxu.com/
// 2010-03-12 v1.0.0
//十六进制颜色值域RGB格式颜色值之间的相互转换

//-------------------------------------
//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function(){
	var that = this;
	if(/^(rgb|RGB)/.test(that)){
		var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
		var strHex = "#";
		for(var i=0; i<aColor.length; i++){
			var hex = Number(aColor[i]).toString(16);
			if(hex === "0"){
				hex += hex;	
			}
			strHex += hex;
		}
		if(strHex.length !== 7){
			strHex = that;	
		}
		return strHex;
	}else if(reg.test(that)){
		var aNum = that.replace(/#/,"").split("");
		if(aNum.length === 6){
			return that;	
		}else if(aNum.length === 3){
			var numHex = "#";
			for(var i=0; i<aNum.length; i+=1){
				numHex += (aNum[i]+aNum[i]);
			}
			return numHex;
		}
	}else{
		return that;	
	}
};

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function(){
	var sColor = this.toLowerCase();
	if(sColor && reg.test(sColor)){
		if(sColor.length === 4){
			var sColorNew = "#";
			for(var i=1; i<4; i+=1){
				sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));	
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for(var i=1; i<7; i+=2){
			sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));	
		}
		return "RGB(" + sColorChange.join(",") + ")";
	}else{
		return sColor;	
	}
};

var xmlfile;

function LoadXml()
{
	if(checkCookie("language") == false)
	{
		/*获取系统语言*/
		if (navigator.appName.indexOf("Microsoft Internet Explorer") != -1)
		{
			var userla=navigator.browserLanguage;
		}
		else
		{
			var userla=navigator.language;
		}		
		setCookie("language", userla, 365);
	}
	var language = getCookie("language");
	if(language == "en")
	{
		xmlpath = "xml/en.xml";//英语
	}
	else if((language == "zh-cn")
		||(language == "zh-CN"))
	{
		xmlpath = "xml/cn.xml";//简体中文
	}
	else if(language == "tw")
	{
		xmlpath = "xml/tw.xml";//繁体中文
	}
	else if(language == "pt")
	{
		xmlpath = "xml/pt.xml";//葡萄牙语
	}
	else if(language == "es")
	{
		xmlpath = "xml/es.xml";//西班牙语
	}
	else if(language == "ru")
	{
		xmlpath = "xml/ru.xml";//俄罗斯语
	}
	else
	{
		xmlpath = "xml/en.xml";
	}	
	$.ajax({   
        url:xmlpath,   
        type: "GET",   
        dataType:"xml",   
        timeout: 3000,   
        error: function(xml){ alert('Error loading XML document:'+xmlpath);},        
        success: function(xml){xmlfile = xml},
		 async:false
	})
}

LoadXml();
		

function LoadLanguage()
{

    /*找出对应的网页字句*/
    pathname = window.location.pathname;
    if (pathname == "/") {
        tagname = "indexhtml";
    } else {
        htmlname = pathname.substr(pathname.lastIndexOf("/") + 1, pathname.length) ;
		tmp = htmlname.split('.');
        tagname = tmp[0] + tmp[1];
    }

    /*在xml文件中找出对应的html标签*/
    $(xmlfile).find(tagname).each(function(index, element) {
	
        var obj = $(this); //取对象
        /***************查找各种类型控件的ID,找出匹配的语言*******************/
        $("span").each(function(index, element) {
            var spanobj = $(this);
            var id = $(this).attr("id");
            obj.find(id).each(function(index, element) {
                spanobj.html($(this).text());
            });
        });

        /*这两个页面有很多option，影响翻译速度，如果需要翻译它，对应的option使用class="optionspan"*/
        if ((tagname != "timeplanhtml")) {
            $("option").each(function(index, element) {
                var optionobj = $(this);
                var id = $(this).attr("id");
                obj.find(id).each(function(index, element) {
                    optionobj.html($(this).text());

                });
            });
        }

        $("label").each(function(index, element) {
            var labelobj = $(this);
            var id = $(this).attr("id");
            obj.find(id).each(function(index, element) {
                labelobj.html($(this).text());

            });
        });
        $("h4").each(function(index, element) {
            var hobj = $(this);
            var id = $(this).attr("id");
            obj.find(id).each(function(index, element) {
                hobj.html($(this).text());

            });
        });

        /***************根据CSS类型,找出匹配的语言*******************/
        $(".classname").each(function(index, element) {
            var cnobj = $(this);
            var id = $(this).attr("id");
            obj.find(id).each(function(index, element) {
                if (document.getElementById(id).nodeName == "INPUT") {
                    cnobj.val($(this).text());
                } else if (document.getElementById(id).nodeName == "A") {
                    cnobj.html($(this).text());
                }
            });
        });
        $(".optionspan").each(function(index, element) {
            var optionobj = $(this);
            var id = $(this).attr("id");
            obj.find(id).each(function(index, element) {
                optionobj.html($(this).text());
            });
        });
        /***************根据控件的ID,找出匹配的语言*******************/
        $("#apply").each(function(index, element) {
            var apply = $(this);
            obj.find("ApplySpan").each(function(index, element) {
                apply.html($(this).text());

            });
        });
        $("#cancel").each(function(index, element) {
            var cancel = $(this);
            obj.find("CancelSpan").each(function(index, element) {
                cancel.html($(this).text());

            });
        });
        /***************特殊页面处理,找出匹配的语言，这个尽量小写，减小后期维护的难度*******************/

        if (tagname == "autosnaphtml") {
            $("a").each(function(index, element) {
                var hobj = $(this);
                var id = $(this).attr("id");
                obj.find(id).each(function(index, element) {
                    hobj.html($(this).text());
                });
            });

        }

        if (tagname == "displayhtml") {
            $("#apply").each(function(index, element) {
                var hobj = $(this);
                var id = $(this).attr("id");
                obj.find("SaveSpan").each(function(index, element) {
                    hobj.html($(this).text());

                });
            });
            $("#cancel").each(function(index, element) {
                var hobj = $(this);
                var id = $(this).attr("id");
                obj.find("ReloadSpan").each(function(index, element) {
                    hobj.html($(this).text());

                });
            });
            $("#default").each(function(index, element) {
                var hobj = $(this);
                var id = $(this).attr("id");
                obj.find("DefaultSpan").each(function(index, element) {
                    hobj.html($(this).text());

                });
            });

        }

    });
}


/*从多国语言中获取指定字符串*/
function GetStrFromXML()
{
	var argc = arguments.length;
	var argv = new Array;

	for(i=0; i<argc; i++)
			argv[i] = arguments[i];

			/*找出对应的网页字句*/
			pathname = window.location.pathname;
			htmlname= pathname.substr(pathname.lastIndexOf("/")+1,pathname.length)
			tmp = htmlname.split('.');
			tagname=tmp[0]+tmp[1];
			xmldate="";
			//alert(tagname);
			/*在xml文件中找出对应的html标签*/
            $(xmlfile).find(tagname).each(function(index, element)
			{
				var obj = $(this); //取对象
				for(i=0; i<argc; i++)
				{
						obj.find(argv[i]).each(function(index, element) 
						{
							xmldate += 'var '+ argv[i] + '="'+ $(this).text() +'"\r\n';
						});
				}
            });   
			return xmldate;
}

/*把XML文件对应的节点转换成变量*/
var TageNameChildren ="";
function ParaXML()
{
			/*找出对应的网页字句*/
			pathname = window.location.pathname;
			htmlname= pathname.substr(pathname.lastIndexOf("/")+1,pathname.length)
			tmp = htmlname.split('.');
			tagname=tmp[0]+tmp[1];
			TageNameChildren ="";
			//alert(tagname);
			/*在xml文件中找出对应的html标签*/
			//alert(xmlfile);
            $(xmlfile).find(tagname).each(function(index, element)
			{
				$(this).children().each(function(index, element) //
				{
					TageNameChildren +="var " + $(this).context.nodeName + " = " + "\"" + $(this).text() +  "\"" + ";" + "\n";
				});
				
            });   

}
ParaXML();

//alert(TageNameChildren);
eval(TageNameChildren); 




// JavaScript Document

function GetLanguage()
{
	return getCookie("language");
}

function SetPlayStream(Type)
{
	setCookie("Stream Type",  Type, 365);
}

function GetPlayStream()
{
	if(checkCookie("Stream Type") == false)
	{
		return '11';
	}
	else
	{
		return 	getCookie("Stream Type");
	}
}

function SetAutoLogin(Type)
{
	setCookie("auto login",  Type, 365);
}

function GetAutoLogin()
{
	if(checkCookie("auto login") == false)
	{
		return '0';
	}
	else
	{
		return 	getCookie("auto login");
	}
}

function getCookie(c_name)
{
        var i,x,y,ARRcookies=document.cookie.split(";");
        for (i=0;i<ARRcookies.length;i++)
        {
                x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
                y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
                x=x.replace(/^\s+|\s+$/g,"");
                if (x==c_name)
                {
                        return unescape(y);
                }
        }
		return null;
}

function setCookie(c_name,value,exdays)
{
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value;
}

function checkCookie(c_name)
{
        var username=getCookie(c_name);
        if (username!=null && username!="")
        {
               return true;
        }
        else 
        {
               return false;
        }
}
function delCookie(name)//删除cookie
{

    var exp = new Date();

    exp.setTime(exp.getTime() - 1);

    var cval=getCookie(name);

    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();

}

function GetBrowserVer()
{
    //1、浏览器版本号函数：
    var br = navigator.userAgent.toLowerCase();
    var browserVer = (br.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1];
    var brower;//得到浏览器名称

    //2、js浏览器判断函数

        var browserName = navigator.userAgent.toLowerCase();
        if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
            brower =  "IE"; 
        } else if (/firefox/i.test(browserName)) {
            brower =  "Firefox";
        } else if (/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)) {
            brower =  "Chrome";
        } else if (/opera/i.test(browserName)) {
            brower =  "Opera";
        } else if (/webkit/i.test(browserName) && !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))) {
            brower =  "Safari";
        } else {
            brower =  "unKnow";
        }

		return{brower:brower, ver:browserVer};
}

$(function(){

	$('body div:first:not("#ReplayLayer, #headerLayer")').addClass("conternLayerStyle");
	
	BrowserVer = GetBrowserVer();

	if((BrowserVer.brower == "IE")&&(BrowserVer.ver == "6.0"))$('.conternLayerStyle div > span').addClass("SpanStyle");
	
})


