


$('.showCrocodoc').click(function(){
	var data=$(this).data();
	
	$(this).addClass('active');
	$('.showCrocodoc').not(this).removeClass('active');

	$.ajax({
		//"dataType": "json",
		"url": 'https://onarbor.com/decode/getCrocodocSession/'+data.uuid,
		success:function(data1){
			console.log('1st callback'+data1);
			$.ajax({
			    url: "//crocodoc.com/webservice/document.js?session="+data1,
			    dataType: "script",
			    success: function(data2){
			      	console.log('2nd callback'+data2);
					var docViewer = new DocViewer({ id: "crocodoc-"+data.id, zoom: "auto" });	

			          docViewer.ready(function(e) {
			          		var l=e.numpages;
							console.log('docViewer ready numpages:'+l);

								$('.iosSlider').iosSlider({
									snapToChildren: true,
									desktopClickDrag: true,
									keyboardControls: true,
									navNextSelector: $('.next'),
									navPrevSelector: $('.prev'),
									navSlideSelector: $('.selectors .item'),
									onSlideChange: slideChange
								});
										
								function slideChange(args) {							
									$('.selectors .item').removeClass('selected');
									$('.selectors .item:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');								
								}

				          }); //docViewer.ready
						
				}
			});
		}
	});
});



