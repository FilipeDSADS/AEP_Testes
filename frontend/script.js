const LOGIN_API = 'http://localhost:8080/api/usuarios/login';

function atualizarUIUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  const userLogado = document.getElementById('user-logado');
  const botaoCadastrarEcoponto = document.getElementById('botao-abrir-ecoponto');

  if (usuario) {
    userLogado.innerHTML = `Usuário logado: <strong>${usuario.nome}</strong> <button onclick="logout()">Sair</button>`;
    
    if (usuario.role === 'ADMIN') {
      botaoCadastrarEcoponto.style.display = 'inline-block';
    } else {
      botaoCadastrarEcoponto.style.display = 'none';
    }

  } else {
    userLogado.innerHTML = '';
    botaoCadastrarEcoponto.style.display = 'none';
  }
}



function logout() {
  localStorage.removeItem('usuarioLogado');
  atualizarUIUsuario();
}

document.getElementById('form-login').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;

  fetch(LOGIN_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then(response => {
      if (!response.ok) throw new Error('Email não encontrado.');
      return response.json();
    })
    .then(usuario => {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      atualizarUIUsuario();
      fecharModal('modal-login');
    })
    .catch(error => alert(error.message));
});



const USUARIO_API = 'http://localhost:8080/api/usuarios';
const ECOPONTO_API = 'http://localhost:8080/api/ecopontos';

let map = L.map('map').setView([-23.420999, -51.933056], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markersLayer = L.layerGroup().addTo(map);

map.on('click', function (e) {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Verifica se o usuário está logado e se é ADMIN
  if (usuario && usuario.role === 'ADMIN') {
    const { lat, lng } = e.latlng;
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);
    setTimeout(() => abrirModal('modal-ecoponto'), 100);
  }
});


function carregarEcopontos() {
  fetch(ECOPONTO_API)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('ecoponto-lista');
      container.innerHTML = '';
      markersLayer.clearLayers();

      if (data.length === 0) {
        container.innerHTML = '<p>Nenhum ecoponto encontrado.</p>';
        return;
      }

      data.forEach(ecoponto => {
        L.marker([ecoponto.latitude, ecoponto.longitude])
          .addTo(markersLayer)
          .bindPopup(`<strong>${ecoponto.nome}</strong><br>${ecoponto.descricao}`);

        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <h3>${ecoponto.nome}</h3>
          <p><strong>Descrição:</strong> ${ecoponto.descricao}</p>
          <p><strong>Resíduos:</strong> ${ecoponto.tipoResiduos}</p>
          <p><strong>Localização:</strong> (${ecoponto.latitude}, ${ecoponto.longitude})</p>
        `;
        container.appendChild(div);
      });
    })
    .catch(error => console.error('Erro ao buscar ecopontos:', error));
}

document.getElementById('form-usuario').addEventListener('submit', function (e) {
  e.preventDefault();

  const usuario = {
    nome: document.getElementById('usuario-nome').value,
    email: document.getElementById('usuario-email').value,
    role: document.getElementById('usuario-role').value  // <- novo campo
  };

  fetch(USUARIO_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao cadastrar usuário');
      return response.json();
    })
    .then(() => {
      document.getElementById('form-usuario').reset();
      fecharModal('modal-usuario');
      alert('Usuário cadastrado com sucesso!');
    })
    .catch(error => alert(error));
});


document.getElementById('form-ecoponto').addEventListener('submit', function (e) {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!usuario || usuario.role !== 'ADMIN') {
    alert('Apenas administradores podem cadastrar ecopontos.');
    return;
  }

  const novoEcoponto = {
    nome: document.getElementById('nome').value,
    descricao: document.getElementById('descricao').value,
    tipoResiduos: document.getElementById('residuos').value,
    latitude: parseFloat(document.getElementById('latitude').value),
    longitude: parseFloat(document.getElementById('longitude').value)
  };

  fetch(`${ECOPONTO_API}?emailUsuario=${encodeURIComponent(usuario.email)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoEcoponto)
  })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao cadastrar ecoponto');
      return response.json();
    })
    .then(() => {
      carregarEcopontos();
      document.getElementById('form-ecoponto').reset();
      fecharModal('modal-ecoponto');
    })
    .catch(error => alert(error));
});


function abrirModal(id) {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  const modaisLiberados = ['modal-login', 'modal-usuario'];
  if (!usuario && !modaisLiberados.includes(id)) {
    alert('Você precisa estar logado para usar essa funcionalidade.');
    return;
  }

  document.getElementById(id).style.display = 'block';
}




function fecharModal(id) {
  document.getElementById(id).style.display = 'none';
}

window.onclick = function(event) {
  document.querySelectorAll('.modal').forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
};

window.onload = carregarEcopontos;
