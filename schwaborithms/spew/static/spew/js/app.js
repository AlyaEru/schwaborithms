$(document).ready(function() {
	var spewNames = true;
	
	setInterval(function(){
		if(spewNames)
		{
			$.ajax({
				url: '/spew/generate',
				dataType: 'json',
				success: function (data) {
					$('#spewnames').after('<li class="spewing" style="color: rgb('+ (Math.floor(Math.random() * 200 + 56)).toString() +','+ (Math.floor(Math.random() * 200 + 56)).toString() +','+ (Math.floor(Math.random() * 200 + 56)).toString() +');">'+ data.sentence +'</li>');
				}
			});
			
		}
	}, 2000);
	
	$('#main').click(function() {
		if($('#spewnames').hasClass('spewon')) {
			$('#spewnames').removeClass('spewon');
			spewNames = false;
		}
		else {
			$('#spewnames').addClass('spewon');
			spewNames = true;
		}
	});
	
	$('input.cmd').click( function () {
		$('form').submit( function(e) {
			e.preventDefault();
		});
		$('#word').val($('#word').val().replace("'","&apos;")); //fixes apostrophe bug
		var wordType = $('input[type=radio]:checked').val();
		var Word = $('#word').val();
		var command = $(this).val();
		if(command == 'add') {
			$.ajax({
				url: '/spew/newword',
				data: {
				  'word': Word,
				  'pos': wordType
				},
				dataType: 'json',
				success: function (data) {
					$('#spewnames').after('<li class="spewing" style="color: white;">'+ data.response +'</li>');
				}
			});
		}
		if(command == 'delete') {
			$.ajax({
				url: '/spew/deleteword',
				data: {
				  'word': Word,
				  'pos': wordType
				},
				dataType: 'json',
				success: function (data) {
					$('#spewnames').after('<li class="spewing" style="color: white;">'+ data.response +'</li>');
				}
			});
		}
		
		$('#word').val("");
	});
	$('input[value=se]').click( function() {
		$("#word").attr('placeholder', 'ex: [NAME] is a [ADJ] [NOUN]');
	});
	$('input[value=se]').siblings().click( function() {
		$("#word").attr('placeholder', '');
	});
	
});