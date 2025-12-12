'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DnaHelix({ skillData, psychologyData, width = 800, height = 600}) {
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

        // Create gradient definitions
        const defs = svg.append('defs');

        // Gradient for DNA strands
        const gradient1 = defs.append('linearGradient')
            .attr('id', 'dna-gradient-1')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%');

        gradient1.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#3b82f6')
            .attr('stop-opacity', 1);

        gradient1.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#8b5cf6')
            .attr('stop-opacity', 1);

        const gradient2 = defs.append('linearGradient')
            .attr('id', 'dna-gradient-2')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%');

        gradient2.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#06b6d4')
            .attr('stop-opacity', 1);

        gradient2.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#3b82f6')
            .attr('stop-opacity', 1);

        // Create main group
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, 50)`);

        // DNA parameters
        const turns = 4;
        const pointsPerTurn = 20;
        const totalPoints = turns * pointsPerTurn;
        const helixRadius = 80;
        const verticalSpacing = (height - 100) / totalPoints;

        // Prepare data points for both strands
        const strand1Points = [];
        const strand2Points = [];
        const baseConnections = [];

        // DNA data mapping - using actual user data as labels (not split, show complete)
        const dnaElements = [
            { label: skillData.skillStrong, color: '#10b981', category: 'skill-strong', type: 'Skill Kuat' },
            { label: skillData.skillMedium, color: '#f59e0b', category: 'skill-medium', type: 'Skill Sedang' },
            { label: skillData.skillWeak, color: '#ef4444', category: 'skill-weak', type: 'Skill Lemah' },
            { label: psychologyData.cognitive, color: '#3b82f6', category: 'cognitive', type: 'Kognitif' },
            { label: psychologyData.learning, color: '#8b5cf6', category: 'learning', type: 'Gaya Belajar' },
            { label: psychologyData.motivation, color: '#ec4899', category: 'motivation', type: 'Motivasi' },
            { label: psychologyData.trait, color: '#6366f1', category: 'trait', type: 'Kepribadian' }
        ].filter(item => item.label && item.label.trim() !== '');

        // Generate helix points
        const pointsPerElement = Math.floor(totalPoints / Math.max(dnaElements.length, 1));

        for (let i = 0; i < totalPoints; i++) {
            const angle = (i / pointsPerTurn) * Math.PI * 2;
            const y = i * verticalSpacing;

            const x1 = Math.cos(angle) * helixRadius;
            const x2 = Math.cos(angle + Math.PI) * helixRadius;

            strand1Points.push({ x: x1, y: y, angle: angle, index: i });
            strand2Points.push({ x: x2, y: y, angle: angle + Math.PI, index: i });
        }

        // Create base pair connections - ONE per data element only
        dnaElements.forEach((element, index) => {
            const i = Math.floor(index * pointsPerElement + pointsPerElement / 2);
            if (i < totalPoints) {
                const angle = (i / pointsPerTurn) * Math.PI * 2;
                const y = i * verticalSpacing;
                const x1 = Math.cos(angle) * helixRadius;
                const x2 = Math.cos(angle + Math.PI) * helixRadius;

                baseConnections.push({
                    x1: x1,
                    y: y,
                    x2: x2,
                    data: element
                });
            }
        });

        // Draw connecting lines between base pairs
        const connections = g.selectAll('.base-connection')
            .data(baseConnections)
            .enter()
            .append('line')
            .attr('class', 'base-connection')
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y)
            .attr('stroke', d => d.data.color)
            .attr('stroke-width', 3)
            .attr('opacity', 0)
            .attr('stroke-linecap', 'round');

        // Animate base connections
        connections.transition()
            .duration(1000)
            .delay((d, i) => i * 50)
            .attr('opacity', 0.6);

        // Draw DNA strand 1 (path)
        const line1 = d3.line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(d3.curveBasis);

        const path1 = g.append('path')
            .datum(strand1Points)
            .attr('class', 'dna-strand-1')
            .attr('d', line1)
            .attr('stroke', 'url(#dna-gradient-1)')
            .attr('stroke-width', 6)
            .attr('fill', 'none')
            .attr('stroke-linecap', 'round')
            .attr('opacity', 0);

        // Draw DNA strand 2 (path)
        const line2 = d3.line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(d3.curveBasis);

        const path2 = g.append('path')
            .datum(strand2Points)
            .attr('class', 'dna-strand-2')
            .attr('d', line2)
            .attr('stroke', 'url(#dna-gradient-2)')
            .attr('stroke-width', 6)
            .attr('fill', 'none')
            .attr('stroke-linecap', 'round')
            .attr('opacity', 0);

        // Animate strands
        path1.transition()
            .duration(1500)
            .attr('opacity', 0.9);

        path2.transition()
            .duration(1500)
            .attr('opacity', 0.9);

        // Add glowing circles at base pair positions
        const circles1 = g.selectAll('.circle-1')
            .data(baseConnections)
            .enter()
            .append('circle')
            .attr('class', 'circle-1')
            .attr('cx', d => d.x1)
            .attr('cy', d => d.y)
            .attr('r', 0)
            .attr('fill', d => d.data.color)
            .attr('opacity', 0.8);

        const circles2 = g.selectAll('.circle-2')
            .data(baseConnections)
            .enter()
            .append('circle')
            .attr('class', 'circle-2')
            .attr('cx', d => d.x2)
            .attr('cy', d => d.y)
            .attr('r', 0)
            .attr('fill', d => d.data.color)
            .attr('opacity', 0.8);

        // Animate circles
        circles1.transition()
            .duration(800)
            .delay((d, i) => i * 50)
            .attr('r', 8);

        circles2.transition()
            .duration(800)
            .delay((d, i) => i * 50)
            .attr('r', 8);

        // Add labels for DNA data
        const labels = g.selectAll('.dna-label')
            .data(baseConnections)
            .enter()
            .append('g')
            .attr('class', 'dna-label')
            .attr('transform', d => `translate(${d.x1 > 0 ? d.x1 + 20 : d.x1 - 20}, ${d.y})`);

        // Add label background with dynamic width and better text wrapping
        labels.append('rect')
            .attr('x', d => d.x1 > 0 ? 0 : 0)
            .attr('y', -18)
            .attr('width', d => {
                // Calculate width based on text length
                const textLength = d.data.label.length;
                return Math.min(Math.max(textLength * 6, 140), 300);
            })
            .attr('height', 36)
            .attr('rx', 18)
            .attr('transform', d => d.x1 > 0 ? '' : `translate(-${Math.min(Math.max(d.data.label.length * 6, 140), 300)}, 0)`)
            .attr('fill', d => d.data.color)
            .attr('opacity', 0)
            .transition()
            .duration(600)
            .delay((d, i) => i * 50 + 500)
            .attr('opacity', 0.95);

        // Add label text with wrapping
        labels.each(function (d) {
            const labelGroup = d3.select(this);
            const boxWidth = Math.min(Math.max(d.data.label.length * 6, 140), 300);
            const words = d.data.label.split(/[\s,]+/);
            const maxCharsPerLine = Math.floor(boxWidth / 6);
            let lines = [];
            let currentLine = '';

            words.forEach(word => {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                if (testLine.length > maxCharsPerLine && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });
            if (currentLine) lines.push(currentLine);

            // Limit to 2 lines for label
            if (lines.length > 2) {
                lines = lines.slice(0, 2);
                lines[1] = lines[1].substring(0, maxCharsPerLine - 3) + '...';
            }

            const lineHeight = 14;
            const startY = lines.length === 1 ? 4 : -3;

            lines.forEach((line, i) => {
                labelGroup.append('text')
                    .attr('x', d.x1 > 0 ? boxWidth / 2 : -boxWidth / 2)
                    .attr('y', startY + (i * lineHeight))
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'white')
                    .attr('font-size', '11px')
                    .attr('font-weight', 'bold')
                    .text(line)
                    .attr('opacity', 0)
                    .transition()
                    .duration(600)
                    .delay(i * 50 + 500)
                    .attr('opacity', 1);
            });
        });

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px')
            .attr('font-weight', 'bold')
            .attr('fill', '#f6806d')
            .text('DNA Skill & Psikologi Anda')
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .delay(500)
            .attr('opacity', 1);


        let rotation = 0;
        const animate = () => {
            rotation += 0.2;
            g.attr('transform', `translate(${width / 2}, 50) rotateY(${rotation})`);
            requestAnimationFrame(animate);
        };

        // Uncomment below for auto-rotation
        // animate();

    }, [skillData, psychologyData, width, height]);

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Legend */}
            <div className="rounded-3xl p-6 shadow-xl border-2 bg-[#F6F4F0] border-[#75B2AB]">
                <h3 className="text-xl font-geist bold mb-4 text-center text-[#0B6B64]">Keterangan Warna</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0B6B64] shadow-lg"></div>
                        <div>
                            <p className="font-geist bold text-sm text-gray-900">Skill Kuat</p>
                            <p className="text-xs font-geist mono text-gray-600">Keahlian utama</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f6806d] shadow-lg"></div>
                        <div>
                            <p className="font-geist bold text-sm text-gray-900">Skill Sedang</p>
                            <p className="text-xs font-geist mono text-gray-600">Perlu pengembangan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8b5cf6] shadow-lg"></div>
                        <div>
                            <p className="font-geist bold text-sm text-gray-900">Skill Lemah</p>
                            <p className="text-xs font-geist mono text-gray-600">Butuh peningkatan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#75B2AB] shadow-lg"></div>
                        <div>
                            <p className="font-geist bold text-sm text-gray-900">Kognitif</p>
                            <p className="text-xs font-geist mono text-gray-600">Cara berpikir</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8b5cf6] shadow-lg"></div>
                        <div>
                            <p className="font-geist bold text-sm text-gray-900">Gaya Belajar</p>
                            <p className="text-xs font-geist mono text-gray-600">Metode belajar</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f6806d] shadow-lg"></div>
                        <div>
                            <p className="font-geist bold text-sm text-gray-900">Motivasi</p>
                            <p className="text-xs font-geist mono text-gray-600">Pendorong diri</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0B6B64] shadow-lg"></div>
                        <div>
                            <p className="font-geist bold text-sm text-gray-900">Kepribadian</p>
                            <p className="text-xs font-geist mono text-gray-600">Karakter diri</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* DNA Helix Visualization */}
            <div className="rounded-3xl bg-[#F6F4F0] border-2 border-[#75B2AB] p-8 shadow-xl flex items-center justify-center">
                <svg ref={svgRef} className="w-full h-auto max-w-4xl mx-auto"></svg>
            </div>
        </div>
    );
}
