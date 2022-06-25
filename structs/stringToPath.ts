import compact from '../arrays/compact';

export default (input: string): string[] =>
  compact(input.replace(/["|']|\]/g, '').split(/\.|\[/));
