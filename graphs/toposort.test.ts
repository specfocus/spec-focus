import toposort, { array as toposortArray } from './toposort';

describe('toposort', () => {
  describe('toposort acyclic graphs', () => {
    /*(read downwards)
    6  3
    |  |
    5->2
    |  |
    4  1
    */
    const result = toposort(
      [
        ['3', '2'],
        ['2', '1'],
        ['6', '5'],
        ['5', '2'],
        ['5', '4']
      ]);

    it('should be sorted correctly, ', () => {
      expect(result).toBeInstanceOf(Array);
      // valid permutations
      (expect(result) as any).toBeOneOf(
        [
          ['3', '6', '5', '2', '1', '4'],
          ['3', '6', '5', '2', '4', '1'],
          ['6', '3', '5', '2', '1', '4'],
          ['6', '5', '3', '2', '1', '4'],
          ['6', '5', '3', '2', '4', '1'],
          ['6', '5', '4', '3', '2', '1'],
        ]
      );
    });
  });

  describe('simple cyclic graphs', () => {
    /*
    foo<->bar
    */
    it('should throw an exception', () => {
      expect(jest.fn(() => toposort(
        [
          ['foo', 'bar'],
          ['bar', 'foo']// cyclic dependecy
        ]))).toThrowError();
    });
  });

  describe('complex cyclic graphs', () => {
    /*
    foo
    |
    bar<-john
    |     ^
    ron->tom
    */
    it('should throw an exception', () => {
      expect(jest.fn(() => toposort(
        [
          ['foo', 'bar'],
          ['bar', 'ron'],
          ['john', 'bar'],
          ['tom', 'john'],
          ['ron', 'tom']// cyclic dependecy
        ]))).toThrow(Error);
    });
  });

  describe('unknown nodes in edges', () => {
    it('should throw an exception', () => {
      expect(
        jest.fn(() => toposortArray(['bla'],
          [
            ['foo', 'bar'],
            ['bar', 'ron'],
            ['john', 'bar'],
            ['tom', 'john'],
            ['ron', 'tom']
          ])
      )).toThrow=(Error/*'Unknown node. There is an unknown node in the supplied edges.'*/);
    });
  });

  describe('triangular dependency', () => {
    /*
    a-> b
    |  /
    c<-
    */
    it('shouldn\'t throw an error', () => {
      expect(toposort([
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'c']
      ])).toEqual(['a', 'b', 'c']);
    });
  });
  describe('toposortArray', () => {
    const result = toposortArray(['d', 'c', 'a', 'b'], [['a', 'b'], ['b', 'c']]);
    it('should include unconnected nodes', () => {
      const i = result.indexOf('d');
      expect(i).toBeGreaterThanOrEqual(0);
      result.splice(i, 1);
      expect(result).toEqual(['a', 'b', 'c']);
    });
  });
  describe('toposortArray mutation', () => {
    const array = ['d', 'c', 'a', 'b'];
    toposortArray(array, [['a', 'b'], ['b', 'c']]);

    it('should not mutate its arguments', () => {
      expect(array).toEqual(['d', 'c', 'a', 'b']);
    });
  });
  describe('giant graphs', () => {
    const graph: any[] = []
      , nodeCount = 100000;
    for (let i = 0; i < nodeCount; i++) {
      graph.push([i, i + 1]);
    }

    it('should sort quickly', () => {
      const start = (new Date).getTime();
      const sorted = toposort(graph);
      const end = (new Date).getTime();
      const elapsedSeconds = (end - start) / 1000;
      expect(elapsedSeconds).toBeLessThan(1);
    });
  });

  describe('object keys', () => {
    const o1 = { k1: 'v1', nested: { k2: 'v2' } };
    const o2 = { k2: 'v2' };
    const o3 = { k3: 'v3' };
    const graph = [[o1, o2], [o2, o3]];

    it('should handle object nodes', () => {
      expect(toposort(graph)).toEqual([{ k1: 'v1', nested: { k2: 'v2' } }, { k2: 'v2' }, { k3: 'v3' }]);
    });
  });
});