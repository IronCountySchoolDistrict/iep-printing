var loc = document.getElementById('iep-frame').getAttribute('data-params');
document.getElementById('iep-frame').src = '/* @echo API_URL */' + loc;

function checkStorage() {
  if (localStorage.getItem('iep')) {
    console.log('reload iframe');
    document.getElementById('iep-frame').src = document.getElementById('iep-frame').src;
    localStorage.removeItem('iep');
  }

  console.log('waiting...');
  setTimeout(checkStorage, 1000);
}

checkStorage();
