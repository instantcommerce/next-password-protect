import { SxStyleProp } from 'rebass';
import * as StyledComponents from 'styled-components';
import * as StyledSystem from 'styled-system';

declare module 'rebass' {
  type ThemedSxStyleProps =
    | SxStyleProp
    | StyledSystem.SpaceProps<StyledComponents.DefaultTheme>
    | StyledSystem.TypographyProps<StyledComponents.DefaultTheme>
    | StyledSystem.FlexboxProps<StyledComponents.DefaultTheme>
    | StyledSystem.GridProps<StyledComponents.DefaultTheme>
    | StyledSystem.LayoutProps<StyledComponents.DefaultTheme>
    | StyledSystem.ColorProps<StyledComponents.DefaultTheme>;

  export interface SxProps {
    maatje?: boolean;
    sx?: ThemedSxStyleProps;
  }
}
