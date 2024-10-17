document.getElementById('extractBtn').addEventListener('click', () => {
  // Envía un mensaje al contenido activo para extraer las IPs
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: extractIPsFromPage
    }, (results) => {
      const ipList = document.getElementById('ipList');
      const copyBtn = document.getElementById('copyBtn');
      ipList.innerHTML = ''; // Limpiar la lista antes de mostrar nuevas IPs
      let ipArray = [];
      
      if (results && results[0].result.length > 0) {
        results[0].result.forEach(ip => {
          const li = document.createElement('li');
          li.textContent = ip;
          ipList.appendChild(li);
          ipArray.push(ip); // Almacena las IPs extraídas en un array
        });
        copyBtn.disabled = false; // Habilita el botón de copiar
        copyBtn.dataset.ips = ipArray.join('\n'); // Guarda las IPs en un atributo del botón
      } else {
        const li = document.createElement('li');
        li.textContent = 'No IPs found';
        ipList.appendChild(li);
        copyBtn.disabled = true; // Deshabilita el botón si no se encuentran IPs
      }
    });
  });
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const copyText = document.getElementById('copyBtn').dataset.ips;
  navigator.clipboard.writeText(copyText).then(() => {
    alert('IPs copied to clipboard! \n                                   by @Gohanckz');
  }).catch(err => {
    alert('Failed to copy IPs: ', err);
  });
});

// Función que se inyectará en la página para extraer las IPs
function extractIPsFromPage() {
  const strongTags = document.querySelectorAll('strong');
  const ips = Array.from(strongTags)
    .map(tag => tag.textContent)
    .filter(text => /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(text));
  return ips;
}
