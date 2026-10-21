const STORAGE_KEY = 'jardin-plantas';

const form = document.getElementById('plant-form');
const grid = document.getElementById('grid');
const emptyState = document.getElementById('empty');
const countBadge = document.getElementById('count');

function loadPlants() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function savePlants(plants) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}

function daysUntilNextWatering(plant) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const last = new Date(plant.lastWatered);
  const next = new Date(last.getTime() + plant.frequency * msPerDay);
  const now = new Date();
  return Math.ceil((next - now) / msPerDay);
}

function formatRelative(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'regada hace un momento';
  if (minutes < 60) return `regada hace ${minutes} min`;
  if (hours < 24) return `regada hace ${hours} h`;
  if (days === 1) return 'regada ayer';
  return `regada hace ${days} días`;
}

function statusFor(daysLeft) {
  if (daysLeft < 0) return { cls: 'overdue', label: `Atrasada ${Math.abs(daysLeft)} día(s)` };
  if (daysLeft === 0) return { cls: 'soon', label: 'Riega hoy' };
  if (daysLeft <= 2) return { cls: 'soon', label: `En ${daysLeft} día(s)` };
  return { cls: 'ok', label: `En ${daysLeft} día(s)` };
}

let lastWateredId = null;

function render() {
  const plants = loadPlants();
  grid.innerHTML = '';
  countBadge.textContent = plants.length;
  emptyState.style.display = plants.length === 0 ? 'block' : 'none';

  plants
    .slice()
    .sort((a, b) => daysUntilNextWatering(a) - daysUntilNextWatering(b))
    .forEach((plant) => {
      const daysLeft = daysUntilNextWatering(plant);
      const status = statusFor(daysLeft);

      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.id = plant.id;
      card.innerHTML = `
        <div class="card-top">
          <span class="card-icon">${plant.emoji}</span>
          <button class="remove" data-id="${plant.id}" title="Eliminar">✕</button>
        </div>
        <h3>${plant.name}</h3>
        <p class="freq">Cada ${plant.frequency} día(s)</p>
        <p class="last-watered">${formatRelative(plant.lastWatered)}</p>
        <span class="status ${status.cls}"><span class="dot"></span>${status.label}</span>
        <button class="water-btn" data-id="${plant.id}">Marcar como regada</button>
      `;
      if (plant.id === lastWateredId) card.classList.add('just-watered');
      grid.appendChild(card);
    });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const emoji = document.getElementById('emoji').value;
  const frequency = parseInt(document.getElementById('frequency').value, 10);

  if (!name || !frequency) return;

  const plants = loadPlants();
  plants.push({
    id: Date.now().toString(),
    name,
    emoji,
    frequency,
    lastWatered: new Date().toISOString(),
  });
  savePlants(plants);
  form.reset();
  document.getElementById('frequency').value = 7;
  render();
});

grid.addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  let plants = loadPlants();

  if (e.target.classList.contains('remove')) {
    plants = plants.filter((p) => p.id !== id);
    savePlants(plants);
    render();
  }

  if (e.target.classList.contains('water-btn')) {
    plants = plants.map((p) =>
      p.id === id ? { ...p, lastWatered: new Date().toISOString() } : p
    );
    savePlants(plants);
    lastWateredId = id;
    render();
    setTimeout(() => {
      lastWateredId = null;
    }, 1200);
  }
});

render();
