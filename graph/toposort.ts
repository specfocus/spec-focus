/**
 * Topological sorting function
 * https://github.com/marcelklehr/toposort
 * Copyright (c) 2012 by Marcel Klehr <mklehr@gmx.net>
 * @param {Array} edges
 * @returns {Array}
 */
export default function <T extends number | string>(edges: Edge<T>[]): Edge<T>[] {
  return toposort(uniqueNodes(edges), edges);
}

type Weight = number;
type Node<T extends number | string> = T;
type Edge<T extends number | string> = any | [Node<T>, Node<T>, Weight];
type Graph<T extends number | string> = Map<Node<T>, Map<Node<T>, Weight>>;

export const newGraph = <T extends number | string>(): Graph<T> =>
  new Map<Node<T>, Map<Node<T>, Weight>>();

export const addEdge = <T extends number | string>(edge: Edge<T>, graph?: Graph<T>): Graph<T> => {
  if (!graph) {
    graph = newGraph<T>();
  }
  const [left, right, weight] = edge;
  let neighbors = graph.get(left);

  if (!neighbors) {
    neighbors = new Map<Node<T>, Weight>();
    graph.set(left, neighbors);
  }

  neighbors.set(right, weight);

  return graph;
};

export const makeGraph = <T extends number | string>(edges: Edge<T>[]): Graph<T> =>
  edges.reduce(
    (graph: Graph<T>, edge: Edge<T>) => addEdge<T>(edge, graph),
    newGraph<T>()
  );

export class Toposort<T extends number | string> {
  static from = <T extends number | string>(edges: Edge<T>[]): Toposort<T> =>
    new Toposort<T>(makeGraph(edges));

  constructor(public graph: Graph<T>) {
  }

  get nodes(): Node<T>[] {
    const origins = this.graph.keys();
    const result = new Set(origins);
    for (const o of origins) {
      for (const d of this.graph.get(o).keys()) {
        result.add(d);
      }
    }
    return Array.from(result);
  }

  toposort = () => {

  }
}

export const array = toposort;

function toposort<T extends number | string>(nodes: Node<T>[], edges: Edge<T>[]) {
  let cursor = nodes.length;
  const sorted = new Array(cursor);
  const visited: Record<number, boolean> = {};
  let i = cursor;
    // Better data structures make algorithm much faster.
  const outgoingEdges = makeOutgoingEdges<T>(edges);
  const nodesHash = makeNodesHash<T>(nodes);

  // check for unknown nodes
  edges.forEach((edge) => {
    if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
      throw new Error('Unknown node. There is an unknown node in the supplied edges.');
    }
  });

  while (i--) {
    if (!visited[i]) {
      visit(nodes[i], i, new Set());
    }
  }

  return sorted;

  function visit(node: Node<T>, i: number, predecessors: Set<Node<T>>) {
    if (predecessors.has(node)) {
      let nodeRep;
      try {
        nodeRep = ", node was:" + JSON.stringify(node);
      } catch (e) {
        nodeRep = "";
      }
      throw new Error('Cyclic dependency' + nodeRep);
    }

    if (!nodesHash.has(node)) {
      throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: ' + JSON.stringify(node));
    }

    if (visited[i]) return;
    visited[i] = true;

    const outgoing: Set<Node<T>> = outgoingEdges.get(node) || new Set<Node<T>>();
    const outgoingArr = Array.from(outgoing);

    if (i = outgoingArr.length) {
      predecessors.add(node);
      do {
        const child = outgoingArr[--i];
        visit(child, nodesHash.get(child), predecessors);
      } while (i);
      predecessors.delete(node);
    }

    sorted[--cursor] = node;
  }
}

function uniqueNodes<T extends number | string>(arr: Edge<T>[]): Node<T>[] {
  const res = new Set<Node<T>>();
  for (let i = 0, len = arr.length; i < len; i++) {
    const [left, right] = arr[i];
    res.add(left);
    res.add(right);
  }
  return Array.from(res);
}

function makeOutgoingEdges<T extends number | string>(arr: Edge<T>[]): Map<Node<T>, Set<Node<T>>> {
  const edges = new Map<Node<T>, Set<Node<T>>>();
  for (let i = 0, len = arr.length; i < len; i++) {
    const edge = arr[i];
    if (!edges.has(edge[0])) {
      edges.set(edge[0], new Set<Node<T>>());
    }
    if (!edges.has(edge[1])) {
      edges.set(edge[1], new Set<Node<T>>());
    }
    edges.get(edge[0]).add(edge[1]);
  }
  return edges;
}

function makeNodesHash<T extends number | string>(arr: Node<T>[]): Map<Node<T>, number> {
  const res = new Map<Node<T>, number>();
  for (let i = 0, len = arr.length; i < len; i++) {
    res.set(arr[i], i);
  }
  return res;
}