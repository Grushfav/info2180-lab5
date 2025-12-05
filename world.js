// UI behavior for World Database Lookup
(function(){
  const input = document.getElementById('country');
  const btnCountry = document.getElementById('lookup-country');
  const btnCities = document.getElementById('lookup-cities');
  const container = document.getElementById('resultsContainer');
  const legacyResult = document.getElementById('result');
  const lookupBtn = document.getElementById('lookup');

  function setStatus(text){
    container.innerHTML = `<div class="status">${escapeHtml(text)}</div>`;
  }

  function escapeHtml(s){
    return String(s).replace(/[&"'<>]/g, function(c){
      return {'&':'&amp;','"':'&quot;','\'':'&#39;','<':'&lt;','>':'&gt;'}[c];
    });
  }

  async function lookup(type){
    const q = input.value.trim();
    if(!q){
      setStatus('Please enter a search term.');
      return;
    }
    setStatus('Searching...');
    try{
      const url = `world.php?type=${encodeURIComponent(type)}&q=${encodeURIComponent(q)}&format=json`;
      const res = await fetch(url, {headers:{'Accept':'application/json'}});
      if(!res.ok){
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      renderResults(type, data);
    }catch(err){
      container.innerHTML = `<div class="empty">Error: ${escapeHtml(err.message)}</div>`;
    }
  }

  function renderResults(type, data){
    if(!Array.isArray(data) || data.length===0){
      container.innerHTML = `<div class="empty">No results found.</div>`;
      return;
    }
    
    let columns = [];
    if(type==='country'){
      // prefer common fields if present
      columns = ['name','continent','independence','head_of_state'];
    }else{
      columns = ['city','country','district','population'];
    }
    // fallback to keys from first item
    const first = data[0];
    const available = Object.keys(first);
    const cols = columns.filter(c=>available.includes(c));
    const finalCols = cols.length?cols:available.slice(0,5);

    let html = '<table class="results"><thead><tr>';
    for(const c of finalCols){ html += `<th>${escapeHtml(titleize(c))}</th>` }
    html += '</tr></thead><tbody>';
    for(const row of data){
      html += '<tr>';
      for(const c of finalCols){ html += `<td>${escapeHtml(row[c] ?? '')}</td>` }
      html += '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  function titleize(s){ return String(s).replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase()); }

  // Lookup country using HTML endpoint and inject into #result
  btnCountry.addEventListener('click', async function(){
    const q = input.value.trim();
    const url = q ? `world.php?country=${encodeURIComponent(q)}` : `world.php`;
    try{
      legacyResult.innerHTML = '<div class="status">Searching...</div>';
      const res = await fetch(url, {headers:{'Accept':'text/html'}});
      if(!res.ok) throw new Error('Server returned ' + res.status);
      const text = await res.text();
      legacyResult.innerHTML = text;
    }catch(err){
      legacyResult.innerHTML = `<div class="empty">Error: ${err.message}</div>`;
    }
  });

  // Lookup cities for the given country using HTML endpoint and inject into #result
  btnCities.addEventListener('click', async function(){
    const q = input.value.trim();
    if(!q){
      legacyResult.innerHTML = '<div class="status">Please enter a country name to lookup cities.</div>';
      return;
    }
    const url = `world.php?country=${encodeURIComponent(q)}&lookup=cities`;
    try{
      legacyResult.innerHTML = '<div class="status">Searching cities...</div>';
      const res = await fetch(url, {headers:{'Accept':'text/html'}});
      if(!res.ok) throw new Error('Server returned ' + res.status);
      const text = await res.text();
      legacyResult.innerHTML = text;
    }catch(err){
      legacyResult.innerHTML = `<div class="empty">Error: ${err.message}</div>`;
    }
  });
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') lookup('country'); });

  // Legacy: support a simple "Lookup" button with id="lookup" that fetches HTML
  if(lookupBtn){
    lookupBtn.addEventListener('click', async function(){
      const q = input.value.trim();
      // build URL - if empty, omit country param to return all countries
      const url = q ? `world.php?country=${encodeURIComponent(q)}` : `world.php`;
      try{
        legacyResult.innerHTML = '<div class="status">Searching...</div>';
        const res = await fetch(url, {headers:{'Accept':'text/html'}});
        if(!res.ok) throw new Error('Server returned ' + res.status);
        const text = await res.text();
        legacyResult.innerHTML = text;
      }catch(err){
        legacyResult.innerHTML = `<div class="empty">Error: ${err.message}</div>`;
      }
    });
  }
})();
