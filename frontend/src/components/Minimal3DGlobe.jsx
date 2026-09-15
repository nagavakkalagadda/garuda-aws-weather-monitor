import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Compass, RotateCw, MapPin, Globe } from 'lucide-react';

export default function Minimal3DGlobe({
  currentLocation,
  onSelectLocation,
  presetLocations = []
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const globeGroupRef = useRef(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const beaconMeshRef = useRef(null);

  // Convert Lat/Lon to 3D Cartesian coordinates on sphere
  const latLonToVector3 = (lat, lon, radius = 2.0) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Globe Container Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Base Sphere (Dark semi-transparent core)
    const sphereGeo = new THREE.SphereGeometry(2.0, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x070d18,
      transparent: true,
      opacity: 0.85
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // Wireframe Grid Mesh
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const wireMesh = new THREE.Mesh(sphereGeo, wireMat);
    globeGroup.add(wireMesh);

    // Latitude & Longitude Meridian Rings
    const ringMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.22 });
    for (let i = -60; i <= 60; i += 30) {
      const ringRadius = 2.0 * Math.cos(i * (Math.PI / 180));
      const ringY = 2.0 * Math.sin(i * (Math.PI / 180));
      const ringGeo = new THREE.BufferGeometry();
      const points = [];
      for (let j = 0; j <= 64; j++) {
        const angle = (j / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * ringRadius, ringY, Math.sin(angle) * ringRadius));
      }
      ringGeo.setFromPoints(points);
      const ring = new THREE.Line(ringGeo, ringMat);
      globeGroup.add(ring);
    }

    // Outer Atmospheric Glowing Halo Ring
    const haloGeo = new THREE.RingGeometry(2.18, 2.32, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2.4;
    globeGroup.add(haloMesh);

    // Background floating particle dust
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = [];
    for (let i = 0; i < particleCount; i++) {
      const r = 2.4 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      particlePos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x00c8f8, size: 0.035, transparent: true, opacity: 0.45 });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Current Station Glowing Beacon
    const beaconGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00e676 });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    globeGroup.add(beaconMesh);
    beaconMeshRef.current = beaconMesh;

    // Beacon Outer Pulsing Ring
    const beaconRingGeo = new THREE.RingGeometry(0.09, 0.14, 24);
    const beaconRingMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconMesh.add(beaconRing);

    // Preset Station Markers
    presetLocations.forEach((preset) => {
      const pos = latLonToVector3(preset.latitude, preset.longitude, 2.02);
      const dotGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x00c8f8 });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      globeGroup.add(dotMesh);
    });

    // 4. Mouse Drag Rotation Listeners
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      globeGroup.rotation.y += deltaX * 0.006;
      globeGroup.rotation.x += deltaY * 0.006;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smoothly rotate globe towards target lat/lon when not dragging
      if (!isDraggingRef.current) {
        globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.05;
        globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.05;
      }

      // Pulse beacon ring scale
      const scale = 1.0 + Math.sin(elapsedTime * 4.0) * 0.35;
      beaconRing.scale.set(scale, scale, scale);

      // Slow idle ambient rotation
      particleSystem.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [presetLocations]);

  // Update target orientation when currentLocation changes
  useEffect(() => {
    if (!currentLocation) return;
    const lat = currentLocation.latitude ?? 12.9716;
    const lon = currentLocation.longitude ?? 77.5946;

    // Calculate rotation to place lat/lon in front of camera
    const targetY = -((lon + 180) * (Math.PI / 180)) - Math.PI / 2;
    const targetX = (lat * (Math.PI / 180));

    targetRotationRef.current = { x: targetX, y: targetY };

    // Move beacon position
    if (beaconMeshRef.current) {
      const pos = latLonToVector3(lat, lon, 2.03);
      beaconMeshRef.current.position.copy(pos);
      beaconMeshRef.current.lookAt(0, 0, 0);
    }
  }, [currentLocation]);

  return (
    <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden bg-dark-900/60 border border-cyan-500/20 shadow-inner group">
      
      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Overlay HUD Metadata */}
      <div className="absolute top-2.5 left-3 pointer-events-none font-mono text-[10px] space-y-0.5 z-10">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold tracking-wider uppercase">
          <Globe className="w-3.5 h-3.5 animate-spin-slow" />
          <span>3D METEOROLOGICAL GLOBE</span>
        </div>
        <div className="text-slate-400">
          TARGET: <span className="text-emerald-400 font-bold">{currentLocation?.city || 'Bengaluru'}</span>
        </div>
        <div className="text-slate-500">
          LAT: {currentLocation?.latitude?.toFixed(2)}° • LON: {currentLocation?.longitude?.toFixed(2)}°
        </div>
      </div>

      {/* Interactive Control Hint */}
      <div className="absolute bottom-2 right-3 pointer-events-none font-mono text-[9px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
        <RotateCw className="w-3 h-3 text-cyan-400/60" /> Drag to orbit 3D globe
      </div>

    </div>
  );
}
