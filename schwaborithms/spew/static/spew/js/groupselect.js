$(document).ready(function() {
	$.ajax({
		url: '/spew/getjoinedgroupdata',
		dataType: 'json',
		success: function (data) {
			data['data'].forEach(function(item, index) { 
				$('.group-list').append(
				"<button class='group-button'>" +
					"<p class='group-name'>" + item['name'] + "</p>" +
					"<p>" + item['wordcount'] + " words</p>" +
				"</button>")
			});
			$('.group-list').on('click', '.group-button', function () {
				
				name = $(this).find('.group-name').text()
				pwd = ''
				data['data'].forEach(function(item, index) {
					if(item['name'] == name)
						pwd = item['password']
				});
				$.ajax({
					url: '/spew/joingroup',
					dataType: 'json',
					data: {
						'name': name,
						'pwd': pwd
					},
					success: function (data) {
						console.log(data)
						if (data.success == 0) {
							window.location = window.location.origin + "/spew"
						}
					}
				});
			});
		}
	});
	
	$('input#join').click( function () {
		$('form').submit( function(e) {
			e.preventDefault();
		});
		
		var name = $('#groupname').val();
		var pwd = $('#grouppassword').val();
		
		$.ajax({
			url: '/spew/joingroup',
			data: {
				'name': name,
				'pwd': pwd
			},
			dataType: 'json',
			success: function (data) {
				if (data.success == 0) {
					window.location = window.location.origin + "/spew"
				}
				else {
					//display error
					$('#group-form p').remove()
					$('#groupname').value = ''
					$('#groupname').after('<p style="color:red">' + data.message + '</p>')
				}
			}
		});
	});
	
	$('input#create').click( function () {
		$('form').submit( function(e) {
			e.preventDefault();
		});
		
		var name = $('#groupname').val();
		var pwd = $('#grouppassword').val();
		
		$.ajax({
			url: '/spew/creategroupsetup',
			data: {
				'name': name,
				'pwd': pwd
			},
			dataType: 'json',
			success: function (data) {
				
				if(data.success == 0) {
					$('#group-form p').remove()
					$('#join').hide()
					$('#create').hide()
					$('.confirm').show()
					
				}
				else {
					//display error
					$('#group-form p').remove()
					$('#groupname').value = ''
					$('#groupname').after('<p style="color:red">' + data.message + '</p>')
				}
			}
		});
	});
	
	$('#group-form').on('click', '#final-create', function () {
		name = $('#groupname').val();
		pwd = $('#grouppassword').val();
		confirmpwd = $('#confirmgrouppassword').val();
		
		if(pwd == confirmpwd)
		{
			$.ajax({
				url: '/spew/creategroup',
				data: {
					'name': name,
					'pwd': pwd
				},
				dataType: 'json',
				success: function (data) {
					if (data.success == 0) {
						window.location = window.location.origin + "/spew"
					}
					//display error
					$('#group-form p').remove()
					$('#groupname').value = ''
					$('#groupname').after('<p style="color:red">' + data.message + '</p>')
				}
			});
		}
		else {
			//display error
			$('#group-form p').remove() 
			$('#grouppassword').value = ''
			$('#confirmgrouppassword').value = ''
			$('#confirmgrouppassword').after('<p style="color:red">passwords do not match</p>')
		}
	});
	
	$('#group-form').on('click', '#cancel', function () {
		$('#group-form p').remove()
		$('#group-form input').value = ''
		$('#join').show()
		$('#create').show()
		$('.confirm').hide()
	});
	
})