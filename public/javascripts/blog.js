$(function(){
	//textarea
	$("#msg").click(function(){
		$(".message").stop().slideDown(400);
		$("textarea").focus().blur(function(){
			slideUp_area();
		})
		return false;
	});
	/*$("textarea").blur(function(){
		slideUp_area();
	});*/
	$("button.cancel").click(function(){
		slideUp_area();
	});
	function slideUp_area(){
		$(".message").stop().slideUp(400);
		$("textarea").val("");
	}
	$("button.yes").click(function(){
		var parent = $(this).parents(".widget");
		var success = parent.find(".success");
		$(".message").stop().slideUp(400);
		console.log(parent);
		$.ajax({
			type:"GET",
			url:"javascripts/post.html",
			dataType:"html",
			success:function(data){
				//console.log("success");
				success.html(data);
				success.find(".str").click(function(){
					$(this).hide();
				});
				$("textarea").val("")
			},
			complete:function(xhr, textstatus){
				console.log("complete" + textstatus + " " + xhr);
			},
			error:function(xhr,textstatus, errorThrown) {
				console.log(textstatus);
			}
		});
	});
	//加载 
	$(".more > a").click(function(){
		var main = $(this).parent().parent();
		var more = $(this).parent();
		$.ajax({
			type:"GET",
			url:"content/id1.html",
			dataType:"html",
			success:function(data) {
				more.before(data);
			},
			error:function(){
				alert("no");
			}
		})
		return false;
	});
	//main-navigation
	$("ul.menu > li").click(function(){
		var $parent = $(this).parent();
		var $current_li = $(this);
		var href = $(this).find('a').prop('href');
		$parent.find("li").removeClass('nav-current');
		$current_li.addClass('nav-current');
		//$(this).addClass('nav-current');
	});

	//img预览
	function getPath(obj) {
		if(obj) {
			if(window.navigator.userAgent.indexOf("MSIE") >= 1) {
				obj.select();
				return document.selection.createRange().text;
			}else if(window.navigator.userAgent.indexOf("Firefox") >= 1) {
				if(obj.files) {
					return obj.files.item(0).getAsDataURL();
				}
				return obj.value;
			}
			return obj.value;
		}
	}
	$(".img-file").change(function(e) {
		$(e.target).select();
		var $input = $(this).find("#Imginput");
		var src = getPath($input[0]);
		console.log(src);
		$input.css("backgroundImage","url(" + src + ")");
	});
});