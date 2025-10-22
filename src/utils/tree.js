export function deepClone(obj) {
  return structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
}
export function isLeaf(node) { return !node.children || node.children.length === 0; }
export function recomputeSubtotals(node) {
  if (!node) return 0;
  if (isLeaf(node)) return Number(node.value)||0;
  let sum = 0;
  node.children.forEach(ch=>sum+=recomputeSubtotals(ch));
  node.value = round2(sum); return node.value;
}
export function walkTree(node,cb,parent=null){ if(!node)return; cb(node,parent); if(node.children)node.children.forEach(ch=>walkTree(ch,cb,node));}
export function findNodeById(node,id){let found=null; walkTree(node,n=>{if(n.id===id)found=n}); return found;}
export function pathToNode(root,id){const path=[];function dfs(n,cur){cur.push(n);if(n.id===id){path.push(...cur);return true;}if(n.children){for(const ch of n.children){if(dfs(ch,cur.slice()))return true;}}return false;}dfs(root,[]);return path;}
export function leavesUnder(node){const leaves=[];walkTree(node,n=>{if(isLeaf(n))leaves.push(n)});return leaves;}
export function round2(x){return Math.round((Number(x)||0)*100)/100;}
export function distributeToLeaves(node,targetTotal){const leaves=leavesUnder(node);const current=leaves.reduce((a,l)=>a+(Number(l.value)||0),0);if(current<=0){const equal=round2(targetTotal/Math.max(leaves.length,1));leaves.forEach(l=>l.value=equal);}else{leaves.forEach(l=>{const frac=(Number(l.value)||0)/current; l.value=round2(frac*targetTotal);});}recomputeSubtotals(node);}
export function variancePct(cur,base){const c=Number(cur)||0,b=Number(base)||0;if(b===0)return c===0?0:100;return round2(((c-b)/b)*100);}
export function buildRoot(rows){return {id:'__root__',label:'Root',value:0,children:rows};}
export function grandTotal(root){if(!root?.children)return 0;return round2(root.children.reduce((a,n)=>a+(Number(n.value)||0),0));}
