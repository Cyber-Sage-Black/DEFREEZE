'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDefreezeMindProps {
  onThawed?: () => void;
  interactive?: boolean;
  autoThaw?: boolean;
  height?: string;
  showControls?: boolean;
}

export default function ThreeDefreezeMind({
  onThawed,
  interactive = true,
  autoThaw = true,
  height = '100%',
  showControls = false,
}: ThreeDefreezeMindProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thawProgress, setThawProgress] = useState(0);
  const [isFullyThawed, setIsFullyThawed] = useState(false);

  // References for Three.js objects
  const thawProgressRef = useRef(0);
  const onThawedRef = useRef(onThawed);
  onThawedRef.current = onThawed;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const canvasHeight = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup for Ice & Glass Refraction
    const ambientLight = new THREE.AmbientLight(0x0f2042, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 2.8);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    // Internal Warm "Awakening" Glow (Thawing Heart/Mind)
    const innerLight = new THREE.PointLight(0x38bdf8, 0, 10);
    innerLight.position.set(0, 0, 0);
    scene.add(innerLight);

    // 3. Central "Defreezed Mind / Head" Sculpted Geometry
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Upper Cranium / Mind (Icosahedron faceted crystal)
    const craniumGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0c214d,
      emissiveIntensity: 0.2,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.75, // Glass / ice effect
      ior: 1.45,
      thickness: 1.8,
      specularIntensity: 1.2,
      specularColor: 0xffffff,
      transparent: true,
      opacity: 0.65,
      wireframe: false,
    });

    const craniumMesh = new THREE.Mesh(craniumGeo, crystalMat);
    craniumMesh.position.y = 0.35;
    mainGroup.add(craniumMesh);

    // Inner Glowing Core (representing potential / mind unfreezing)
    const coreGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 0.35;
    mainGroup.add(coreMesh);

    // Jaw / Chin Facets
    const jawGeo = new THREE.ConeGeometry(0.7, 1.2, 6);
    jawGeo.rotateX(Math.PI);
    const jawMesh = new THREE.Mesh(jawGeo, crystalMat);
    jawMesh.position.set(0, -0.65, 0.1);
    mainGroup.add(jawMesh);

    // 4. Shattered Ice Shards (like the flyer breaking free)
    const shardCount = 42;
    const shards: {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      driftDir: THREE.Vector3;
      rotSpeed: THREE.Vector3;
    }[] = [];

    const shardGeoBase = new THREE.TetrahedronGeometry(0.22, 0);
    const shardMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      roughness: 0.15,
      metalness: 0.2,
      transmission: 0.85,
      transparent: true,
      opacity: 0.8,
    });

    for (let i = 0; i < shardCount; i++) {
      const shardMesh = new THREE.Mesh(shardGeoBase, shardMat.clone());
      
      // Random position on or around the head
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 1.35 + Math.random() * 0.4;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) + 0.3;
      const z = radius * Math.cos(phi);

      shardMesh.position.set(x, y, z);
      shardMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const basePos = new THREE.Vector3(x, y, z);
      const driftDir = basePos.clone().normalize();
      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04
      );

      mainGroup.add(shardMesh);
      shards.push({ mesh: shardMesh, basePos, driftDir, rotSpeed });
    }

    // 5. Frost & Sparkling Particle Dust
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseX = (clientX / rect.width) * 2 - 1;
      mouseY = -(clientY / rect.height) * 2 + 1;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Progress Thawing
      if (autoThaw && thawProgressRef.current < 1) {
        thawProgressRef.current = Math.min(1, thawProgressRef.current + delta * 0.28);
        setThawProgress(Math.round(thawProgressRef.current * 100));

        if (thawProgressRef.current >= 1 && !isFullyThawed) {
          setIsFullyThawed(true);
          if (onThawedRef.current) {
            onThawedRef.current();
          }
        }
      }

      const p = thawProgressRef.current; // 0 to 1

      // Dynamic Shards Expansion (Breaking Free Effect)
      shards.forEach((s, idx) => {
        // Expand distance outward based on thaw progress
        const expansion = 1 + p * (1.2 + (idx % 5) * 0.2);
        s.mesh.position.copy(s.basePos).multiplyScalar(expansion);
        s.mesh.rotation.x += s.rotSpeed.x;
        s.mesh.rotation.y += s.rotSpeed.y;
        
        // Glistening opacity and color shift as it melts
        const smat = s.mesh.material as THREE.MeshPhysicalMaterial;
        smat.opacity = 0.4 + p * 0.55;
        smat.roughness = 0.3 - p * 0.2;
      });

      // Central Crystal Mind Transformation
      crystalMat.opacity = 0.5 + p * 0.45;
      crystalMat.roughness = 0.25 - p * 0.18;
      crystalMat.transmission = 0.6 + p * 0.35;

      // Inner Core rotation & radiance
      coreMesh.rotation.y += 0.02;
      coreMesh.rotation.x += 0.01;
      const cmat = coreMesh.material as THREE.MeshBasicMaterial;
      cmat.opacity = 0.3 + p * 0.7;

      innerLight.intensity = p * 6.5;
      innerLight.color.setHex(p > 0.8 ? 0x38bdf8 : 0x0284c7);

      // Smooth Head Rotation & Mouse Look
      targetX = mouseX * 0.4;
      targetY = mouseY * 0.3;

      mainGroup.rotation.y += 0.006 + (targetX - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetY - mainGroup.rotation.x) * 0.05;

      // Gentle Floating Bob
      mainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Particle Drift
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoThaw, interactive, isFullyThawed]);

  const handleManualThaw = () => {
    thawProgressRef.current = 1;
    setThawProgress(100);
    setIsFullyThawed(true);
    if (onThawed) onThawed();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{ height }}
    >
      {/* Optional Progress Indicator Overlay */}
      {showControls && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full ice-glass text-xs font-mono text-cyan-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Thawing Crystal Mind: {thawProgress}%</span>
          </div>
          <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/20">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${thawProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Manual Thaw Trigger if needed */}
      {showControls && thawProgress < 100 && (
        <button
          onClick={handleManualThaw}
          className="absolute top-4 right-4 z-20 text-xs px-3 py-1 rounded-md text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
        >
          Skip Thaw
        </button>
      )}
    </div>
  );
}
