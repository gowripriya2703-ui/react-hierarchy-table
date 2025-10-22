import React from 'react'
import TreeRow from './TreeRow.jsx'
import { grandTotal, variancePct, round2 } from '../utils/tree.js'

export default function HierTable({ root, baseline, onPercent, onAbsolute }) {
  const gt = grandTotal(root)
  const gtb = grandTotal(baseline)
  const gvar = variancePct(gt, gtb)

  return (
    <div className="table-wrapper">
      <table className="hier-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input &amp; Actions</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {root.children.map((node) => (
            <TreeRow key={node.id}
              node={node}
              baseline={baseline.children.find(b => b.id === node.id)}
              onPercent={onPercent}
              onAbsolute={onAbsolute} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Grand Total</td>
            <td className="num">{round2(gt).toLocaleString()}</td>
            <td></td>
            <td className={`num ${gvar > 0 ? 'pos' : gvar < 0 ? 'neg' : ''}`}>{gvar.toFixed(2)}%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
