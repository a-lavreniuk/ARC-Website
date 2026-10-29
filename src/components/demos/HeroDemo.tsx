import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

type LibraryMode = 'Библиотека' | 'Коллекции' | 'Мудборд';
type SearchMode = 'Метки' | 'AI-поиск' | 'Пипетка' | 'Похожие изображения';

const libraryModes: LibraryMode[] = ['Библиотека', 'Коллекции', 'Мудборд'];
const searchModes: SearchMode[] = ['Метки', 'AI-поиск', 'Пипетка', 'Похожие изображения'];
const cards = [
  { id: 'portrait', name: 'Портрет в тёплом свете', position: '7% 47%' },
  { id: 'mountain', name: 'Горный пейзаж на закате', position: '25% 48%' },
  { id: 'sculpture', name: 'Скульптура и свет', position: '48% 61%' },
  { id: 'headphones', name: 'Форма наушников', position: '70% 60%' },
  { id: 'architecture', name: 'Тёплая архитектура', position: '91% 50%' },
];

export default function HeroDemo() {
  const [library, setLibrary] = useState<LibraryMode>('Библиотека');
  const [searchMode, setSearchMode] = useState<SearchMode>('Метки');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const selectedCards = cards.filter((card) => selected.includes(card.id));
  const viewerCard = viewerIndex === null ? null : selectedCards[viewerIndex];

  useEffect(() => {
    if (viewerIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setViewerIndex(null);
      if (event.key === 'ArrowRight') setViewerIndex((index) => index === null ? null : (index + 1) % selectedCards.length);
      if (event.key === 'ArrowLeft') setViewerIndex((index) => index === null ? null : (index - 1 + selectedCards.length) % selectedCards.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewerIndex, selectedCards.length]);

  const toggleCard = (id: string) => {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const previewStyle = (cardIndex: number): CSSProperties => ({
    backgroundImage: 'url(/images/arc-hero-demo.png)',
    backgroundPosition: cards[cardIndex]?.position ?? 'center',
  });

  return (
    <section className="demo" aria-label="Интерактивная демонстрация ARC">
      <div className="demo__desktop">
        <div className="demo__canvas">
          <img className="demo__screenshot" src="/images/arc-hero-demo.png" alt="Интерфейс ARC: переключение библиотеки, коллекций и мудборда, поиск и сетка референсов" />
          <div className="demo__hotspots" aria-label="Элементы демонстрации">
            <div className="demo__mode-hotspots" role="group" aria-label="Раздел приложения">
              {libraryModes.map((mode) => (
                <button key={mode} className={library === mode ? 'hotspot hotspot--active' : 'hotspot'} onClick={() => setLibrary(mode)} aria-pressed={library === mode}>{mode}</button>
              ))}
            </div>
            <div className="demo__search-hotspots" role="group" aria-label="Режим поиска">
              {searchModes.map((mode, index) => (
                <button key={mode} className={searchMode === mode ? 'hotspot hotspot--active' : 'hotspot'} style={{ left: `${index * 9.8}%` }} onClick={() => { setSearchMode(mode); setSearchOpen(true); }} aria-label={`Открыть режим: ${mode}`} aria-pressed={searchMode === mode} />
              ))}
              <button className="hotspot demo__search-field" onClick={() => setSearchOpen((open) => !open)} aria-expanded={searchOpen} aria-label="Открыть поиск" />
            </div>
            <div className="demo__card-hotspots" role="group" aria-label="Выбрать референсы">
              {cards.map((card, index) => (
                <button key={card.id} className={selected.includes(card.id) ? 'card-hotspot card-hotspot--selected' : 'card-hotspot'} onClick={() => toggleCard(card.id)} aria-label={`${selected.includes(card.id) ? 'Убрать из выбранного' : 'Выбрать'}: ${card.name}`} aria-pressed={selected.includes(card.id)}>
                  <span>{selected.includes(card.id) ? '✓' : '+'}</span>
                </button>
              ))}
            </div>
          </div>
          {searchOpen && <div className="demo__search-popover" role="dialog" aria-label={`Поиск: ${searchMode}`}>
            <div className="demo__popover-kicker">ПОИСК</div>
            <strong>{searchMode}</strong>
            <p>{searchMode === 'Метки' ? 'Введите тему или выберите метки' : searchMode === 'AI-поиск' ? 'Опишите референс своими словами' : searchMode === 'Пипетка' ? 'Найдите изображения по цвету' : 'Подберите похожие изображения'}</p>
            <div className="demo__chips"><span>тёплый свет</span><span>композиция</span><span>+ ещё режимы</span></div>
            <button onClick={() => setSearchOpen(false)} aria-label="Закрыть панель поиска">Готово</button>
          </div>}
          {selected.length > 0 && <div className="demo__selection" aria-live="polite">
            <span>Выбрано: {selected.length}</span>
            <button onClick={() => setViewerIndex(0)}>Открыть просмотр</button>
            <button className="demo__clear" onClick={() => setSelected([])} aria-label="Снять выбор">×</button>
          </div>}
          <div className={library === "Библиотека" ? "demo__mode-label" : "demo__mode-label is-visible"} aria-live="polite">{library === "Коллекции" ? "Коллекции · подборки по темам" : library === "Мудборд" ? "Мудборд · идеи для проекта" : library}</div>
        </div>
      </div>

      <div className="demo__mobile">
        <div className="mobile-window">
          <div className="mobile-window__top">
            <div className="mobile-window__brand"><img className="mobile-window__mark" src="/images/arc-logo.svg" alt="" /><span>ARC</span></div>
            <span className="mobile-window__count">1 248 референсов</span>
          </div>
          <div className="mobile-window__tabs" role="group" aria-label="Раздел приложения">
            {libraryModes.map((mode) => <button key={mode} className={library === mode ? 'mobile-tab is-active' : 'mobile-tab'} onClick={() => setLibrary(mode)} aria-pressed={library === mode}>{mode}</button>)}
          </div>
          <button className="mobile-window__search" onClick={() => setSearchOpen((open) => !open)} aria-expanded={searchOpen}>
            <span className="search-symbol" aria-hidden="true">⌕</span>
            <span>{searchMode === 'Метки' ? 'Найти в библиотеке' : searchMode}</span>
            <span className="search-hint">Ctrl K</span>
          </button>
          {searchOpen && <div className="mobile-search-panel" role="group" aria-label="Режим поиска">
            {searchModes.map((mode) => <button key={mode} className={searchMode === mode ? 'mobile-search-mode is-active' : 'mobile-search-mode'} onClick={() => setSearchMode(mode)}>{mode}</button>)}
            <p>{searchMode === 'Метки' ? 'Введите тему или выберите метки' : searchMode === 'AI-поиск' ? 'Опишите референс своими словами' : searchMode === 'Пипетка' ? 'Найдите изображения по цвету' : 'Подберите похожие изображения'}</p>
          </div>}
          <div className="mobile-window__collection"><span>{library === 'Мудборд' ? 'Идеи для проекта' : library === 'Коллекции' ? 'Подборки' : 'Все референсы'}</span><span className="mobile-window__dots">•••</span></div>
          <div className="mobile-gallery" role="group" aria-label="Выберите изображения">
            {cards.slice(0, 4).map((card, index) => <button key={card.id} className={selected.includes(card.id) ? 'mobile-card is-selected' : 'mobile-card'} style={previewStyle(index)} onClick={() => toggleCard(card.id)} aria-label={`${selected.includes(card.id) ? 'Убрать из выбранного' : 'Выбрать'}: ${card.name}`} aria-pressed={selected.includes(card.id)}><span>{selected.includes(card.id) ? '✓' : '+'}</span></button>)}
          </div>
          {selected.length > 0 && <div className="mobile-window__selection" aria-live="polite"><span>Выбрано {selected.length}</span><button onClick={() => setViewerIndex(0)}>Открыть просмотр</button></div>}
        </div>
        <p className="demo__mobile-hint">Переключайте разделы и выбирайте карточки — демо адаптируется под экран</p>
      </div>

      {viewerCard && <div className="viewer" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setViewerIndex(null); }}>
        <div className="viewer__dialog" role="dialog" aria-modal="true" aria-label="Просмотр выбранных референсов">
          <button className="viewer__close" onClick={() => setViewerIndex(null)} aria-label="Закрыть просмотр">×</button>
          <div className="viewer__image" style={previewStyle(viewerIndex ?? 0)} />
          <div className="viewer__footer"><button onClick={() => setViewerIndex((index) => index === null ? null : (index - 1 + selectedCards.length) % selectedCards.length)} aria-label="Предыдущая карточка">←</button><span>{viewerCard.name}<small>{(viewerIndex ?? 0) + 1} / {selectedCards.length}</small></span><button onClick={() => setViewerIndex((index) => index === null ? null : (index + 1) % selectedCards.length)} aria-label="Следующая карточка">→</button></div>
        </div>
      </div>}
    </section>
  );
}




