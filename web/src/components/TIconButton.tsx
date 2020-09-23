import React from "react";
import { IconButton } from "@chakra-ui/core";
import { IconType } from "react-icons/lib";
import { Icons } from "@chakra-ui/core/dist/theme/icons";

interface TIconButtonProps {
  fontSize?: number;
  icon: IconType | Icons;
  ariaLabel: string;
  color?: string;
  onClick?: any;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const TIconButton: React.FC<TIconButtonProps> = ({
  fontSize = 24,
  icon,
  ariaLabel,
  color,
  onClick,
  isLoading,
  isDisabled,
}) => {
  return (
    <IconButton
      bg="transparent"
      fontSize={fontSize}
      color={color}
      border={0}
      outline={0}
      _hover={{
        bg: "rgba(66, 153, 225, 0.2)",
        outline: 0,
      }}
      _active={{
        outline: 0,
      }}
      _focus={{
        border: 0,
      }}
      icon={icon}
      aria-label={ariaLabel}
      onClick={onClick}
      isDisabled={isDisabled}
      isLoading={isLoading}
    />
  );
};
