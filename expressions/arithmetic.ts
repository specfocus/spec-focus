export const PARENTHETICAL = /\(([0-9+\-*/\^ .]+)\)/;             // Regex for identifying parenthetical expressions
export const EXPONENTIAL = /(\d+(?:\.\d+)?) ?\^ ?(\d+(?:\.\d+)?)/; // Regex for identifying exponentials (x ^ y)
export const MULTIPLICATION = /(\d+(?:\.\d+)?) ?\* ?(\d+(?:\.\d+)?)/; // Regex for identifying multiplication (x * y)
export const DIVISION = /(\d+(?:\.\d+)?) ?\/ ?(\d+(?:\.\d+)?)/; // Regex for identifying division (x / y)
export const ADDITION = /(\d+(?:\.\d+)?) ?\+ ?(\d+(?:\.\d+)?)/; // Regex for identifying addition (x + y)
export const SUBSTRACTION = /(\d+(?:\.\d+)?) ?- ?(\d+(?:\.\d+)?)/;  // Regex for identifying subtraction (x - y)

/**
 * Evaluates a numerical expression as a string and returns a Number
 * Follows standard PEMDAS operation ordering
 * @param {String} expr Numerical expression input
 * @returns {Number} Result of expression
 * @example evaluate('2 + 4*(30/5) - 34 + 45/2')
 */
const evaluate = (expr: string): number => Number(reduce(expr));

/**
 * Evaluates a numerical expression as a string and returns a Number
 * Follows standard PEMDAS operation ordering
 * @param {String} expr Numerical expression input
 * @returns {Number} Result of expression
 * @example evaluate("2 + 4*(30/5) - 34 + 45/2")
 */
export const reduce = (expr: string): string => {
  if (PARENTHETICAL.test(expr)) {
    return reduce(
      expr.replace(
        PARENTHETICAL,
        (_match, subExpr) => reduce(subExpr)
      )
    );
  }

  if (EXPONENTIAL.test(expr)) {
    return reduce(
      expr.replace(
        EXPONENTIAL,
        (_match, base, pow) => String(Math.pow(Number(base), Number(pow)))
      )
    );
  }

  if (MULTIPLICATION.test(expr)) {
    return reduce(
      expr.replace(
        MULTIPLICATION,
        (_match, a, b) => String(Number(a) * Number(b))
      )
    );
  }

  if (DIVISION.test(expr)) {
    return reduce(
      expr.replace(
        DIVISION,
        (_match, a, b) => {
          if (b != 0)
            return String(Number(a) / Number(b));
          else
            throw new Error('Division by zero');
        }
      )
    );
  }

  if (ADDITION.test(expr)) {
    return reduce(
      expr.replace(
        ADDITION,
        (_match, a, b) => String(Number(a) + Number(b))
      )
    );
  }

  if (SUBSTRACTION.test(expr)) {
    return reduce(
      expr.replace(
        SUBSTRACTION,
        (_match, a, b) => String(Number(a) - Number(b))
      ));
  }
  return expr;
};

export default evaluate;