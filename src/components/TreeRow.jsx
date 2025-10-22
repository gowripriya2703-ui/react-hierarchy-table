import React, { useState } from 'react'
import Controls from './Controls.jsx'
import { isLeaf, variancePct, round2 } from '../utils/tree.js'

export default function TreeRow({
  node,
  baseline,
  depth = 0,
  onPercent,
  onAbsolute,
  expanded = true
}) {
  const [open, setOpen] = useState(true)
  const variance = variancePct(node.value, baseline?.value ?? node.value)
  const show = expanded && (open || isLeaf(node))

  return (
    <>
      <tr>
        <td style={{ paddingLeft: depth * 16 }}>
          {
            !isLeaf(node) &&
            <button className="toggle" onClick={() => setOpen(!open)} > {open ? '−' : '+'} </button>
          }
          <span className={isLeaf(node) ? 'leaf' : 'group'}>{node.label}</span>
        </td>
        <td className="num"> {round2(node.value).toLocaleString()} </td>
        <td>
          <Controls
            onPercent={p => onPercent(node.id, p)}
            onAbsolute={v => onAbsolute(node.id, v)}
          />
        </td>
        <td>{variance.toFixed(2)}%</td>
      </tr>
      {show && node.children?.map((ch) => (
        <TreeRow key={ch.id}
          node={ch}
          baseline={baseline?.children?.find(b => b.id === ch.id)}
          depth={depth + 1}
          onPercent={onPercent}
          onAbsolute={onAbsolute}
          expanded={expanded} />
      ))}
    </>
  )
}
