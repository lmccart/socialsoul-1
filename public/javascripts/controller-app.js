

window.onload = function() {
  console.log('load');

  // BA controller app
  $('#trigger').click(function(e){
    console.log('hi')
    window.location = './controller?action=trigger';
  });

  $('#set_user').click(function(e){
    window.location = './controller?action=set_user&user='+$('#user').val();
  });
}