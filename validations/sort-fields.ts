import isSchema from '../schemas/is-schema';
import { array as toposort } from '../graphs/toposort';
import { split } from '../objects/property-expr';
import { ObjectShape } from '../shapes/shape-schema';
import Ref from '../references/reference-schema';

export default function sortFields(
  fields: ObjectShape,
  excludedEdges: readonly [string, string][] = [],
) {
  const edges = [] as [string, string][];
  const nodes = new Set<string>();
  const excludes = new Set(excludedEdges.map(([a, b]) => `${a}-${b}`));

  function addNode(depPath: string, key: string) {
    const node = split(depPath)[0];

    nodes.add(node);
    if (!excludes.has(`${key}-${node}`)) edges.push([key, node]);
  }

  for (const key of Object.keys(fields)) {
    const value = fields[key];

    nodes.add(key);

    if (Ref.isRef(value) && value.isSibling) addNode(value.path, key);
    else if (isSchema(value) && 'deps' in value)
      value.deps.forEach((path) => addNode(path, key));
  }

  return toposort(Array.from(nodes), edges).reverse() as string[];
}
