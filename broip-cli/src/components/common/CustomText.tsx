import React, { ReactNode } from 'react';
import { Text as InkText, TextProps } from 'ink';

interface CustomTextProps extends TextProps {
  selectable?: boolean;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingX?: number;
  paddingY?: number;
  marginX?: number;
  marginY?: number;
  onPress?: () => void;
  isDisabled?: boolean;
  children: ReactNode;
}

export const Text: React.FC<CustomTextProps> = ({ 
  selectable,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginX,
  marginY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingX,
  paddingY,
  onPress,
  isDisabled,
  children,
  ...props 
}) => {
  // In a real component, we would handle the selectable functionality
  // and onPress functionality
  // For now, we just pass through the props that are supported
  
  return (
    <InkText {...props}>
      {children}
    </InkText>
  );
};

export default Text;
