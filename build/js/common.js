$(function(){
	navFocus();
	$('.img-wrap a img').each(function(index){
		$(this).parent().css({'background-image':'url('+$(this).attr('src')+')'}).attr('href',$(this).attr('src'));
	});
	$('.img-wrap a').click(function(e){
		var evt = e || window.event;
		if(evt.preventDefault){
			evt.preventDefault();
		}
		$('.img-view').removeClass('hide');
		$('.img-view img').attr('src',$(this).attr('href'));
	});
	$('.img-view img').on('click',function(){
		$(this).parent().addClass('hide');
	});
});