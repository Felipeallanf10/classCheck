declare module 'lucide-react' {
  import * as React from 'react';

  export type LucideProps = React.SVGProps<SVGSVGElement> & {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
  };

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const Star: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Flame: LucideIcon;
  export const Award: LucideIcon;
  export const Calendar: LucideIcon;
  export const Trophy: LucideIcon;
  export const Medal: LucideIcon;

  export const createLucideIcon: (
    iconName: string,
    iconNode: Array<[string, Record<string, unknown>]>
  ) => LucideIcon;

  export type IconNode = Array<[string, Record<string, unknown>]>;
}
