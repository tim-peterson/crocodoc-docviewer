
$('.showCrocodoc').click(function(){
	var data=$(this).data();
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
				}
			});
		}
	});
});



