import { useEffect, useRef, useState } from 'react';
import ContextMenuHeader from './arc-context/ContextMenuHeader';
import ContextMenuItem from './arc-context/ContextMenuItem';
import ContextMenuSeparator from './arc-context/ContextMenuSeparator';
type Row = { label:string; icon?:string; selected?:boolean } | { header:string } | { separator:true };
const menus:Record<string,Row[]> = {
  'Сортировка': [{header:'Системные'},...['Дата добавления','Тип файлов','Вес','Разрешение','Длительность','Оценка'].map((label,i)=>({label,selected:i===0})),{separator:true},{label:'Перемешать'},{separator:true},{label:'Сначала новые',selected:true},{label:'Сначала старые'}],
  'Фильтры': [{header:'Системные'},...[['Соотношение сторон','aspect-ratio'],['Тип файла','images'],['Метки','tag'],['Дата добавления','calendar'],['Вес файла','file'],['Разрешение','size'],['Длительность','clock'],['Оценка','star-stroke'],['Аннотации','message']].map(([label,icon])=>({label,icon})),{separator:true},{label:'Настроить список',icon:'adjust-position'},{label:'Пресеты',icon:'save'}],
  'Вид сетки': [{header:'Вид'},{label:'Плитка',icon:'layout-waterfall',selected:true},{label:'Сетка',icon:'layout-grid'},{label:'Строки',icon:'layout-list'},{separator:true},{header:'Размер сетки'},{label:'Большая',icon:'layout-grid'},{label:'Средняя',icon:'grid-medium'},{label:'Маленькая',icon:'grid-small',selected:true}],
  'Меню': [{label:'Категории и метки',icon:'tag'},{label:'Статистика',icon:'pie-chart'},{label:'История',icon:'history'},{label:'Настройки',icon:'options'},{separator:true},{label:'Поиск дублей',icon:'copy'},{label:'Корзина',icon:'trash'},{separator:true},{header:'Оформление'},{label:'Тёмное',icon:'moon',selected:true},{label:'Светлое',icon:'sun-medium'},{label:'Как в системе',icon:'contrast'}]
};
export default function RightMenuDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [open,setOpen] = useState<string|null>(null);
  const [adding,setAdding] = useState(false);
  const [menuLeft,setMenuLeft] = useState(0);
  const timer = useRef<number[]>([]);
  useEffect(()=>{
    const scene=root.current?.closest<HTMLElement>('.arc-demo__surface');
    if(!scene) return;
    const buttons=Array.from(scene.querySelectorAll<HTMLButtonElement>('.arc-demo__actions button'));
    const run=(e:Event)=>{
      const target=e.currentTarget as HTMLButtonElement;
      const label=target.getAttribute('aria-label') || target.textContent?.trim() || '';
      if(label==='Добавить'){
        setOpen(null); timer.current.forEach(clearTimeout); setAdding(false);
        requestAnimationFrame(()=>setAdding(true));
        timer.current.push(window.setTimeout(()=>setAdding(false),5200));
      } else if(menus[label]) { const sceneRect=scene.getBoundingClientRect(); const buttonRect=target.getBoundingClientRect(); const scale=scene.offsetWidth/sceneRect.width; setMenuLeft(Math.max(8,Math.min(scene.offsetWidth-258,(buttonRect.right-sceneRect.left)*scale-250))); setOpen(v=>v===label?null:label); }
    };
    buttons.forEach(button=>button.addEventListener('click',run));
    const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest('.arc-demo__actions'))setOpen(null)};
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(null)};
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);
    return ()=>{buttons.forEach(button=>button.removeEventListener('click',run));document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key);timer.current.forEach(clearTimeout)};
  },[]);
  return <div ref={root} className="right-demo-layer">
    {open && <div className="context-menu context-menu--static panel elevation-raised arc-ui-kit-scope right-demo-menu" role="menu" aria-label={open} style={{left:menuLeft,right:"auto"}}>
      <div className="context-menu__list context-menu__scroll">{menus[open].map((row,i)=>'separator' in row?<ContextMenuSeparator key={i}/>: 'header' in row?<ContextMenuHeader key={i}>{row.header}</ContextMenuHeader>:<ContextMenuItem key={i} label={row.label} selected={row.selected} iconClass={row.icon?'arc-demo-icon arc-demo-icon--'+row.icon:undefined}/>)}</div>
    </div>}
    {adding && <div className="right-demo-import" aria-hidden="true"><div className="right-demo-import__zone"><span>Перетащите файлы в это окно &nbsp;＋</span></div><div className="right-demo-import__card"></div><div className="right-demo-import__cursor"><img src="/images/collect/screenshot-cursor.svg" alt="" /></div><div className="right-demo-import__toast"><span>Файл успешно добавлен</span><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9m0-9l-9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div></div>}
  </div>;
}





