import * as CSS from 'csstype';

/**
 * For allowing Bootstrap variables in CSS properties.
 *
 * @see https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
 */
declare module 'csstype' {
  interface Properties {
    '--bs-bg-opacity'?: number;
  }
}
