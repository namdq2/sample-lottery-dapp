import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

import file from './svg/file.svg';
import github from './svg/github.svg';
import globe from './svg/globe.svg';
import google from './svg/google.svg';
import microsoft from './svg/microsoft.svg';
import window from './svg/window.svg';

const IconList = {
  google,
  microsoft,
  github,
  globe,
  file,
  window,
};

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;
interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type Icon = ForwardRefExoticComponent<IconProps>;

export const Icons = IconList as Record<keyof typeof IconList, Icon>;
