import React, { ReactNode } from 'react';
import { Box as InkBox, BoxProps } from 'ink';

interface CustomBoxProps extends BoxProps {
  paddingX?: number;
  paddingY?: number;
  marginX?: number;
  marginY?: number;
  onPress?: () => void;
  isDisabled?: boolean;
  backgroundColor?: string;
  color?: string;
  children: ReactNode;
}

export const Box: React.FC<CustomBoxProps> = ({ 
  paddingX, 
  paddingY, 
  marginX,
  marginY,
  onPress,
  isDisabled,
  backgroundColor,
  color,
  children,
  ...props 
}) => {
  // Convert paddingX/Y to paddingLeft/Right/Top/Bottom
  const paddingProps = {
    ...(paddingX !== undefined ? { paddingLeft: paddingX, paddingRight: paddingX } : {}),
    ...(paddingY !== undefined ? { paddingTop: paddingY, paddingBottom: paddingY } : {})
  };

  // Convert marginX/Y to marginLeft/Right/Top/Bottom
  const marginProps = {
    ...(marginX !== undefined ? { marginLeft: marginX, marginRight: marginX } : {}),
    ...(marginY !== undefined ? { marginTop: marginY, marginBottom: marginY } : {})
  };

  // Handle onPress (in a real app, this would use useInput or similar)
  const handlePress = () => {
    if (onPress && !isDisabled) {
      onPress();
    }
  };

  // In a real implementation, we would handle backgroundColor and color
  // For now, we just pass through the standard props

  return (
    <InkBox {...paddingProps} {...marginProps} {...props}>
      {children}
    </InkBox>
  );
};

export default Box;
