import { hsvToHex } from './arc-color/colorPicker';
import { hexToRgb, hexToCmyk, hexToHsl, hexToHsb } from './arc-color/colorFormats';
import { findNearestPantones, formatPantoneCode } from './arc-color/pantoneColors';
const modes = [
  { placeholder: 'Поиск по меткам', html: '<strong>Поиск по категориям и меткам</strong><p>Начните вводить название метки или ID карточки</p><hr><small>КАТЕГОРИИ И МЕТКИ</small><div class="search-demo__chips"><span>Дизайн</span><span>Интерфейс</span><span>Типографика</span><span>Архитектура</span><span>Цвет</span><span>Иллюстрация</span></div>' },
  { placeholder: 'Семантический поиск', html: `<div class="arc-search-panel-intro"><h3 class="arc-search-panel-mode-header__title">Семантический поиск</h3><p class="arc-search-panel-hint">Опишите, что ищете, например: «Чёрная кошка».</p></div><hr class="arc-search-panel-fullbleed-sep"><div class="arc-search-panel-section"><div class="arc-search-panel-section__header"><p class="arc-search-panel-section__title">Недавние запросы</p><span class="arc-search-panel-section__clear">Очистить</span></div><div class="demo-ai-queries"><div class="demo-ai-query"><span>Минималистичный интерфейс приложения в тёмных тонах</span><i class="demo-ai-query__icon" aria-hidden="true"></i></div><div class="demo-ai-query"><span>Абстрактная композиция с текстурой глины</span><i class="demo-ai-query__icon" aria-hidden="true"></i></div><div class="demo-ai-query"><span>Портрет девушки в мягком свете на закате</span><i class="demo-ai-query__icon" aria-hidden="true"></i></div><div class="demo-ai-query"><span>Уютная сцена с котом на подоконнике</span><i class="demo-ai-query__icon" aria-hidden="true"></i></div></div></div>` },
  { placeholder: '#F3F3F4', html: `<div class="arc-search-panel-color"><div class="arc-search-panel-color-intro"><div class="arc-search-panel-color-header"><h3 class="arc-search-panel-mode-header__title">Поиск по цвету</h3></div><p class="arc-search-panel-hint">Задайте доминирующий цвет — найдём карточки с похожей палитрой</p></div><div class="color-demo__hue"><i></i></div><div class="color-demo__palette"><i></i></div><div class="color-demo__accuracy"><span>Точность</span><div class="color-demo__track"><i></i></div><span class="color-demo__value">85 %</span></div></div>` },
  { placeholder: 'Поиск по совпадениям', html: `<div class="arc-search-panel-intro"><h3 class="arc-search-panel-mode-header__title">Поиск по совпадениям</h3><p class="arc-search-panel-hint">Загрузите изображение или выберите карточку из недавних просмотров</p></div><hr class="arc-search-panel-fullbleed-sep"><div class="similar-demo__drop"><div class="similar-demo__empty">Перетащите изображение в поле поиска или нажмите на кнопку, чтобы загрузить файл…<span>Выбрать изображение</span></div><div class="similar-demo__result"><div class="similar-demo__image"></div><div class="similar-demo__crop" aria-label="Область поиска"><button type="button" data-crop="nw" aria-label="Верхний левый угол рамки"></button><button type="button" data-crop="ne" aria-label="Верхний правый угол рамки"></button><button type="button" data-crop="sw" aria-label="Нижний левый угол рамки"></button><button type="button" data-crop="se" aria-label="Нижний правый угол рамки"></button></div></div></div><div class="similar-demo__flight" aria-hidden="true"><div class="similar-demo__image"></div><span class="similar-demo__cursor" aria-hidden="true"><img src="/images/collect/screenshot-cursor.svg" alt="" /></span></div>` }

];
document.querySelectorAll<HTMLElement>('.arc-demo__surface').forEach((scene) => {
  const island = scene.querySelector<HTMLElement>('.arc-demo__search');
  const bar = scene.querySelector<HTMLElement>('.arc-demo__navbar');
  if (!island || !bar) return;
  const buttons = Array.from(island.querySelectorAll<HTMLButtonElement>('.arc-demo__icon')).slice(0, 4);
  const placeholder = island.querySelector<HTMLElement>('.arc-demo__placeholder');
  const searchButton = island.querySelector<HTMLButtonElement>('[aria-label="Поиск"]');
  const panel = document.createElement('div');
  panel.className = 'search-demo__panel';
  panel.hidden = true;
  panel.id = 'demo-search-panel-' + Math.random().toString(36).slice(2);
  bar.append(panel);
  let mode = 0;
  let hue = 0, saturation = 0, brightness = 95;
  let formatIndex = 0;
  const formats = ['HEX', 'RGB', 'CMYK', 'HSL', 'HSB', 'Pantone'];
  const swatch = document.createElement('span'); swatch.className = 'color-demo__swatch';
  const formatButton = document.createElement('button'); formatButton.type = 'button'; formatButton.className = 'color-demo__format'; formatButton.setAttribute('aria-label', 'Переключить формат цвета');
  placeholder?.before(formatButton); placeholder?.after(swatch);
  const updateColor = () => {
    if (mode !== 2 || !placeholder) return;
    const hex = hsvToHex(hue, saturation, brightness);
    const rgb = hexToRgb(hex), cmyk = hexToCmyk(hex), hsl = hexToHsl(hex), hsb = hexToHsb(hex);
    const pantone = formatIndex === 5 ? findNearestPantones(hex, 1)[0] : null;
    const values = [hex, rgb && `${rgb.r} ${rgb.g} ${rgb.b}`, cmyk && `${cmyk.c} ${cmyk.m} ${cmyk.y} ${cmyk.k}`, hsl && `${hsl.h} ${hsl.s}% ${hsl.l}%`, hsb && `${hsb.h} ${hsb.s}% ${hsb.b}%`, pantone ? formatPantoneCode(pantone.code) : '—'];
    formatButton.textContent = formats[formatIndex]; swatch.style.background = hex;
    placeholder.textContent = values[formatIndex] || hex; placeholder.classList.remove('is-value'); placeholder.classList.add('is-color');
    const hueTrack = panel.querySelector<HTMLElement>('.color-demo__hue i');
    const palette = panel.querySelector<HTMLElement>('.color-demo__palette');
    const marker = palette?.querySelector<HTMLElement>('i');
    if (hueTrack) hueTrack.style.left = `${hue / 360 * 100}%`;
    if (palette) palette.style.background = `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(${hue} 100% 50%))`;
    if (marker) { marker.style.left = `${saturation}%`; marker.style.top = `${100-brightness}%`; }
  };
  formatButton.addEventListener('click', (e) => { e.stopPropagation(); formatIndex = (formatIndex + 1) % formats.length; updateColor(); });
  panel.addEventListener('pointerdown', e => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('.color-demo__hue, .color-demo__palette');
    if (!target || mode !== 2) return;
    e.preventDefault(); target.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => { const r=target.getBoundingClientRect(), x=Math.max(0,Math.min(1,(ev.clientX-r.left)/r.width)), y=Math.max(0,Math.min(1,(ev.clientY-r.top)/r.height)); if (target.classList.contains('color-demo__hue')) { hue=x*360; if (saturation < 5) saturation=100; if (brightness < 5) brightness=100; } else { saturation=x*100; brightness=(1-y)*100; } updateColor(); };
    move(e); const onMove=(ev:PointerEvent)=>move(ev); const end=()=>{target.removeEventListener('pointermove',onMove);target.removeEventListener('pointerup',end);target.removeEventListener('pointercancel',end);}; target.addEventListener('pointermove',onMove);target.addEventListener('pointerup',end);target.addEventListener('pointercancel',end);
  });
  let typingTimer: ReturnType<typeof setTimeout> | undefined;
  const recent = [['Лендинг',143,'#3984ff'],['Картье-Брессон',265,'#e746a2'],['Модельное',894,'#f5aa19'],['Семейное',540,'#f5aa19'],['Пенн',270,'#e746a2'],['Дашборд',700,'#3984ff'],['Уличное',922,'#f5aa19'],['Деловое',859,'#f5aa19'],['Мобильное',4,'#3984ff'],['Лейбовиц',323,'#e746a2'],['Арт-фото',512,'#f5aa19'],['Свадебное',504,'#f5aa19'],['Лайн-арт',403,'#39bf78'],['3D-рендер',146,'#39bf78'],['Модалки',530,'#3984ff'],['Изометрия',475,'#39bf78'],['Линдберг',546,'#e746a2'],['Навигация',778,'#3984ff'],['Ретро',203,'#39bf78'],['UI Kit',192,'#3984ff'],['Студийное',723,'#f5aa19'],['Карточки',488,'#3984ff'],['Манн',807,'#e746a2'],['МакКарри',705,'#e746a2'],['Флэт',218,'#39bf78']];
  const matches = [['Контраст',4,'#e6bc25'],['Контровой свет',16,'#eb5059'],['Контурная графика',32,'#61c6a8'],['Концепция',25,'#3984ff'],['Конструкция',12,'#39bf78'],['Конференция',19,'#e746a2'],['Коллаж',83,'#3984ff'],['Композиция',58,'#f5aa19'],['Колористика',44,'#39bf78'],['Комната',24,'#3984ff'],['Кожа',15,'#e746a2'],['Космос',34,'#39bf78'],['Кадр',78,'#f5aa19'],['Керамика',21,'#3984ff'],['Кино',32,'#e746a2'],['Книга',27,'#39bf78']];
  const chips = (items: (string | number)[][], query = '') => items.map(([name,count,color]) => { const text = String(name); const label = query ? `<span class="arc-search-tag-pill__name-match">${text.slice(0,query.length)}</span><span class="arc-search-tag-pill__name-rest">${text.slice(query.length)}</span>` : text; return `<span class="chip arc-search-tag-pill"><span class="chip-color" style="background:${color}"></span><span>${label}</span><span class="chip-count">${count}</span></span>`; }).join('');
  const tagsPanel = (query: string) => `<div class="arc-search-panel-intro"><h3 class="arc-search-panel-mode-header__title">Поиск по категориям и меткам</h3>${query ? '<div class="tags-row arc-search-tags-row">' + chips(matches.slice(0, [0,16,12,6,3][query.length]), query) + '</div>' : '<p class="arc-search-panel-hint">Начните вводить название метки или ID карточки</p>'}</div><hr class="arc-search-panel-fullbleed-sep"><div class="arc-search-panel-section"><div class="arc-search-panel-section__header"><p class="arc-search-panel-section__title">Недавние запросы</p><span class="arc-search-panel-section__clear">Очистить</span></div><div class="tags-row arc-search-tags-row">${chips(recent.slice(0,13))}</div></div>`;
  const startTyping = () => {
    clearTimeout(typingTimer);
    let i = 0;
    const step = () => { if (panel.hidden || mode !== 0) return; const q = 'Конт'.slice(0, i++); if (placeholder) { placeholder.textContent = q || modes[0].placeholder; placeholder.classList.toggle('is-value', Boolean(q)); } panel.innerHTML = tagsPanel(q); if (i <= 4) typingTimer = setTimeout(step, 260); };
    typingTimer = setTimeout(step, 500);
  };
    panel.addEventListener('pointerdown', (event) => {
    const handle = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-crop]');
    const result = panel.querySelector<HTMLElement>('.similar-demo__result');
    const frame = panel.querySelector<HTMLElement>('.similar-demo__crop');
    if (!result || !frame || (!handle && !(event.target as HTMLElement).closest('.similar-demo__crop'))) return;
    event.preventDefault(); const dragTarget = handle || frame; dragTarget.setPointerCapture(event.pointerId);
    const start = { x:event.clientX, y:event.clientY, left:frame.offsetLeft, top:frame.offsetTop, right:frame.offsetLeft+frame.offsetWidth, bottom:frame.offsetTop+frame.offsetHeight };
    const move = (e:PointerEvent) => {
      const rect=result.getBoundingClientRect(), scaleX=result.offsetWidth / rect.width, scaleY=result.offsetHeight / rect.height;
      const dx=(e.clientX-start.x)*scaleX, dy=(e.clientY-start.y)*scaleY, corner=handle?.dataset.crop || ''; if (!handle) { const x=Math.max(0,Math.min(result.clientWidth-(start.right-start.left),start.left+dx)), y=Math.max(0,Math.min(result.clientHeight-(start.bottom-start.top),start.top+dy)); Object.assign(frame.style,{left:String(x)+'px',top:String(y)+'px',width:String(start.right-start.left)+'px',height:String(start.bottom-start.top)+'px',right:'auto',bottom:'auto'}); return; }
      const left=corner.includes('w') ? Math.max(0,Math.min(start.right-40,start.left+dx)) : start.left;
      const right=corner.includes('e') ? Math.min(result.clientWidth,Math.max(start.left+40,start.right+dx)) : start.right;
      const top=corner.includes('n') ? Math.max(0,Math.min(start.bottom-40,start.top+dy)) : start.top;
      const bottom=corner.includes('s') ? Math.min(result.clientHeight,Math.max(start.top+40,start.bottom+dy)) : start.bottom;
      Object.assign(frame.style,{left:`${left}px`,top:`${top}px`,width:`${right-left}px`,height:`${bottom-top}px`,right:'auto',bottom:'auto'});
    };
    const end=()=>{dragTarget.removeEventListener('pointermove',move);dragTarget.removeEventListener('pointerup',end);dragTarget.removeEventListener('pointercancel',end);};
    dragTarget.addEventListener('pointermove',move);dragTarget.addEventListener('pointerup',end);dragTarget.addEventListener('pointercancel',end);
  });
  const close = () => { clearTimeout(typingTimer); if (placeholder && mode !== 2) { placeholder.textContent = modes[mode].placeholder; placeholder.classList.remove('is-value'); } panel.hidden = true; island.setAttribute('aria-expanded','false'); island.classList.remove('is-expanded'); };
  const render = () => {
    buttons.forEach((button, i) => {
      button.classList.toggle('arc-demo__icon--active', i === mode);
      button.setAttribute('aria-pressed', String(i === mode));
      const img = button.querySelector('img');
      if (img && i === 0) img.src = i === mode ? '/images/demo-icons/tag-active.svg' : '/images/demo-icons/tag.svg';
      if (img) img.style.filter = i === mode ? 'brightness(0) saturate(100%) invert(6%) sepia(31%) saturate(1494%) hue-rotate(333deg) brightness(93%)' : '';
    });
    if (placeholder) { placeholder.textContent = modes[mode].placeholder; placeholder.classList.remove('is-value', 'is-color'); }
    formatButton.hidden = swatch.hidden = mode !== 2; if (searchButton) searchButton.hidden = mode === 2;
    panel.innerHTML = mode === 0 ? tagsPanel('') : modes[mode].html; if (mode === 2) updateColor();
  };
  const startAiTyping = () => {
    clearTimeout(typingTimer);
    const query = 'Уютный интерьер в тёплом свете';
    let index = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = () => {
      if (panel.hidden || mode !== 1 || !placeholder) return;
      index = reduced ? query.length : index + 1;
      placeholder.textContent = query.slice(0, index);
      placeholder.classList.add('is-value');
      if (index < query.length) typingTimer = setTimeout(step, 90);
    };
    typingTimer = setTimeout(step, reduced ? 0 : 500);
  };
  const position = () => { panel.style.left = island.offsetLeft + 'px'; panel.style.width = island.offsetWidth + 'px'; const drop = panel.querySelector<HTMLElement>('.similar-demo__drop'); const flight = panel.querySelector<HTMLElement>('.similar-demo__flight .similar-demo__image'); if (drop && flight && drop.clientHeight) flight.style.aspectRatio = String(drop.clientWidth / drop.clientHeight); }; const open = () => { render(); island.classList.add('is-expanded'); panel.hidden = false; island.setAttribute('aria-expanded','true'); position(); if (mode === 0) startTyping(); else if (mode === 1) startAiTyping(); else clearTimeout(typingTimer); }; new ResizeObserver(() => { if (!panel.hidden) position(); }).observe(island);
  buttons.forEach((button, i) => button.addEventListener('click', () => { if (i === mode && !panel.hidden) close(); else { mode = i; open(); } }));
  placeholder?.addEventListener('click', () => panel.hidden ? open() : close());
  searchButton?.addEventListener('click', () => panel.hidden ? open() : close());
  document.addEventListener('pointerdown', (event) => { if (!island.contains(event.target as Node) && !panel.contains(event.target as Node)) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden) { close(); buttons[mode]?.focus(); } });
  island.setAttribute('aria-expanded','false');
  render();
});











