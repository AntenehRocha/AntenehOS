'use client';

/** Portfolio AntenehOS: escritorio interactivo que presenta la identidad y proyectos de Anteneh. */
import { useEffect, useState } from 'react';
import ModelViewer from '../components/ModelViewer';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Aperture, Battery, Bell, CodeXml, Cpu, Download, Globe2, Laptop, LayoutGrid, Maximize2, Minus, MoreHorizontal, MousePointer2, Signal, Sparkles, Wifi, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

/** Identificadores de los dos proyectos y la ventana personal del portfolio. */
type AppId = 'motherboard' | 'laptop' | 'about';

/** Metadatos reutilizados para que el menú, el dock y las ventanas compartan iconos y títulos. */
const appInfo: Record<AppId, { title: string; icon: typeof Cpu; tint: string }> = {
  motherboard: { title: 'Proyecto 01 · Placa base 3D', icon: Cpu, tint: 'mint' },
  laptop: { title: 'Proyecto 02 · Gaming laptop', icon: Laptop, tint: 'amber' },
  about: { title: 'Acerca de Anteneh', icon: Aperture, tint: 'violet' },
};

/** Página interactiva; necesita estado del navegador para el reloj y las ventanas. */
export default function Page() {
  const [openApp, setOpenApp] = useState<AppId | null>('motherboard');
  const [isMaximized, setIsMaximized] = useState(false);
  const [time, setTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  /** Actualiza la hora local cada 30 segundos y limpia el intervalo al desmontar. */
  useEffect(() => {
    const updateClock = () => setTime(new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  /** Abre la aplicación solicitada y cierra el menú lanzador. */
  function launchApp(id: AppId) { setOpenApp(id); setIsMaximized(false); setMenuOpen(false); }

  return (
    <main className="os-shell">
      {/* Luces ambientales para que el fondo tenga profundidad sin imágenes externas. */}
      <motion.div className="wallpaper-glow glow-one" aria-hidden="true" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.14, scale: 1 }} transition={{ duration: 1.2 }} /><motion.div className="wallpaper-glow glow-two" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 0.11 }} transition={{ duration: 1.4, delay: 0.2 }} />
      {/* Barra superior con marca, navegación y estado ficticio del escritorio. */}
      <motion.header className="topbar" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
        <motion.button className="brand-mark" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)} whileHover={{ rotate: 45, scale: 1.08 }} whileTap={{ scale: 0.92 }}><Aperture size={17} /></motion.button>
        <span className="topbar-name">Anteneh<span>OS</span></span><div className="topbar-divider" aria-hidden="true" />
        <button className="topbar-link" onClick={() => launchApp('about')}>Portfolio</button><span className="topbar-spacer" />
        <div className="system-status" aria-label="Conexión y batería"><Wifi size={14} /><Signal size={14} /><Battery size={16} /><span>100%</span></div>
        <button className="notification-button" aria-label="Notificaciones"><Bell size={15} /><i /></button><time className="system-clock">{time || '09:41'}</time>
      </motion.header>

      {/* Lanzador con los dos proyectos 3D y la ventana de presentación personal. */}
      {menuOpen && <div className="launcher-menu"><p className="launcher-caption">EN ESTE ESCRITORIO</p>{(Object.keys(appInfo) as AppId[]).map((id) => { const Icon = appInfo[id].icon; return <button key={id} className="launcher-item" onClick={() => launchApp(id)}><span className={`app-icon ${appInfo[id].tint}`}><Icon size={17} /></span>{appInfo[id].title}</button>; })}</div>}

      <section className="desktop-content">
        {/* Presentación breve que explica quién eres y qué haces. */}
        <motion.div className="desktop-intro" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.12, ease: 'easeOut' }}>
          <div className="date-chip"><span className="live-dot" /> DESARROLLADOR WEB <span className="chip-slash">/</span> PORTFOLIO</div>
          <h1>Hola, soy <span>Anteneh.</span></h1>
          <p>Desarrollador web creando experiencias digitales<br />con curiosidad, código y un toque personal.</p>
          <Button className="intro-button" variant="outline" size="sm" onClick={() => launchApp('about')}>Conóceme <span aria-hidden="true">↗</span></Button>
          {/* Descarga el borrador de currículum editable que vive en la carpeta pública. */}
          <a className="cv-link" href="/cv.txt" download="Anteneh-CV-borrador.txt" aria-label="Descargar plantilla editable del currículum"><Download size={14} /> Descargar plantilla de CV <span aria-hidden="true">↓</span></a>
        </motion.div>

        {/* Accesos de escritorio para los dos proyectos 3D que ya existen en public/. */}
        <div className="desktop-icons" aria-label="Proyectos del portfolio">
          <motion.button className="desktop-icon" onClick={() => launchApp('motherboard')} whileHover={{ y: -4, scale: 1.04 }} whileTap={{ scale: 0.97 }}><span className="app-icon mint"><Cpu size={21} strokeWidth={1.8} /></span><span>Placa base 3D</span></motion.button>
          <motion.button className="desktop-icon" onClick={() => launchApp('laptop')} whileHover={{ y: -4, scale: 1.04 }} whileTap={{ scale: 0.97 }}><span className="app-icon amber"><Laptop size={21} strokeWidth={1.8} /></span><span>Gaming laptop</span></motion.button>
        </div>

        {/* Ventana del modelo 3D o del perfil, según la aplicación activa. */}
        <AnimatePresence mode="wait">
        {openApp && <motion.section key={openApp} className={`app-window ${openApp !== 'about' ? 'model-window' : 'compact-window'} ${openApp === 'laptop' ? 'laptop-window' : ''} ${isMaximized ? 'is-maximized' : ''}`} aria-label={appInfo[openApp].title} initial={{ opacity: 0, y: 24, scale: 0.985, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, y: 12, scale: 0.99, filter: 'blur(5px)' }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} layout>
          <div className="window-titlebar">
            <div className="window-controls" aria-label="Controles de ventana"><button aria-label="Cerrar ventana" onClick={() => setOpenApp(null)}><X size={11} /></button><button aria-label="Minimizar ventana" onClick={() => setOpenApp(null)}><Minus size={11} /></button><button aria-label={isMaximized ? 'Restaurar ventana' : 'Ampliar ventana'} onClick={() => setIsMaximized(!isMaximized)}><Maximize2 size={9} /></button></div>
            <div className="window-title"><span className="window-title-icon">{(() => { const Icon = appInfo[openApp].icon; return <Icon size={13} />; })()}</span>{appInfo[openApp].title}</div>
            <button className="window-more" aria-label="Más opciones"><MoreHorizontal size={17} /></button>
          </div>
          {openApp !== 'about' && <div className="model-app-content">
            <div className="model-copy"><div className="eyebrow"><span className="live-dot" /> PROYECTO DESTACADO <span className="eyebrow-id">{openApp === 'laptop' ? '#002' : '#001'}</span></div>
              {openApp === 'laptop' ? <><h2>Gaming,<br /><em>sin límites.</em></h2><p>Una laptop gaming en 3D. Explora su diseño y mírala desde todos los ángulos.</p></> : <><h2>Hardware,<br /><em>en otra dimensión.</em></h2><p>Una placa base vista desde dentro. Gírala, acércate y descubre cada detalle de este experimento 3D.</p></>}
              {openApp === 'motherboard' && <><div className="model-tags"><Badge variant="outline"><Cpu size={12} /> 3D / WEBGL</Badge><Badge variant="outline"><MousePointer2 size={12} /> INTERACTIVO</Badge></div><Button className="project-button" size="sm" onClick={() => launchApp('laptop')}>Siguiente proyecto <span aria-hidden="true">↗</span></Button></>}
              {openApp === 'laptop' && <><div className="model-tags"><Badge variant="outline"><Laptop size={12} /> GAMING</Badge><Badge variant="outline"><MousePointer2 size={12} /> INTERACTIVO</Badge></div><Button className="project-button" size="sm" onClick={() => launchApp('motherboard')}>Ver placa base <span aria-hidden="true">↗</span></Button></>}
            </div>
            <div className="viewer-frame"><div className="viewer-label"><span>RENDER EN TIEMPO REAL</span><span className="viewer-dot" /><span>WEBGL</span></div><ModelViewer key={openApp} src={openApp === 'laptop' ? '/gaming_laptop.glb' : '/motherboard__components.glb'} /><div className="viewer-hint">ARRASTRA PARA ROTAR <span>·</span> RUEDA PARA ZOOM</div></div>
            <div className="window-status"><span><span className="status-dot" /> EXPERIENCIA LISTA</span><span>MODELO GLB · 3D</span><span>{openApp === 'laptop' ? 'PROYECTO 02' : 'PROYECTO 01'}</span></div>
          </div>}
          {openApp === 'about' && <div className="simple-app-content"><div className="eyebrow"><span className="live-dot" /> UN POCO SOBRE MÍ</div><h2>Diseño y código,<br /><em>con curiosidad.</em></h2><p>Soy Anteneh, desarrollador web. Me gusta crear experiencias digitales con personalidad, explorar nuevas tecnologías y cuidar tanto el funcionamiento como los detalles visuales.</p><div className="about-links"><Badge variant="outline"><CodeXml size={14} /> DESARROLLO WEB</Badge><Badge variant="outline"><Globe2 size={14} /> PORTFOLIO</Badge></div><Button className="project-button" variant="outline" size="sm" onClick={() => launchApp('motherboard')}>Ver mis proyectos <span aria-hidden="true">↗</span></Button></div>}
        </motion.section>}
        </AnimatePresence>

        {/* Mensaje alternativo útil cuando la ventana activa se cierra. */}
        {!openApp && <div className="empty-desktop"><Sparkles size={22} /><p>Mis proyectos siguen aquí cuando quieras volver.</p><Button variant="outline" size="sm" onClick={() => launchApp('motherboard')}>Abrir Proyecto 01 <span aria-hidden="true">↗</span></Button></div>}
        <div className="desktop-note"><span>HECHO CON CURIOSIDAD</span><span>GALICIA <span className="note-separator">·</span> ESPAÑA</span></div>
      </section>

      {/* Dock persistente con acceso rápido a las dos ventanas disponibles. */}
      <motion.nav className="dock" aria-label="Barra de aplicaciones" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.28 }}><button className="dock-launcher" aria-label="Abrir menú de aplicaciones" onClick={() => setMenuOpen(!menuOpen)}><LayoutGrid size={19} /></button><span className="dock-separator" aria-hidden="true" />{(Object.keys(appInfo) as AppId[]).map((id) => { const Icon = appInfo[id].icon; return <motion.button key={id} className={`dock-app ${openApp === id ? 'is-open' : ''}`} aria-label={appInfo[id].title} onClick={() => launchApp(id)} whileHover={{ y: -4, scale: 1.08 }} whileTap={{ scale: 0.94 }}><Icon size={19} /><i /></motion.button>; })}</motion.nav>
      <div className="desktop-corner"><span>●</span> PORTFOLIO EN LÍNEA</div>
    </main>
  );
}
