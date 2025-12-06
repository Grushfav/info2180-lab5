// world.js reverted to minimal script to avoid DOM errors
document.addEventListener('DOMContentLoaded', function(){
  // Legacy HTML lookup handlers
  const input = document.getElementById('country');
  const lookupBtn = document.getElementById('lookup');
  const btnCountry = document.getElementById('lookup-country');
  const btnCities = document.getElementById('lookup-cities');
  const result = document.getElementById('result');

  function showStatus(msg){
    if(result) result.innerHTML = `<div class="status">${msg}</div>`;
  }

  async function fetchHtml(url){
    try{
      showStatus('Searching...');
      const res = await fetch(url, { headers: { 'Accept': 'text/html' } });
      if(!res.ok) throw new Error('Server returned ' + res.status);
      const text = await res.text();
      if(result) result.innerHTML = text;
    }catch(err){
      if(result) result.innerHTML = `<div class="empty">Error: ${err.message}</div>`;
    }
  }

  if(lookupBtn){
    lookupBtn.addEventListener('click', function(){
      const q = input ? input.value.trim() : '';
      const url = q ? `world.php?country=${encodeURIComponent(q)}` : 'world.php';
      fetchHtml(url);
    });
  }

  if(btnCountry){
    btnCountry.addEventListener('click', function(){
      const q = input ? input.value.trim() : '';
      const url = q ? `world.php?country=${encodeURIComponent(q)}` : 'world.php';
      fetchHtml(url);
    });
  }

  if(btnCities){
    btnCities.addEventListener('click', function(){
      const q = input ? input.value.trim() : '';
      if(!q){
        if(result) result.innerHTML = '<div class="status">Please enter a country name to lookup cities.</div>';
        return;
      }
      const url = `world.php?country=${encodeURIComponent(q)}&lookup=cities`;
      fetchHtml(url);
    });
  }
});
