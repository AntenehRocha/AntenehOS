/** Viewer 3D: React Three Fiber y drei solo funcionan en la parte cliente del navegador. */
'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, useGLTF, useProgress } from '@react-three/drei';
import { useEffect, Suspense } from 'react';
import { Mesh, MeshStandardMaterial } from 'three';

/** Carga el archivo GLB recibido y lo centra para que el usuario pueda inspeccionarlo. */
function Model({ src }: { src: string }) {
  // La ruta se pasa desde la ventana activa para reutilizar el mismo visor con cada proyecto.
  const { scene } = useGLTF(src);
  const { gl } = useThree();

  /** Ajusta el filtrado de texturas a la GPU para que sigan definidas en ángulos oblicuos. */
  useEffect(() => {
    const anisotropy = gl.capabilities.getMaxAnisotropy();
    scene.traverse((object) => {
      if (!(object as Mesh).isMesh) return;
      const mesh = object as Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        const texturedMaterial = material as MeshStandardMaterial;
        [texturedMaterial.map, texturedMaterial.normalMap, texturedMaterial.roughnessMap, texturedMaterial.metalnessMap, texturedMaterial.aoMap, texturedMaterial.emissiveMap]
          .filter((texture) => texture !== null)
          .forEach((texture) => { texture.anisotropy = anisotropy; texture.needsUpdate = true; });
      });
    });
  }, [gl, scene]);

  return <Center><primitive object={scene} scale={1.5} /></Center>;
}

/** Muestra el progreso dentro del canvas mientras Three.js descarga el modelo. */
function LoadingModel() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className="model-loading-overlay" role="status"><div className="model-loading"><span className="loading-ring" />CARGANDO MODELO · {Math.round(progress)}%</div></div>;
}

/** Lienzo interactivo reutilizable para cualquier modelo glTF público. */
export default function ModelViewer({ src }: { src: string }) {
  // Esta escena deja mucho aire alrededor de la laptop; un margen menor la presenta a mayor escala.
  const fitMargin = src.includes('gaming_laptop') ? 1.05 : 1.25;
  return (
    <div className="model-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        // Más píxeles internos conservan los bordes y texturas al ampliar el lienzo.
        dpr={[1, 2.25]}
        // Antialiasing suaviza los contornos diagonales de las piezas pequeñas.
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Fondo oscuro integrado en el canvas para evitar un destello blanco al cargar. */}
        <color attach="background" args={['#10181a']} />
        {/* Iluminación ambiental y dos luces direccionales revelan el relieve del hardware. */}
        <ambientLight intensity={1.8} />
        <directionalLight position={[8, 8, 6]} intensity={3} />
        <directionalLight position={[-6, 2, -5]} intensity={1.5} color="#a9ffe7" />
        {/* Bounds ajusta cámara y objetivo según el tamaño real de cada GLB. */}
        <Suspense fallback={null}><Bounds fit clip margin={fitMargin}><Model src={src} /></Bounds></Suspense>
        {/* Controles con amortiguación para girar y acercar el modelo de forma natural. */}
        <OrbitControls enableDamping dampingFactor={0.06} minDistance={2.5} maxDistance={12} />
      </Canvas>
      {/* El indicador DOM evita anidar portales mientras Suspense monta o desmonta el modelo. */}
      <LoadingModel />
    </div>
  );
}

// No se precargan ambos modelos aquí porque ocupan decenas de megabytes entre los dos;
// useGLTF descarga bajo demanda el modelo de la ventana que la persona decide abrir.
