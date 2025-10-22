import React, { useState, useMemo, useCallback } from 'react'
import HierTable from './components/HierTable.jsx'
import {
  deepClone,
  buildRoot,
  recomputeSubtotals,
  findNodeById,
  pathToNode,
  distributeToLeaves,
  isLeaf
} from './utils/tree.js'

const initialRows = [
  {
    id: 'electronics',
    label: 'Electronics',
    value: 1400, // will be recomputed from children
    children: [
      { id: 'phones', label: 'Phones', value: 800 },
      { id: 'laptops', label: 'Laptops', value: 700 },
    ],
  },
  {
    id: 'furniture',
    label: 'Furniture',
    value: 1000, // will be recomputed from children
    children: [
      { id: 'tables', label: 'Tables', value: 300 },
      { id: 'chairs', label: 'Chairs', value: 700 },
    ],
  },
]

export default function App() {
  // Create Baseline - To hold immutable base values
  const baseline = useMemo(() => {
    const root = buildRoot(deepClone(initialRows));
    // Ensure parent subtotals are computed from children
    root.children.forEach(recomputeSubtotals);
    return root;
  }, [])

  const [root, setRoot] = useState(() => deepClone(baseline))

  const update = useCallback(fn => setRoot(prev => {
    const n = deepClone(prev);
    fn(n);
    return n;
  }), [])

  // Apply allocation % to a node
  const handlePercent = useCallback((id, p) => {
    update(tree => {
      const n = findNodeById(tree, id);
      if (!n) return;
      if (isLeaf(n)) {
        n.value = Math.round(n.value * (1 + p / 100) * 100) / 100;
      }
      else {
        const target = n.value * (1 + p / 100);
        distributeToLeaves(n, target);
      }
      pathToNode(tree, id).reverse().forEach(nd => !isLeaf(nd) && recomputeSubtotals(nd));
    });
  }, [update])

  // Apply allocation value to a node 
  const handleAbsolute = useCallback((id, v) => {
    update(tree => {
      const n = findNodeById(tree, id);
      if (!n) return;
      if (isLeaf(n)) {
        n.value = Math.round(v * 100) / 100;
      } else {
        distributeToLeaves(n, v);
      }
      pathToNode(tree, id).reverse().forEach(nd => !isLeaf(nd) && recomputeSubtotals(nd));
    });
  }, [update])

  return (<div className="app">
    <h1>Simple Hierarchical Table</h1>
    <button className="reset" onClick={() => setRoot(deepClone(baseline))}>Reset to Baseline</button>
    <HierTable root={root} baseline={baseline} onPercent={handlePercent} onAbsolute={handleAbsolute} />
  </div>)
}
