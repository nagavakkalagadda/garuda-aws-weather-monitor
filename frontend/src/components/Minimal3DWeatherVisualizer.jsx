import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Minimal3DWeatherVisualizer({
  theme = 'clear',
  condition = 'Clear Sky',
  className = "w-36 h-36"
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 144;
    const height = container.clientHeight || 144;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    let updateAnimation = () => {};

    // Build specific minimalist 3D weather object based on theme
    if (theme === 'clear') {
      // 3D Solar Core with Orbital Halo Rings
      const sunGeo = new THREE.SphereGeometry(0.85, 24, 24);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xffb703, wireframe: true, transparent: true, opacity: 0.6 });
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      group.add(sunMesh);

      // Inner glowing core
      const coreGeo = new THREE.SphereGeometry(0.55, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

      // Orbital Corona Rings
      const ringGeo = new THREE.TorusGeometry(1.2, 0.025, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.7 });
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      const ring2 = new THREE.Mesh(ringGeo, ringMat);
      ring2.rotation.x = Math.PI / 2;
      group.add(ring1);
      group.add(ring2);

      updateAnimation = (t) => {
        sunMesh.rotation.y = t * 0.4;
        ring1.rotation.z = t * 0.6;
        ring2.rotation.y = t * 0.5;
        const s = 1 + Math.sin(t * 2) * 0.05;
        coreMesh.scale.set(s, s, s);
      };

    } else if (theme === 'rain') {
      // 3D Falling Rain Streaks
      const count = 75;
      const lineGeo = new THREE.BufferGeometry();
      const pos = [];
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 2.8;
        const y = (Math.random() - 0.5) * 2.8;
        const z = (Math.random() - 0.5) * 1.5;
        pos.push(x, y, z);
        pos.push(x - 0.08, y - 0.35, z); // angled streak
      }
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const lineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.75 });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      group.add(lines);

      // Cloud cap above
      const cloudGeo = new THREE.SphereGeometry(0.7, 16, 16);
      const cloudMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, wireframe: true, transparent: true, opacity: 0.4 });
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.y = 0.9;
      cloud.scale.set(1.6, 0.6, 1.0);
      group.add(cloud);

      updateAnimation = (t) => {
        const p = lineGeo.attributes.position.array;
        for (let i = 1; i < p.length; i += 6) {
          p[i] -= 0.09;
          p[i + 3] -= 0.09;
          if (p[i] < -1.5) {
            p[i] = 1.5;
            p[i + 3] = 1.15;
          }
        }
        lineGeo.attributes.position.needsUpdate = true;
        cloud.rotation.y = t * 0.2;
      };

    } else if (theme === 'thunderstorm') {
      // 3D Storm Core with Volumetric Lightning Discharges
      const stormGeo = new THREE.IcosahedronGeometry(0.85, 1);
      const stormMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.7 });
      const stormMesh = new THREE.Mesh(stormGeo, stormMat);
      group.add(stormMesh);

      // Lightning Bolt Segments
      const boltGeo = new THREE.BufferGeometry();
      const boltPoints = [
        new THREE.Vector3(-0.2, 0.7, 0),
        new THREE.Vector3(0.1, 0.2, 0.2),
        new THREE.Vector3(-0.15, -0.1, -0.1),
        new THREE.Vector3(0.25, -0.7, 0.1)
      ];
      boltGeo.setFromPoints(boltPoints);
      const boltMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 2 });
      const bolt = new THREE.Line(boltGeo, boltMat);
      group.add(bolt);

      updateAnimation = (t) => {
        stormMesh.rotation.y = t * 0.7;
        stormMesh.rotation.x = t * 0.4;
        bolt.visible = Math.sin(t * 12) > 0.4; // intermittent strobe discharge
      };

    } else if (theme === 'snow') {
      // 3D Hexagonal Floating Snowflake Prisms
      const flakeCount = 45;
      const flakeGeo = new THREE.BufferGeometry();
      const flakePos = [];
      for (let i = 0; i < flakeCount; i++) {
        flakePos.push(
          (Math.random() - 0.5) * 2.8,
          (Math.random() - 0.5) * 2.8,
          (Math.random() - 0.5) * 1.5
        );
      }
      flakeGeo.setAttribute('position', new THREE.Float32BufferAttribute(flakePos, 3));
      const flakeMat = new THREE.PointsMaterial({ color: 0xe0f2fe, size: 0.08, transparent: true, opacity: 0.85 });
      const flakes = new THREE.Points(flakeGeo, flakeMat);
      group.add(flakes);

      updateAnimation = (t) => {
        const p = flakeGeo.attributes.position.array;
        for (let i = 1; i < p.length; i += 3) {
          p[i] -= 0.02;
          p[i - 1] += Math.sin(t + i) * 0.003;
          if (p[i] < -1.4) p[i] = 1.4;
        }
        flakeGeo.attributes.position.needsUpdate = true;
      };

    } else if (theme === 'extreme_heat') {
      // 3D Radiant Thermal Distortion Mesh
      const heatGeo = new THREE.TorusKnotGeometry(0.65, 0.2, 48, 12);
      const heatMat = new THREE.MeshBasicMaterial({ color: 0xf97316, wireframe: true, transparent: true, opacity: 0.7 });
      const heatMesh = new THREE.Mesh(heatGeo, heatMat);
      group.add(heatMesh);

      updateAnimation = (t) => {
        heatMesh.rotation.x = t * 0.8;
        heatMesh.rotation.y = t * 0.6;
        const pulse = 1.0 + Math.sin(t * 3) * 0.08;
        heatMesh.scale.set(pulse, pulse, pulse);
      };

    } else {
      // Cloudy: Minimalist 3D Volumetric Cloud Cluster
      const cloudGeo1 = new THREE.SphereGeometry(0.65, 16, 16);
      const cloudGeo2 = new THREE.SphereGeometry(0.48, 16, 16);
      const cloudMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, wireframe: true, transparent: true, opacity: 0.5 });
      
      const c1 = new THREE.Mesh(cloudGeo1, cloudMat);
      const c2 = new THREE.Mesh(cloudGeo2, cloudMat);
      c2.position.set(0.6, 0.15, 0);
      const c3 = new THREE.Mesh(cloudGeo2, cloudMat);
      c3.position.set(-0.55, -0.1, 0);

      group.add(c1);
      group.add(c2);
      group.add(c3);

      updateAnimation = (t) => {
        group.rotation.y = Math.sin(t * 0.5) * 0.3;
        c1.position.y = Math.sin(t * 1.5) * 0.05;
        c2.position.y = 0.15 + Math.cos(t * 1.8) * 0.04;
      };
    }

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      updateAnimation(elapsed);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
