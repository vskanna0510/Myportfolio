import React, { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";

const NODE_RADIUS = 2.8;

function SceneBackground() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color("#030508");
  }, [scene]);
  return null;
}

function WebGLContextHandler() {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", () => {});
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", () => {});
    };
  }, [gl]);
  return null;
}

type Project = {
  id: string;
  name: string;
  viewCount?: number;
};

type Props = {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
};

export const CommandCenterScene: React.FC<Props> = ({
  projects,
  activeProjectId,
  onSelectProject
}) => {
  return (
    <div className="scene-shell scene-shell-orbit">
      <Canvas
        camera={{ position: [0, 1.2, 10], fov: 48 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={({ gl }) => {
          (gl as unknown as { forceContextLoss?: () => void }).forceContextLoss = undefined;
        }}
      >
        <SceneBackground />
        <WebGLContextHandler />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={1.8} color="#00ffd0" distance={16} />
        <directionalLight position={[4, 5, 4]} intensity={0.6} color="#a0e8ff" />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#ff88bb" />

        <Suspense fallback={null}>
          <Stars radius={45} depth={65} count={2200} factor={2.2} saturation={0.3} />
          <GenerativeNetwork
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={onSelectProject}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.07}
        />
      </Canvas>
    </div>
  );
};

type NetworkProps = {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
};

function GenerativeNetwork({ projects, activeProjectId, onSelectProject }: NetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const count = projects.length || 1;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.18;
    }
  });

  const { positions, angles } = useMemo(() => {
    const pos: [number, number, number][] = [];
    const ang: number[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      ang.push(angle);
      const x = Math.cos(angle) * NODE_RADIUS;
      const z = Math.sin(angle) * NODE_RADIUS;
      pos.push([x, 0.5, z]);
    }
    return { positions: pos, angles: ang };
  }, [count]);

  const linePoints = useMemo(() => {
    const floats: number[] = [];
    positions.forEach(([x, y, z]) => {
      floats.push(0, 0, 0, x, y, z);
    });
    const arr = new Float32Array(floats);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    geo.setDrawRange(0, positions.length * 2);
    return geo;
  }, [positions]);

  return (
    <group ref={groupRef}>
      <NexusCore />
      <lineSegments geometry={linePoints}>
        <lineBasicMaterial color="#00ffd0" transparent opacity={0.35} />
      </lineSegments>
      {projects.map((project, i) => (
        <Node
          key={project.id}
          position={positions[i]!}
          angle={angles[i]!}
          label={project.name}
          active={project.id === activeProjectId}
          onClick={() => onSelectProject(project.id)}
        />
      ))}
    </group>
  );
}

function NexusCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.08);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.35, 32, 24]} />
      <meshStandardMaterial
        color="#040a10"
        metalness={0.9}
        roughness={0.1}
        emissive="#00ffd0"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

type NodeProps = {
  position: [number, number, number];
  angle: number;
  label: string;
  active: boolean;
  onClick: () => void;
};

function Node({ position, angle, label, active, onClick }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const scale = hovered ? 1.4 : active ? 1.25 : 1;
  const color = active ? "#ff2e97" : "#00ffd0";
  const glow = active ? 0.7 : hovered ? 0.5 : 0.25;

  return (
    <group position={position} rotation={[0, -angle, 0]}>
      <mesh
        scale={scale}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <icosahedronGeometry args={[0.13, 1]} />
        <meshStandardMaterial
          color={active ? "#1a0812" : "#061018"}
          metalness={0.85}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={glow}
        />
      </mesh>
      <Html
        center
        position={[0, 0.22, 0]}
        transform
        style={{ pointerEvents: "none", width: "76px" }}
      >
        <div className={`gen-node-label ${active ? "gen-node-label-active" : ""}`}>
          <span className="gen-node-title">{label}</span>
        </div>
      </Html>
    </group>
  );
}
