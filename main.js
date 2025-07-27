
const characterContainer = document.getElementById('character-container');
const nameFilter = document.getElementById('name-filter');
const statusFilter = document.getElementById('status-filter');
const genderFilter = document.getElementById('gender-filter');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const messageContainer = document.getElementById('message-container');

const API_BASE = 'https://rickandmortyapi.com/api/character';
let currentPageInfo = null;

const showMessage = (text, type = 'info') => {
    const colors = {
        info: 'text-gray-400',
        error: 'text-red-500',
        loading: 'text-cyan-400'
    };
    messageContainer.innerHTML = `<p class="${colors[type] || 'text-white'}">${text}</p>`;
};

const renderCharacters = (characters) => {
    characterContainer.innerHTML = '';
    if (!characters.length) {
        showMessage('No se encontraron personajes con estos filtros.', 'error');
        return;
    }

    characters.forEach(character => {
        const statusColor = {
            Alive: 'bg-green-500',
            Dead: 'bg-red-500',
            unknown: 'bg-gray-500'
        }[character.status] || 'bg-gray-500';

        const card = `
            <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img src="${character.image}" alt="${character.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-bold text-white mb-2">${character.name}</h2>
                    <p class="text-gray-300 flex items-center">
                        <span class="h-3 w-3 rounded-full mr-2 ${statusColor}"></span>
                        ${character.status} - ${character.species}
                    </p>
                </div>
            </div>`;
        characterContainer.innerHTML += card;
    });
};

const updatePagination = (info) => {
    currentPageInfo = info;
    prevButton.disabled = !info.prev;
    nextButton.disabled = !info.next;
};

const fetchCharacters = async (url) => {
    showMessage('Cargando personajes...', 'loading');
    characterContainer.innerHTML = '';
    updatePagination({ prev: null, next: null });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se encontraron resultados.');
        const data = await response.json();
        messageContainer.innerHTML = '';
        renderCharacters(data.results);
        updatePagination(data.info);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        showMessage(error.message, 'error');
    }
};

const applyFiltersAndFetch = () => {
    const params = new URLSearchParams();
    if (nameFilter.value.trim()) params.append('name', nameFilter.value.trim());
    if (statusFilter.value) params.append('status', statusFilter.value);
    if (genderFilter.value) params.append('gender', genderFilter.value);

    const url = `${API_BASE}?${params.toString()}`;
    fetchCharacters(url);
};

// Eventos
document.addEventListener('DOMContentLoaded', () => fetchCharacters(API_BASE));
nameFilter.addEventListener('input', applyFiltersAndFetch);
statusFilter.addEventListener('change', applyFiltersAndFetch);
genderFilter.addEventListener('change', applyFiltersAndFetch);

prevButton.addEventListener('click', () => {
    if (currentPageInfo?.prev) fetchCharacters(currentPageInfo.prev);
});
nextButton.addEventListener('click', () => {
    if (currentPageInfo?.next) fetchCharacters(currentPageInfo.next);
});