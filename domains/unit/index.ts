
/** Unit of acceleration (meter per second squared m/s2) */
export const ACCELERATION = 'acceleration';

/** Unit of plane angle radian (a) rad */
export const ANGLE = 'angle';

/** Unit of area (square meter m2) */
export const AREA = 'area';

/** Unit of electric current */
export const CURRENT = 'electric-current';

/** Unit of mass density kilogram per cubic meter kg/m3 */
export const DENSITY = 'mass-density';

/** Unit of electric charge, quantity of electricity (coulomb C) */
export const ELECTRICITY = 'electric-charge';

/** Unit of electric potential difference, electromotive force (volt V) */
export const ELECTROMOTIVE_FORCE = 'electric-potential-difference';

/** Unit of electric charge density (coulomb per cubic meter C/m3) */

/** Unit of electric field strength (volt per meter V/m) */

/** Unit of electric flux density (coulomb per square meter C/m2) */

/** Unit of energy density (joule per cubic meter J/m3) */
export const ENERGY_DENDITY = "energy-density";

/** Unit of force (newton N) */
export const FORCE = 'force';

/** Unit of frequency (hertz Hz) */
export const FREQUENCY = 'frequency';

/** Unit of inductance (henry, H) */
export const INDUCTANCE = 'inductance'

/** Unit of length (meter) */
export const LENGTH = 'length';

/** Unit of luminous intensity (candela) */
export const LIGHT = 'luminous-intensity';

/** Unit of luminance (candela per square meter cd/m2) */
export const LUMINANCE = 'luminance';

/** Unit of magnetic flux (weber Wb) */
export const MAGNETIC_FLUX = 'magnetic flux';

/** Unit of magnetic flux density (tesla, T) */
export const MAGNETIC_FLUX_DENSITY = 'magnetic-flux-density';

/** Unit of mass (kilogram) */
export const MASS = 'mass';

/** Unit of power, radiant flux (watt W) */
export const POWER = 'radiant-flux';

/** Unit of pressure, stress (pascal Pa N/m2) */
export const PRESURE = 'presure';

/** Unit of electric resistance (ohm) */
export const RESISTANCE = 'electric-resistance';

/** Unit of amount of substance (mole) */
export const SUBSTANCE = 'amount-of-substance';

/** Unit of thermodynamic temperature (kelvin	K) */
export const TEMPERATURE = 'thermodynamic-temperature';

/** Unit of time (second) */
export const TIME = 'time';

/** Unit of speed, velocity (meter per second m/s) */
export const VELOCITY = 'velocity';

/** Unit of volume (cubic meter m3) */
export const VOLUME = 'volume';

/** Unit of wave number (reciprocal meter m-1) */
export const WAVE = 'wave';

/** Unit of energy, work, quantity of heat (joule, J) */
export const WORK = 'quantity-of-heat';

export const UNITS = [
  ACCELERATION,
  ANGLE,
  AREA,
  CURRENT,
  DENSITY,
  ELECTRICITY,
  ELECTROMOTIVE_FORCE,
  FORCE,
  FREQUENCY,
  LENGTH,
  LIGHT,
  LUMINANCE,
  MASS,
  POWER,
  PRESURE,
  RESISTANCE,
  SUBSTANCE,
  TEMPERATURE,
  TIME,
  VELOCITY,
  VOLUME,
  WAVE
] as const;

export type Unit = typeof UNITS[number];

/** Unit of specific volume cubic meter per kilogram m3/kg */

/** Unit of current density ampere per square meter A/m2 */

/** Unit of magnetic field strength   ampere per meter A/m */

/** Unit of amount-of-substance concentration mole per cubic meter mol/m3 */

/** Unit of mass fraction kilogram per kilogram, which may be represented by the number 1 kg/kg = 1 */

/** Unit of solid angle (steradian, sr) */



/** Unit of capacitance (farad F) */

/** Unit of electric conductance (siemens S) */




/** Unit of Celsius temperature (degree Celsius °C) */

/** Unit of luminous flux (lumen, lm) */

/** Unit of illuminance (lux lx) */

/** Unit of activity (of a radionuclide) (becquerel Bq) */

/** Unit of absorbed dose, specific energy (imparted), kerma (gray Gy) */

/** Unit of dose equivalent (sievert, Sv) */

/** Unit of catalytic activity (katal, kat) */

/** Unit of dynamic viscosity (pascal second Pa·s) */

/** Unit of moment of force (newton meter N·m) */

/** Unit of surface tension (newton per meter N/m) */

/** Unit of angular velocity (radian per second rad/s) */

/** Unit of angular acceleration (radian per second squared rad/s2) */

/** Unit of heat flux density, irradiance (watt per square meter W/m2) */

/** Unit of heat capacity, entropy (joule per kelvin J/K) */

/** Unit of specific heat capacity, specific entropy (joule per kilogram kelvin J/(kg·K)) */

/** Unit of specific energy (joule per kilogram J/kg) */

/** Unit of thermal conductivity (watt per meter kelvin W/(m·K)) */

/** Unit of permittivity (farad per meter F/m) */

/** Unit of permeability (henry per meter H/m) */

/** Unit of molar energy (joule per mole J/mol) */

/** Unit of molar entropy, molar heat capacity joule per mole kelvin J/(mol·K)) */

/** Unit of exposure (x and gamma rays) coulomb per kilogram C/kg) */

/** Unit of absorbed dose rate (gray per second Gy/s) */

/** Unit of radiant intensity (watt per steradian W/sr) */

/** Unit of radiance (watt per square meter steradian W/(m2·sr)) */

/** Unit of catalytic (activity) concentration katal per cubic meter kat/m3) */
