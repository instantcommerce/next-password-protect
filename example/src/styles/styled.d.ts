import 'styled-components';
interface Breakpoints extends Array<string> {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}
declare module 'styled-components' {
  type Theme = typeof import('./theme').default;
  export interface DefaultTheme extends Theme {
    breakpoints: Breakpoints;
  }
}
