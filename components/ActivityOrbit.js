"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const nodePositions = [
  [-1.7, 0.9, 0.2],
  [-0.8, -0.8, 0.4],
  [0.4, 1.05, -0.35],
  [1.55, 0.15, 0.25],
  [0.75, -1.15, -0.2],
  [-0.35, 0.1, 0.85],
];

export default function ActivityOrbit() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 6.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.72, 2),
      new THREE.MeshBasicMaterial({ color: 0xffb36b, wireframe: true, transparent: true, opacity: 0.92 }),
    );
    orbitGroup.add(core);

    const coreGlow = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.5, 2),
      new THREE.MeshBasicMaterial({ color: 0xff7a3d, transparent: true, opacity: 0.16 }),
    );
    orbitGroup.add(coreGlow);

    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x62e6d0 });
    const accentMaterial = new THREE.MeshBasicMaterial({ color: 0xffc27d });
    const nodes = nodePositions.map((position, index) => {
      const node = new THREE.Mesh(new THREE.SphereGeometry(index === 5 ? 0.13 : 0.09, 16, 16), index % 2 ? nodeMaterial : accentMaterial);
      node.position.set(...position);
      orbitGroup.add(node);
      return node;
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7ce9d7, transparent: true, opacity: 0.42 });
    const links = nodePositions.map((position) => {
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...position)];
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial);
      orbitGroup.add(line);
      return line;
    });

    const ringMaterial = new THREE.LineBasicMaterial({ color: 0xffa45e, transparent: true, opacity: 0.38 });
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      new Array(96).fill(null).map((_, index) => {
        const angle = (index / 96) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(angle) * 2.25, Math.sin(angle) * 0.82, -0.1);
      }),
    ), ringMaterial);
    ring.rotation.x = 0.58;
    orbitGroup.add(ring);

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    window.addEventListener("resize", resize);

    let pointerX = 0;
    let pointerY = 0;
    const handlePointerMove = (event) => {
      const bounds = mount.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.35;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.25;
    };
    mount.addEventListener("pointermove", handlePointerMove);

    const startedAt = performance.now();
    let animationFrame;
    const animate = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      orbitGroup.rotation.y += 0.0025;
      orbitGroup.rotation.x += (pointerY - orbitGroup.rotation.x) * 0.025;
      orbitGroup.rotation.z += (pointerX - orbitGroup.rotation.z) * 0.025;
      core.rotation.x = elapsed * 0.18;
      core.rotation.y = elapsed * 0.28;
      coreGlow.scale.setScalar(1 + Math.sin(elapsed * 2.1) * 0.06);
      nodes.forEach((node, index) => {
        node.position.z += Math.sin(elapsed * 1.4 + index) * 0.0008;
      });
      links.forEach((line, index) => {
        line.material.opacity = 0.28 + (Math.sin(elapsed * 1.5 + index) + 1) * 0.1;
      });
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", handlePointerMove);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
    };
  }, []);

  return <div ref={mountRef} className="activity-orbit" aria-label="Animated visualization of GitHub activity becoming a social post" role="img" />;
}
