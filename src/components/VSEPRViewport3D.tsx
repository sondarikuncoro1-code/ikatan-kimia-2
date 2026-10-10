import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  CENTRAL_ATOMS,
  LIGAND_ATOMS,
  computeTargetDomainVectors,
  getVSEPRGeometry,
  DomainVector3D,
} from '../data/vseprData';
import {
  RotateCcw,
  Eye,
  Zap,
  Compass,
  Maximize2,
  Sun,
  Moon,
  Pause,
  Play,
  Layers,
} from 'lucide-react';

interface VSEPRViewport3DProps {
  centralAtomSymbol: string;
  ligandSymbol: 'H' | 'F' | 'Cl' | 'O';
  bondOrder: 1 | 2;
  xCount: number;
  eCount: number;
  showRepulsion: boolean;
  showBondAngle: boolean;
  autoRotate: boolean;
  onToggleRepulsion: () => void;
  onToggleBondAngle: () => void;
  onToggleAutoRotate: () => void;
  onDropDomain: (type: 'X' | 'E') => void;
}

interface ProjectedLabel {
  id: string;
  text: string;
  subtext?: string;
  x: number;
  y: number;
  visible: boolean;
  kind: 'central' | 'X' | 'E' | 'angle' | 'repulsion';
  repulsionTier?: 'PEB-PEB' | 'PEB-PEI' | 'PEI-PEI';
}

export const VSEPRViewport3D: React.FC<VSEPRViewport3DProps> = ({
  centralAtomSymbol,
  ligandSymbol,
  bondOrder,
  xCount,
  eCount,
  showRepulsion,
  showBondAngle,
  autoRotate,
  onToggleRepulsion,
  onToggleBondAngle,
  onToggleAutoRotate,
  onDropDomain,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [darkStage, setDarkStage] = useState<boolean>(true);
  const [renderMode, setRenderMode] = useState<'3d' | '2d'>('3d');
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [projectedLabels, setProjectedLabels] = useState<ProjectedLabel[]>([]);
  const [cameraZoom, setCameraZoom] = useState<number>(6.2);

  // Rotation state shared by both 3D camera orbit and 2D interactive vector projection
  const orbitRef = useRef<{ theta: number; phi: number; isDragging: boolean; lastX: number; lastY: number }>({
    theta: 0.45,
    phi: 1.22,
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  // Animated domain vectors ref for smooth VSEPR repulsion relaxation
  const animatedVectorsRef = useRef<DomainVector3D[]>(computeTargetDomainVectors(xCount, eCount));
  const targetVectorsRef = useRef<DomainVector3D[]>(computeTargetDomainVectors(xCount, eCount));

  const centralAtom = CENTRAL_ATOMS.find((a) => a.symbol === centralAtomSymbol) || CENTRAL_ATOMS[0];
  const ligandAtom = LIGAND_ATOMS[ligandSymbol] || LIGAND_ATOMS.H;
  const geometryInfo = getVSEPRGeometry(xCount, eCount);

  // Update target vectors whenever xCount or eCount changes
  useEffect(() => {
    const nextTargets = computeTargetDomainVectors(xCount, eCount);
    targetVectorsRef.current = nextTargets;

    // Match existing animated vectors or spawn new ones near the top/side so user sees repulsion push
    const prev = animatedVectorsRef.current;
    const synced: DomainVector3D[] = nextTargets.map((target, idx) => {
      const existing = prev.find((p) => p.id === target.id) || prev[idx];
      if (existing) {
        return { ...target, x: existing.x, y: existing.y, z: existing.z };
      }
      // Spawn slightly offset so it visibly pushes other domains into equilibrium
      return {
        ...target,
        x: target.x * 0.3 + 0.15,
        y: target.y * 0.3 + 0.85,
        z: target.z * 0.3 + 0.15,
      };
    });
    animatedVectorsRef.current = synced;
  }, [xCount, eCount]);

  const handleResetCamera = useCallback(() => {
    orbitRef.current.theta = 0.45;
    orbitRef.current.phi = 1.22;
    setCameraZoom(6.2);
  }, []);

  // Main Three.js WebGL lifecycle
  useEffect(() => {
    if (renderMode !== '3d') return;
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setWebglSupported(false);
      setRenderMode('2d');
      return;
    }

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 520;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Clear previous canvas if any
    container.innerHTML = '';
    const canvas = renderer.domElement;
    canvas.className = 'w-full h-full block cursor-grab active:cursor-grabbing focus:outline-none';
    container.appendChild(canvas);

    // WebGL context loss listeners (per 5_threejs_3d_spatial.md)
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglSupported(false);
      setRenderMode('2d');
    };
    canvas.addEventListener('webglcontextlost', onContextLost, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(darkStage ? '#0B1120' : '#F1F5F9');

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);

    // Three-point studio lighting
    const ambientLight = new THREE.AmbientLight(darkStage ? 0xdbeafe : 0xffffff, darkStage ? 0.75 : 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.35);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
    fillLight.position.set(-7, -4, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
    rimLight.position.set(0, 5, -8);
    scene.add(rimLight);

    // Subtle reference equatorial ring to help spatial depth perception
    const ringGeo = new THREE.RingGeometry(2.35, 2.38, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: darkStage ? 0x1e293b : 0xcbd5e1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const refRing = new THREE.Mesh(ringGeo, ringMat);
    refRing.rotation.x = Math.PI / 2;
    scene.add(refRing);

    const moleculeGroup = new THREE.Group();
    scene.add(moleculeGroup);

    const repulsionGroup = new THREE.Group();
    scene.add(repulsionGroup);

    const angleArcGroup = new THREE.Group();
    scene.add(angleArcGroup);

    // Build molecule meshes dynamically inside animation loop based on interpolated domain vectors
    const sphereGeo = new THREE.SphereGeometry(1, 36, 36);
    const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 24);

    // Central atom mesh
    const centralMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(centralAtom.colorHex),
      roughness: 0.25,
      metalness: 0.15,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });
    const centralMesh = new THREE.Mesh(sphereGeo, centralMat);
    const centralRadius = 0.52 * centralAtom.radiusScale;
    centralMesh.scale.setScalar(centralRadius);
    moleculeGroup.add(centralMesh);

    let animFrameId = 0;
    let clock = new THREE.Clock();

    const updateSceneAndRender = () => {
      const elapsed = clock.getElapsedTime();

      // Auto-rotate if enabled and not dragging
      if (autoRotate && !orbitRef.current.isDragging) {
        orbitRef.current.theta += 0.0065;
      }

      // Smoothly interpolate animatedVectorsRef towards targetVectorsRef (VSEPR energy minimization relaxation)
      const currentVectors = animatedVectorsRef.current;
      const targetVectors = targetVectorsRef.current;

      for (let i = 0; i < currentVectors.length; i++) {
        const cur = currentVectors[i];
        const tgt = targetVectors[i];
        if (!tgt) continue;
        cur.x += (tgt.x - cur.x) * 0.14;
        cur.y += (tgt.y - cur.y) * 0.14;
        cur.z += (tgt.z - cur.z) * 0.14;
        // Normalize onto unit sphere
        const len = Math.sqrt(cur.x * cur.x + cur.y * cur.y + cur.z * cur.z) || 1;
        cur.x /= len;
        cur.y /= len;
        cur.z /= len;
      }

      // Position camera on spherical orbit
      const r = cameraZoom;
      const phi = Math.max(0.2, Math.min(Math.PI - 0.2, orbitRef.current.phi));
      const theta = orbitRef.current.theta;
      camera.position.set(
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(0, 0, 0);

      // Rebuild dynamic domain meshes cleanly
      while (moleculeGroup.children.length > 1) {
        const child = moleculeGroup.children[moleculeGroup.children.length - 1];
        moleculeGroup.remove(child);
      }
      while (repulsionGroup.children.length > 0) {
        repulsionGroup.remove(repulsionGroup.children[0]);
      }
      while (angleArcGroup.children.length > 0) {
        angleArcGroup.remove(angleArcGroup.children[0]);
      }

      const bondLength = 2.05;
      const lonePairDistance = 1.42;

      const xDomains: { vec: THREE.Vector3; id: string; index: number }[] = [];
      const allDomains3D: { vec: THREE.Vector3; type: 'X' | 'E'; id: string; index: number }[] = [];

      currentVectors.forEach((d) => {
        const dir = new THREE.Vector3(d.x, d.y, d.z).normalize();
        allDomains3D.push({ vec: dir, type: d.type, id: d.id, index: d.index });

        if (d.type === 'X') {
          xDomains.push({ vec: dir, id: d.id, index: d.index });
          const endPos = dir.clone().multiplyScalar(bondLength);

          // Bond cylinder(s)
          const bondMat = new THREE.MeshStandardMaterial({
            color: darkStage ? 0x94a3b8 : 0x64748b,
            roughness: 0.35,
            metalness: 0.25,
          });

          const up = new THREE.Vector3(0, 1, 0);
          const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

          if (bondOrder === 2) {
            // Double bond parallel cylinders
            const perp = new THREE.Vector3(dir.y, -dir.x, 0);
            if (perp.lengthSq() < 0.001) perp.set(0, dir.z, -dir.y);
            perp.normalize().multiplyScalar(0.11);

            [-1, 1].forEach((sign) => {
              const cyl = new THREE.Mesh(cylinderGeo, bondMat);
              cyl.scale.set(0.065, bondLength, 0.065);
              cyl.position.copy(dir.clone().multiplyScalar(bondLength * 0.5)).add(perp.clone().multiplyScalar(sign));
              cyl.quaternion.copy(quat);
              moleculeGroup.add(cyl);
            });
          } else {
            const cyl = new THREE.Mesh(cylinderGeo, bondMat);
            cyl.scale.set(0.095, bondLength, 0.095);
            cyl.position.copy(dir.clone().multiplyScalar(bondLength * 0.5));
            cyl.quaternion.copy(quat);
            moleculeGroup.add(cyl);
          }

          // Terminal atom X sphere
          const ligMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(ligandAtom.colorHex),
            roughness: 0.2,
            metalness: 0.1,
            clearcoat: 0.5,
          });
          const ligMesh = new THREE.Mesh(sphereGeo, ligMat);
          ligMesh.scale.setScalar(ligandAtom.radius);
          ligMesh.position.copy(endPos);
          moleculeGroup.add(ligMesh);
        } else {
          // PEB (E): Pear-shaped balloon electron cloud + 2 paired electrons inside
          const up = new THREE.Vector3(0, 1, 0);
          const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

          const pulseScale = 1 + Math.sin(elapsed * 3.2 + d.index) * 0.035;

          // Translucent orbital balloon lobe
          const lobeMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#F59E0B'),
            emissive: new THREE.Color('#D97706'),
            emissiveIntensity: darkStage ? 0.28 : 0.15,
            transparent: true,
            opacity: darkStage ? 0.46 : 0.52,
            roughness: 0.15,
            transmission: 0.3,
          });
          const lobeMesh = new THREE.Mesh(sphereGeo, lobeMat);
          lobeMesh.scale.set(0.54 * pulseScale, 0.78 * pulseScale, 0.54 * pulseScale);
          lobeMesh.position.copy(dir.clone().multiplyScalar(lonePairDistance * 0.82));
          lobeMesh.quaternion.copy(quat);
          moleculeGroup.add(lobeMesh);

          // Stem cone connecting central atom to lone pair cloud
          const stemMat = new THREE.MeshBasicMaterial({
            color: 0xfbbf24,
            transparent: true,
            opacity: 0.28,
          });
          const stemMesh = new THREE.Mesh(cylinderGeo, stemMat);
          stemMesh.scale.set(0.18, lonePairDistance * 0.6, 0.18);
          stemMesh.position.copy(dir.clone().multiplyScalar(lonePairDistance * 0.4));
          stemMesh.quaternion.copy(quat);
          moleculeGroup.add(stemMesh);

          // Two glowing electron dots inside the PEB balloon
          const perp = new THREE.Vector3(dir.y, -dir.x, 0);
          if (perp.lengthSq() < 0.001) perp.set(0, dir.z, -dir.y);
          perp.normalize().multiplyScalar(0.18);

          const eDotMat = new THREE.MeshBasicMaterial({
            color: 0xfef08a,
          });
          [-1, 1].forEach((sign) => {
            const dot = new THREE.Mesh(sphereGeo, eDotMat);
            dot.scale.setScalar(0.09);
            dot.position
              .copy(dir.clone().multiplyScalar(lonePairDistance * 0.88))
              .add(perp.clone().multiplyScalar(sign));
            moleculeGroup.add(dot);
          });
        }
      });

      const newLabels: ProjectedLabel[] = [];

      // Helper to project 3D point to 2D container coordinates
      const projectToScreen = (pt: THREE.Vector3) => {
        const cloned = pt.clone().project(camera);
        const w = container.clientWidth || width;
        const h = container.clientHeight || height;
        return {
          x: (cloned.x * 0.5 + 0.5) * w,
          y: (-cloned.y * 0.5 + 0.5) * h,
          visible: cloned.z < 1,
        };
      };

      // Central atom label
      const centerProj = projectToScreen(new THREE.Vector3(0, 0, 0));
      newLabels.push({
        id: 'central-A',
        text: centralAtom.symbol,
        x: centerProj.x,
        y: centerProj.y,
        visible: centerProj.visible,
        kind: 'central',
      });

      // Domain labels
      allDomains3D.forEach((d) => {
        const dist = d.type === 'X' ? bondLength : lonePairDistance * 0.92;
        const pt = d.vec.clone().multiplyScalar(dist);
        const proj = projectToScreen(pt);
        newLabels.push({
          id: d.id,
          text: d.type === 'X' ? `${ligandAtom.symbol}` : 'PEB (E)',
          subtext: d.type === 'E' ? 'e⁻ e⁻' : undefined,
          x: proj.x,
          y: proj.y,
          visible: proj.visible,
          kind: d.type,
        });
      });

      // Bond Angle Arc between first two X domains
      if (showBondAngle && xDomains.length >= 2) {
        const v1 = xDomains[0].vec.clone().normalize();
        const v2 = xDomains[1].vec.clone().normalize();
        const arcRadius = 1.08;
        const arcPoints: THREE.Vector3[] = [];
        const segments = 28;

        for (let s = 0; s <= segments; s++) {
          const t = s / segments;
          // Spherical interpolation along arc
          const interp = new THREE.Vector3().lerpVectors(v1, v2, t);
          if (interp.lengthSq() < 0.001) {
            // 180 degree linear fallback normal
            interp.set(0, 1, 0);
          }
          interp.normalize().multiplyScalar(arcRadius);
          arcPoints.push(interp);
        }

        const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
        const arcMat = new THREE.LineBasicMaterial({
          color: darkStage ? 0x38bdf8 : 0x0284c7,
          linewidth: 2,
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        angleArcGroup.add(arcLine);

        const midArc = arcPoints[Math.floor(segments / 2)].clone().multiplyScalar(1.18);
        const midProj = projectToScreen(midArc);
        newLabels.push({
          id: 'bond-angle-readout',
          text: `${geometryInfo.primaryAngleDeg.toFixed(1)}°`,
          x: midProj.x,
          y: midProj.y,
          visible: midProj.visible,
          kind: 'angle',
        });
      }

      // Repulsion Visualizer: Dashed 3D force lines between adjacent domains
      if (showRepulsion && allDomains3D.length >= 2) {
        let strongestLabelAdded = false;

        for (let i = 0; i < allDomains3D.length; i++) {
          for (let j = i + 1; j < allDomains3D.length; j++) {
            const d1 = allDomains3D[i];
            const d2 = allDomains3D[j];
            const angleRad = d1.vec.angleTo(d2.vec);

            // Only show repulsion lines for neighboring domains (< 135° or if totalDomains === 2)
            if (angleRad > 2.4 && allDomains3D.length > 2) continue;

            const tier: 'PEB-PEB' | 'PEB-PEI' | 'PEI-PEI' =
              d1.type === 'E' && d2.type === 'E'
                ? 'PEB-PEB'
                : d1.type === 'E' || d2.type === 'E'
                ? 'PEB-PEI'
                : 'PEI-PEI';

            const colorHex =
              tier === 'PEB-PEB' ? 0xef4444 : tier === 'PEB-PEI' ? 0xf59e0b : 0x38bdf8;

            const p1 = d1.vec.clone().multiplyScalar(d1.type === 'E' ? 1.25 : 1.55);
            const p2 = d2.vec.clone().multiplyScalar(d2.type === 'E' ? 1.25 : 1.55);

            // Slight outward curve for repulsion force line
            const mid = p1.clone().add(p2).multiplyScalar(0.5);
            if (mid.lengthSq() < 0.01) mid.set(0, 1.2, 0);
            else mid.normalize().multiplyScalar(1.48);

            const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
            const curvePts = curve.getPoints(24);
            const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePts);

            const dashSize = tier === 'PEB-PEB' ? 0.14 : tier === 'PEB-PEI' ? 0.12 : 0.09;
            const lineMat = new THREE.LineDashedMaterial({
              color: colorHex,
              dashSize,
              gapSize: 0.08,
              transparent: true,
              opacity: tier === 'PEB-PEB' ? 0.95 : tier === 'PEB-PEI' ? 0.85 : 0.55,
            });
            const repLine = new THREE.Line(lineGeo, lineMat);
            repLine.computeLineDistances();
            repulsionGroup.add(repLine);

            // Add floating repulsion badge on the most prominent interaction
            if (!strongestLabelAdded && (tier === 'PEB-PEB' || tier === 'PEB-PEI' || eCount === 0)) {
              strongestLabelAdded = true;
              const repProj = projectToScreen(mid);
              newLabels.push({
                id: `rep-${i}-${j}`,
                text:
                  tier === 'PEB-PEB'
                    ? 'Tolakan Kuat (PEB–PEB)'
                    : tier === 'PEB-PEI'
                    ? 'Tolakan Sedang (PEB–PEI)'
                    : 'Tolakan Seimbang (PEI–PEI)',
                x: repProj.x,
                y: repProj.y,
                visible: repProj.visible,
                kind: 'repulsion',
                repulsionTier: tier,
              });
            }
          }
        }
      }

      setProjectedLabels(newLabels);
      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(updateSceneAndRender);
    };

    animFrameId = requestAnimationFrame(updateSceneAndRender);

    // Pointer / Touch Orbit handlers
    const onPointerDown = (e: PointerEvent) => {
      orbitRef.current.isDragging = true;
      orbitRef.current.lastX = e.clientX;
      orbitRef.current.lastY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!orbitRef.current.isDragging) return;
      const dx = e.clientX - orbitRef.current.lastX;
      const dy = e.clientY - orbitRef.current.lastY;
      orbitRef.current.lastX = e.clientX;
      orbitRef.current.lastY = e.clientY;
      orbitRef.current.theta -= dx * 0.008;
      orbitRef.current.phi = Math.max(0.2, Math.min(Math.PI - 0.2, orbitRef.current.phi - dy * 0.008));
    };

    const onPointerUp = () => {
      orbitRef.current.isDragging = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [
    renderMode,
    darkStage,
    centralAtom,
    ligandAtom,
    bondOrder,
    showRepulsion,
    showBondAngle,
    autoRotate,
    cameraZoom,
    geometryInfo.primaryAngleDeg,
    eCount,
  ]);

  // Drag-and-drop handlers for dropping PEI (X) or PEB (E) directly onto the 3D stage
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const domainType = e.dataTransfer.getData('text/plain');
    if (domainType === 'X' || domainType === 'E') {
      onDropDomain(domainType);
    }
  };

  // Interactive 2D SVG Vector Projection (when renderMode === '2d' or WebGL fallback)
  const targetDomains = computeTargetDomainVectors(xCount, eCount);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-[500px] lg:h-[580px] rounded-xl overflow-hidden border transition-colors select-none ${
        darkStage
          ? 'bg-[#0B1120] border-slate-800 text-slate-100'
          : 'bg-[#F1F5F9] border-slate-200 text-slate-900'
      } ${isDragOver ? 'ring-2 ring-[#0284C7] ring-offset-2' : ''}`}
    >
      {/* Top-Left Floating HUD: Live VSEPR Telemetry */}
      <div
        className={`absolute top-4 left-4 z-10 pointer-events-auto rounded-lg px-3.5 py-2.5 border backdrop-blur-md ${
          darkStage
            ? 'bg-slate-900/80 border-slate-700/80 text-slate-100'
            : 'bg-white/90 border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="font-mono font-semibold text-sm text-[#38BDF8]">
            {geometryInfo.displayNotation}
          </span>
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <span>{geometryInfo.molecularShape}</span>
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <span className="font-mono tabular-nums font-semibold text-amber-400">
            {geometryInfo.primaryAngleDeg.toFixed(1)}°
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] opacity-75">
          <span>Domain Total: {geometryInfo.totalDomains}</span>
          <span aria-hidden="true">·</span>
          <span>Geometri Dasar: {geometryInfo.domainGeometry}</span>
          <span aria-hidden="true">·</span>
          <span>Sifat: {geometryInfo.polarity}</span>
        </div>
      </div>

      {/* Top-Right Floating Camera & Stage Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={onToggleAutoRotate}
          title={autoRotate ? 'Hentikan Putaran Otomatis' : 'Putar Otomatis 360°'}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            darkStage
              ? 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800'
              : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{autoRotate ? 'Putar: Aktif' : 'Putar 360°'}</span>
        </button>

        {webglSupported && (
          <button
            type="button"
            onClick={() => setRenderMode((m) => (m === '3d' ? '2d' : '3d'))}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              darkStage
                ? 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{renderMode === '3d' ? 'Mode: 3D Ruang' : 'Mode: Vektor 2D'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setDarkStage((d) => !d)}
          title="Ubah Latar Panggung 3D"
          className={`p-1.5 rounded-lg border transition-colors ${
            darkStage
              ? 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800'
              : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {darkStage ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Sudut Kamera"
          className={`p-1.5 rounded-lg border transition-colors ${
            darkStage
              ? 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800'
              : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3D WebGL Mount Container */}
      {renderMode === '3d' && webglSupported ? (
        <>
          <div ref={mountRef} className="w-full h-full" />

          {/* Semantic DOM Overlays for Atom Symbols, Bond Angle, and Repulsion Labels */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {projectedLabels.map((lbl) => {
              if (!lbl.visible) return null;
              if (lbl.kind === 'central') {
                return (
                  <div
                    key={lbl.id}
                    style={{ transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0)` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 font-mono font-bold text-xs text-white drop-shadow"
                  >
                    {lbl.text}
                  </div>
                );
              }
              if (lbl.kind === 'X') {
                return (
                  <div
                    key={lbl.id}
                    style={{ transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0)` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 font-mono font-bold text-[11px] text-slate-900 bg-white/85 px-1.5 py-0.5 rounded shadow-xs"
                  >
                    {lbl.text}
                  </div>
                );
              }
              if (lbl.kind === 'E') {
                return (
                  <div
                    key={lbl.id}
                    style={{ transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0)` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 font-mono font-semibold text-[11px] text-amber-200 bg-amber-950/85 border border-amber-500/40 px-1.5 py-0.5 rounded"
                  >
                    {lbl.text}
                  </div>
                );
              }
              if (lbl.kind === 'angle') {
                return (
                  <div
                    key={lbl.id}
                    style={{ transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0)` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 font-mono tabular-nums font-bold text-xs text-sky-200 bg-sky-950/90 border border-sky-400/50 px-2 py-0.5 rounded"
                  >
                    ∠ {lbl.text}
                  </div>
                );
              }
              if (lbl.kind === 'repulsion') {
                const colorClass =
                  lbl.repulsionTier === 'PEB-PEB'
                    ? 'bg-red-950/90 text-red-200 border-red-500/50'
                    : lbl.repulsionTier === 'PEB-PEI'
                    ? 'bg-amber-950/90 text-amber-200 border-amber-500/50'
                    : 'bg-sky-950/90 text-sky-200 border-sky-500/50';
                return (
                  <div
                    key={lbl.id}
                    style={{ transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0)` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 text-[11px] font-medium border px-2 py-0.5 rounded whitespace-nowrap ${colorClass}`}
                  >
                    {lbl.text}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </>
      ) : (
        /* Interactive 2D Vector Diagram Fallback / Schematic View */
        <div className="w-full h-full flex items-center justify-center p-6">
          <svg viewBox="-260 -220 520 440" className="w-full h-full max-w-[540px] max-h-[440px]">
            <defs>
              <radialGradient id="centralAtomGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor={centralAtom.colorHex} stopOpacity="1" />
              </radialGradient>
              <radialGradient id="lonePairGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.25" />
              </radialGradient>
            </defs>

            {/* Reference Circle */}
            <circle
              cx="0"
              cy="0"
              r="155"
              fill="none"
              stroke={darkStage ? '#1E293B' : '#CBD5E1'}
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Repulsion Dashed Arcs in 2D */}
            {showRepulsion &&
              targetDomains.map((d1, i) =>
                targetDomains.slice(i + 1).map((d2, j) => {
                  const x1 = d1.x * 130 + d1.z * 35;
                  const y1 = -d1.y * 130 + d1.z * 25;
                  const x2 = d2.x * 130 + d2.z * 35;
                  const y2 = -d2.y * 130 + d2.z * 25;
                  const tier =
                    d1.type === 'E' && d2.type === 'E'
                      ? 'PEB-PEB'
                      : d1.type === 'E' || d2.type === 'E'
                      ? 'PEB-PEI'
                      : 'PEI-PEI';
                  const strokeColor =
                    tier === 'PEB-PEB' ? '#EF4444' : tier === 'PEB-PEI' ? '#F59E0B' : '#38BDF8';
                  const animClass =
                    tier === 'PEB-PEB'
                      ? 'animate-dash-fast'
                      : tier === 'PEB-PEI'
                      ? 'animate-dash-medium'
                      : 'animate-dash-slow';
                  return (
                    <line
                      key={`rep2d-${i}-${j}`}
                      x1={x1 * 0.75}
                      y1={y1 * 0.75}
                      x2={x2 * 0.75}
                      y2={y2 * 0.75}
                      stroke={strokeColor}
                      strokeWidth={tier === 'PEB-PEB' ? 2.8 : 2}
                      strokeDasharray="6 6"
                      className={animClass}
                    />
                  );
                })
              )}

            {/* Domains (Bonds & Lone Pairs) */}
            {targetDomains.map((d) => {
              const px = (d.x + d.z * 0.28) * 145;
              const py = (-d.y + d.z * 0.2) * 145;
              if (d.type === 'X') {
                return (
                  <g key={d.id}>
                    <line
                      x1="0"
                      y1="0"
                      x2={px}
                      y2={py}
                      stroke={darkStage ? '#94A3B8' : '#475569'}
                      strokeWidth={bondOrder === 2 ? 7 : 4.5}
                    />
                    <circle
                      cx={px}
                      cy={py}
                      r="22"
                      fill={ligandAtom.colorHex}
                      stroke="#334155"
                      strokeWidth="2"
                    />
                    <text
                      x={px}
                      y={py + 4}
                      textAnchor="middle"
                      className="font-mono text-xs font-bold fill-slate-900"
                    >
                      {ligandAtom.symbol}
                    </text>
                  </g>
                );
              }
              return (
                <g key={d.id}>
                  <line
                    x1="0"
                    y1="0"
                    x2={px * 0.78}
                    y2={py * 0.78}
                    stroke="#F59E0B"
                    strokeDasharray="3 3"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx={px * 0.78}
                    cy={py * 0.78}
                    rx="32"
                    ry="24"
                    fill="url(#lonePairGrad)"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                  />
                  <circle cx={px * 0.78 - 7} cy={py * 0.78 - 2} r="3.5" fill="#FEF08A" />
                  <circle cx={px * 0.78 + 7} cy={py * 0.78 - 2} r="3.5" fill="#FEF08A" />
                  <text
                    x={px * 0.78}
                    y={py * 0.78 + 14}
                    textAnchor="middle"
                    className="font-mono text-[10px] font-semibold fill-amber-400"
                  >
                    PEB (E)
                  </text>
                </g>
              );
            })}

            {/* Central Atom A */}
            <circle cx="0" cy="0" r="30" fill="url(#centralAtomGrad)" stroke="#1E293B" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" className="font-mono text-sm font-bold fill-white">
              {centralAtom.symbol}
            </text>
          </svg>
        </div>
      )}

      {/* Drag & Drop Zone Overlay Prompt when dragging PEI or PEB */}
      {isDragOver && (
        <div className="absolute inset-0 z-20 bg-sky-950/60 backdrop-blur-xs flex items-center justify-center pointer-events-none">
          <div className="px-5 py-3 rounded-xl bg-slate-900/95 border border-sky-400 text-sky-100 text-sm font-medium shadow-lg">
            Lepaskan untuk memasang domain elektron ke Atom Pusat ({centralAtom.symbol})
          </div>
        </div>
      )}

      {/* Bottom Action Bar Inside Viewport: Quick Analysis Toggles + Repulsion Legend */}
      <div
        className={`absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg border backdrop-blur-md ${
          darkStage
            ? 'bg-slate-900/85 border-slate-700/80 text-slate-200'
            : 'bg-white/90 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleRepulsion}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              showRepulsion
                ? 'bg-[#0284C7] text-white'
                : darkStage
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Analisis Gaya Tolakan</span>
          </button>

          <button
            type="button"
            onClick={onToggleBondAngle}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              showBondAngle
                ? 'bg-[#0284C7] text-white'
                : darkStage
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Busur Sudut ({geometryInfo.primaryAngleDeg.toFixed(1)}°)</span>
          </button>
        </div>

        {/* Repulsion Strength Legend (Explicit Text + Color Indicator for Accessibility) */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-red-400 font-medium whitespace-nowrap">
            --- PEB–PEB (Kuat)
          </span>
          <span aria-hidden="true" className="opacity-30">
            /
          </span>
          <span className="text-amber-400 font-medium whitespace-nowrap">
            --- PEB–PEI (Sedang)
          </span>
          <span aria-hidden="true" className="opacity-30">
            /
          </span>
          <span className="text-sky-400 font-medium whitespace-nowrap">
            --- PEI–PEI (Lemah)
          </span>
        </div>
      </div>
    </div>
  );
};
