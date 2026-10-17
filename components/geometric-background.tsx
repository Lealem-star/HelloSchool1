'use client'

import React, { useEffect, useRef } from 'react'
import { useTheme } from '@/components/theme-provider'

interface GridNode {
  col: number
  row: number
  originX: number
  originY: number
  x: number
  y: number
  vx: number
  vy: number
  targetX: number
  targetY: number
  radius: number
  targetRadius: number
  color: string
  targetColor: string
  opacity: number
  targetOpacity: number
  isHighlighted: boolean
}

interface Connection {
  from: number
  to: number
}

export function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const SPACING = 54 // Grid spacing in px
    let cols = Math.ceil(width / SPACING) + 2
    let rows = Math.ceil(height / SPACING) + 2
    let nodes: GridNode[] = []
    let connections: Connection[] = []

    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      isHovering: false,
    }

    // Build the triangulated geometric lattice
    function initGrid() {
      width = window.innerWidth
      height = window.innerHeight

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      ctx!.scale(dpr, dpr)

      cols = Math.ceil(width / SPACING) + 2
      rows = Math.ceil(height / SPACING) + 2

      const offsetX = (width - (cols - 1) * SPACING) / 2
      const offsetY = (height - (rows - 1) * SPACING) / 2

      nodes = []
      connections = []

      // Create nodes
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = offsetX + c * SPACING
          const originY = offsetY + r * SPACING

          nodes.push({
            col: c,
            row: r,
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            targetX: originX,
            targetY: originY,
            radius: 2,
            targetRadius: 2,
            color: '#10b981',
            targetColor: '#10b981',
            opacity: 0.35,
            targetOpacity: 0.35,
            isHighlighted: false,
          })
        }
      }

      // Create triangular lattice connections
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c

          // Horizontal connection to right neighbor
          if (c < cols - 1) {
            connections.push({ from: idx, to: idx + 1 })
          }

          // Vertical connection to bottom neighbor
          if (r < rows - 1) {
            connections.push({ from: idx, to: idx + cols })
          }

          // Diagonal connection to create triangulation
          if (r < rows - 1 && c < cols - 1) {
            if ((r + c) % 2 === 0) {
              connections.push({ from: idx, to: idx + cols + 1 })
            } else if (c > 0) {
              connections.push({ from: idx, to: idx + cols - 1 })
            }
          }
        }
      }
    }

    initGrid()

    // Mouse movement tracking
    const onPointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
      mouse.isHovering = true
    }

    const onPointerLeave = () => {
      mouse.targetX = -2000
      mouse.targetY = -2000
      mouse.isHovering = false
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX
        mouse.targetY = e.touches[0].clientY
        mouse.isHovering = true
      }
    }

    const onTouchEnd = () => {
      mouse.targetX = -2000
      mouse.targetY = -2000
      mouse.isHovering = false
    }

    let resizeTimer: any = null
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        initGrid()
      }, 150)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('resize', onResize)

    // Physics parameters
    const REPEL_RADIUS = 165
    const REPEL_POWER = 115
    const SPRING_STRENGTH = 0.16
    const DAMPING = 0.78

    let startTime = performance.now()

    // Main animation loop
    function render(time: number) {
      if (!ctx || !canvas) return

      const elapsed = time - startTime

      // Smooth mouse coordinate interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.14
      mouse.y += (mouse.targetY - mouse.y) * 0.14

      ctx.clearRect(0, 0, width, height)

      // Theme-based colors
      const outerColor = isDark ? '#38bdf8' : '#10b981' // soft cyan in dark, emerald in light
      const highlightColor = isDark ? '#818cf8' : '#155DFC' // electric royal blue / indigo near cursor
      const baseLineColor = isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(148, 163, 184, 0.22)'
      const activeLineColor = isDark ? 'rgba(129, 140, 248, 0.45)' : 'rgba(21, 93, 252, 0.35)'

      // Update node physics
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        const dx = node.originX - mouse.x
        const dy = node.originY - mouse.y
        const dist = Math.hypot(dx, dy)

        if (dist < REPEL_RADIUS && dist > 0.001) {
          // Circular warp repulsion pushing nodes away from cursor
          const angle = Math.atan2(dy, dx)
          // Spherical falloff pushes interior nodes towards the perimeter
          const t = 1 - dist / REPEL_RADIUS
          const push = Math.sin(t * Math.PI * 0.85) * REPEL_POWER

          node.targetX = node.originX + Math.cos(angle) * push
          node.targetY = node.originY + Math.sin(angle) * push

          // Highlight nodes pushed into the perimeter ring
          node.targetRadius = 4.5
          node.targetColor = highlightColor
          node.targetOpacity = isDark ? 0.95 : 0.85
          node.isHighlighted = true
        } else {
          // Ambient gentle breathing / wave when resting
          const waveX = Math.sin(elapsed * 0.0015 + node.col * 0.35 + node.row * 0.25) * 2.2
          const waveY = Math.cos(elapsed * 0.0015 + node.col * 0.25 + node.row * 0.35) * 2.2

          node.targetX = node.originX + waveX
          node.targetY = node.originY + waveY

          node.targetRadius = isDark ? 2.2 : 2.0
          node.targetColor = outerColor
          node.targetOpacity = isDark ? 0.35 : 0.32
          node.isHighlighted = false
        }

        // Apply spring physics
        node.vx = (node.vx + (node.targetX - node.x) * SPRING_STRENGTH) * DAMPING
        node.vy = (node.vy + (node.targetY - node.y) * SPRING_STRENGTH) * DAMPING
        node.x += node.vx
        node.y += node.vy

        node.radius += (node.targetRadius - node.radius) * 0.2
        node.opacity += (node.targetOpacity - node.opacity) * 0.2
        node.color = node.targetColor
      }

      // Draw lattice connections
      ctx.lineWidth = 0.9
      for (let i = 0; i < connections.length; i++) {
        const { from, to } = connections[i]
        const nA = nodes[from]
        const nB = nodes[to]

        if (!nA || !nB) continue

        const isHighlighted = nA.isHighlighted || nB.isHighlighted

        ctx.strokeStyle = isHighlighted ? activeLineColor : baseLineColor
        ctx.lineWidth = isHighlighted ? 1.25 : 0.85

        ctx.beginPath()
        ctx.moveTo(nA.x, nA.y)
        ctx.lineTo(nB.x, nB.y)
        ctx.stroke()
      }

      // Draw nodes (dots)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        // Outer glow halo for highlighted nodes
        if (node.isHighlighted) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius + 2.5, 0, Math.PI * 2)
          ctx.fillStyle = isDark ? 'rgba(129, 140, 248, 0.22)' : 'rgba(21, 93, 252, 0.16)'
          ctx.fill()
        }

        // Main node dot
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.globalAlpha = node.opacity
        ctx.fill()
      }

      ctx.globalAlpha = 1.0

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    // Pause animation when tab is inactive to save resources
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId)
      } else {
        startTime = performance.now()
        animationFrameId = requestAnimationFrame(render)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      clearTimeout(resizeTimer)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 size-full transition-opacity duration-700"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  )
}
