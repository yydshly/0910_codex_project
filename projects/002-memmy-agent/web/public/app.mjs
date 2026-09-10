import { layers, modes, getLayer } from './data.mjs';
const setText = (id, text) => { document.getElementById(id).textContent = text; };
let currentMode = 'external';
let currentLayer = '1';
const compactLayout = window.matchMedia('(max-width: 720px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncUrl() {
  const url = new URL(window.location.href);
  for (const [key, value, fallback] of [['mode', currentMode, 'external'], ['layer', currentLayer, '1']]) {
    if (value === fallback) url.searchParams.delete(key); else url.searchParams.set(key, value);
  }
  window.history.replaceState(null, '', url);
}
function selectLayer(id, { reveal = false, persist = true } = {}) {
  const layer = getLayer(id, currentMode);
  if (!layer) return;
  currentLayer = String(id);
  document.querySelectorAll('[data-layer]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.layer === String(id))));
  setText('detail-index', `LAYER ${String(id).padStart(2, '0')}`);
  for (const field of ['title','summary','input','process','output','boundary']) setText(`detail-${field}`, layer[field]);
  document.getElementById('detail-tags').replaceChildren(...layer.tags.map(text => { const tag = document.createElement('span'); tag.textContent = text; return tag; }));
  document.getElementById('detail-source').href = layer.source;
  setText('selection-status', `已选择第 ${id} 层：${layer.title}`);
  if (persist) syncUrl();
  if (reveal && compactLayout.matches) {
    document.getElementById('detail-title').focus({ preventScroll: true });
    document.getElementById('layer-detail').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  }
}
function selectMode(id, { persist = true } = {}) {
  const mode = modes[id];
  if (!mode) return;
  currentMode = id;
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === id)));
  setText('executor-title', mode.title);
  setText('executor-subtitle', mode.subtitle);
  setText('mode-caption', mode.caption);
  setText('mode-explanation', mode.explanation);
  selectLayer(currentLayer, { persist });
}
document.querySelectorAll('[data-layer]').forEach(button => button.addEventListener('click', () => selectLayer(button.dataset.layer, { reveal: true })));
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => selectMode(button.dataset.mode)));
document.getElementById('back-to-layer').addEventListener('click', () => {
  const button = document.querySelector(`[data-layer="${currentLayer}"]`);
  button.focus({ preventScroll: true });
  button.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
});
function restoreSelection() {
  const params = new URL(window.location.href).searchParams;
  currentLayer = Object.hasOwn(layers, params.get('layer')) ? params.get('layer') : '1';
  selectMode(Object.hasOwn(modes, params.get('mode')) ? params.get('mode') : 'external', { persist: false });
}
restoreSelection();
window.addEventListener('popstate', restoreSelection);
