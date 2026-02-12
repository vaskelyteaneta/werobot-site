declare module '@splidejs/react-splide' {
  import { ComponentType, ReactNode, HTMLAttributes } from 'react';

  export interface SplideOptions {
    type?: 'slide' | 'loop' | 'fade';
    perPage?: number;
    perMove?: number;
    gap?: string;
    pagination?: boolean;
    arrows?: boolean;
    breakpoints?: Record<number, Partial<SplideOptions>>;
    [key: string]: any;
  }

  export interface SplideProps extends HTMLAttributes<HTMLDivElement> {
    options?: SplideOptions;
    'aria-label'?: string;
    children?: ReactNode;
  }

  export interface SplideSlideProps extends HTMLAttributes<HTMLLIElement> {
    children?: ReactNode;
  }

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
}

declare module '@splidejs/react-splide/css';
