'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DnaNetwork({ skillData, psychologyData, width = 800, height = 600 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !skillData || !psychologyData) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create gradient definitions for glow effects
    const defs = svg.append('defs');

    // Create multiple gradients for different colors
    const colors = [
      { id: 'glow-green', color: '#10b981' },
      { id: 'glow-yellow', color: '#f59e0b' },
      { id: 'glow-red', color: '#ef4444' },
      { id: 'glow-blue', color: '#3b82f6' },
      { id: 'glow-purple', color: '#8b5cf6' },
      { id: 'glow-pink', color: '#ec4899' },
      { id: 'glow-indigo', color: '#6366f1' },
      { id: 'glow-cyan', color: '#06b6d4' }
    ];

    colors.forEach(({ id, color }) => {
      const filter = defs.append('filter')
        .attr('id', id)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

      filter.append('feGaussianBlur')
        .attr('stdDeviation', '8')
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Prepare nodes data - show complete values without splitting
    const nodes = [];
    
    // Skill nodes - show as single nodes
    if (skillData.skillStrong) {
      nodes.push({
        id: 'skill-strong',
        label: skillData.skillStrong,
        color: '#10b981',
        size: 70,
        category: 'skill-strong',
        filter: 'url(#glow-green)'
      });
    }
    
    if (skillData.skillMedium) {
      nodes.push({
        id: 'skill-medium',
        label: skillData.skillMedium,
        color: '#f59e0b',
        size: 60,
        category: 'skill-medium',
        filter: 'url(#glow-yellow)'
      });
    }
    
    if (skillData.skillWeak) {
      nodes.push({
        id: 'skill-weak',
        label: skillData.skillWeak,
        color: '#ef4444',
        size: 50,
        category: 'skill-weak',
        filter: 'url(#glow-red)'
      });
    }

    // Psychology nodes - show as single nodes
    if (psychologyData.cognitive) {
      nodes.push({
        id: 'cognitive',
        label: psychologyData.cognitive,
        color: '#3b82f6',
        size: 65,
        category: 'cognitive',
        filter: 'url(#glow-blue)'
      });
    }
    
    if (psychologyData.learning) {
      nodes.push({
        id: 'learning',
        label: psychologyData.learning,
        color: '#8b5cf6',
        size: 65,
        category: 'learning',
        filter: 'url(#glow-purple)'
      });
    }
    
    if (psychologyData.motivation) {
      nodes.push({
        id: 'motivation',
        label: psychologyData.motivation,
        color: '#ec4899',
        size: 65,
        category: 'motivation',
        filter: 'url(#glow-pink)'
      });
    }
    
    if (psychologyData.trait) {
      nodes.push({
        id: 'trait',
        label: psychologyData.trait,
        color: '#6366f1',
        size: 60,
        category: 'trait',
        filter: 'url(#glow-indigo)'
      });
    }

    // Create links (connections between nodes)
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
      // Connect to 2-4 random nearby nodes
      const numLinks = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < numLinks; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (targetIndex !== i) {
          links.push({
            source: nodes[i].id,
            target: nodes[targetIndex].id
          });
        }
      }
    }

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.size + 10));

    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#06b6d4')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 2);

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles
    node.append('circle')
      .attr('r', d => d.size)
      .attr('fill', 'transparent')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 4)
      .attr('filter', d => d.filter)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 6);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 4);
      });

    // Add labels with text wrapping
    node.each(function(d) {
      const nodeGroup = d3.select(this);
      const words = d.label.split(/[\s,]+/);
      const maxWidth = d.size * 1.8;
      const lineHeight = 14;
      let currentLine = '';
      let lines = [];
      
      words.forEach(word => {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        if (testLine.length * 6 > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);
      
      // Limit to 3 lines
      if (lines.length > 3) {
        lines = lines.slice(0, 3);
        lines[2] = lines[2].substring(0, 15) + '...';
      }
      
      const startY = -(lines.length - 1) * lineHeight / 2;
      
      lines.forEach((line, i) => {
        nodeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', startY + (i * lineHeight))
          .attr('fill', 'black')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .attr('pointer-events', 'none')
          .text(line);
      });
    });

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', '#f6806d')
      .text('DNA Skill & Psikologi Network')
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    return () => {
      simulation.stop();
    };

  }, [skillData, psychologyData, width, height]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Legend */}
      <div className="bg-[#F6F4F0] border-2 border-[#75B2AB] rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-geist bold text-[#0B6B64] mb-4 text-center">Keterangan Warna</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-[#0B6B64]"></div>
            <div>
              <p className="font-geist bold text-sm text-gray-900">Skill Kuat</p>
              <p className="font-geist mono text-xs text-gray-600">Keahlian utama</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-[#f6806d]"></div>
            <div>
              <p className="font-geist bold text-sm text-gray-900">Skill Sedang</p>
              <p className="font-geist mono text-xs text-gray-600">Perlu pengembangan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-[#8b5cf6]"></div>
            <div>
              <p className="font-geist bold text-sm text-gray-900">Skill Lemah</p>
              <p className="font-geist mono text-xs text-gray-600">Butuh peningkatan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-[#75B2AB]"></div>
            <div>
              <p className="font-geist bold text-sm text-gray-900">Kognitif</p>
              <p className="font-geist mono text-xs text-gray-600">Cara berpikir</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-[#8b5cf6]"></div>
            <div>
              <p className="font-geist bold text-sm text-gray-900">Gaya Belajar</p>
              <p className="font-geist mono text-xs text-gray-600">Metode belajar</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-[#f6806d]"></div>
            <div>
              <p className="font-geist bold text-sm text-gray-900">Motivasi</p>
              <p className="font-geist mono text-xs text-gray-600">Pendorong diri</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-[#0B6B64]"></div>
            <div>
              <p className="font-geist bold text-sm text-gray-900">Kepribadian</p>
              <p className="font-geist mono text-xs text-gray-600">Karakter diri</p>
            </div>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="bg-[#F6F4F0] border-2 border-[#75B2AB] rounded-3xl p-8 shadow-xl flex items-center justify-center">
        <svg ref={svgRef} className="w-full h-auto max-w-4xl"></svg>
      </div>
    </div>
  );
}
