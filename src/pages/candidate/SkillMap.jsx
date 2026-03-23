import { useData } from '../../context/DataContext';
import { useEffect, useRef, useState } from 'react';

export default function SkillMap() {
  const { resume } = useData();
  const canvasRef = useRef(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [nodes, setNodes] = useState([]);

  const skills = resume?.skills || ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'CSS', 'HTML', 'Git', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'];
  const topSkills = resume?.topSkills || skills.slice(0, 5);

  useEffect(() => {
    const centerX = 400;
    const centerY = 300;
    const generated = skills.map((skill, i) => {
      const isTop = topSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
      const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
      const radius = isTop ? 100 + Math.random() * 60 : 160 + Math.random() * 80;
      const size = isTop ? 50 + Math.random() * 20 : 30 + Math.random() * 20;
      return {
        name: skill,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size,
        isTop,
        connections: isTop ? skills.filter(s => s !== skill).sort(() => 0.5 - Math.random()).slice(0, 3) : [],
      };
    });
    setNodes(generated);
  }, [skills.join(',')]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 800;
    const h = canvas.height = 600;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, w, h);

    // Draw connections
    nodes.forEach(node => {
      node.connections.forEach(connName => {
        const target = nodes.find(n => n.name === connName);
        if (target) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = 'rgba(0,0,0,0.06)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    nodes.forEach(node => {
      const isHovered = hoveredSkill === node.name;
      const r = node.size / 2;

      // Glow
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fill();
      }

      // Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      if (node.isTop) {
        ctx.fillStyle = isHovered ? '#000' : '#171717';
      } else {
        ctx.fillStyle = isHovered ? '#525252' : '#a3a3a3';
      }
      ctx.fill();

      // Text
      ctx.fillStyle = '#fff';
      ctx.font = `${node.isTop ? '600' : '500'} ${node.isTop ? '11' : '9'}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const maxWidth = r * 1.6;
      ctx.fillText(node.name, node.x, node.y, maxWidth);
    });
  }, [nodes, hoveredSkill]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;

    const found = nodes.find(n => {
      const dx = (n.x - x * scaleX);
      const dy = (n.y - y * scaleY);
      return Math.sqrt(dx * dx + dy * dy) < n.size / 2;
    });
    setHoveredSkill(found?.name || null);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Skill Map</h1>
        <p>Interactive constellation showing your skill landscape. Larger nodes = stronger skills.</p>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: hoveredSkill ? 'pointer' : 'default' }}
          onMouseMove={handleMouseMove}
        />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: '200px' }}>
          <h4 style={{ marginBottom: '12px' }}>Top Skills</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {topSkills.map((s, i) => (
              <span key={i} className="badge badge-black">{s}</span>
            ))}
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '200px' }}>
          <h4 style={{ marginBottom: '12px' }}>All Skills ({skills.length})</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.filter(s => !topSkills.map(t => t.toLowerCase()).includes(s.toLowerCase())).map((s, i) => (
              <span key={i} className="badge badge-gray">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {hoveredSkill && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--gray-900)',
          color: 'var(--white)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeIn var(--transition-fast)',
        }}>
          {hoveredSkill} — {topSkills.map(s => s.toLowerCase()).includes(hoveredSkill.toLowerCase()) ? '⭐ Core Skill' : 'Supporting Skill'}
        </div>
      )}
    </div>
  );
}
