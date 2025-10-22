import React, { useState } from 'react'

export default function Controls({ onPercent, onAbsolute }) {
  const [input, setInput] = useState('')

  const applyPercent = () => {
    if (input === undefined || input === null) return;
    const num = Number(input)
    if (!Number.isFinite(num)) return
    onPercent?.(num)
    setInput('')
  }

  const applyAbsolute = () => {
    if (input === undefined || input === null) return;
    const num = Number(input)
    if (!Number.isFinite(num)) return
    onAbsolute?.(num)
    setInput('')
  }

  return (
    <div className="controls">
      <input type="number" min="1" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number" />
      <button onClick={applyPercent}>Allocation %</button>
      <button onClick={applyAbsolute}>Allocation Val</button>
    </div>
  )
}
