import React, { Children } from "react";
import { Flex, IconButton, Text } from "@chakra-ui/core";
import { HiOutlineSparkles } from "react-icons/hi";

interface THeaderProps {}

export const THeader: React.FC<THeaderProps> = ({ children }) => {
  return (
    <Flex
      borderBottom="1px"
      borderColor="gray.800"
      px={8}
      h={20}
      justify="space-between"
      align="center"
    >
      {children}
    </Flex>
  );
};
