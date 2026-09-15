declare module '@/styles/*.js' {
  import type { ComponentType, ReactNode } from 'react';

  type AnyStyled = ComponentType<Record<string, unknown> & { children?: ReactNode }>;

  const Component: AnyStyled;
  export default Component;
  export const Card: AnyStyled;
  export const Image: AnyStyled;
  export const CardBody: AnyStyled;
  export const SignInOut: AnyStyled;
  export const ContentImage: AnyStyled;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
