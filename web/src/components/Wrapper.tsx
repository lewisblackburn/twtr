import React from "react";
import { Box } from "@chakra-ui/core";
import { WrapperVariant } from "./Layout";

export const Wrapper: React.FC<{}> = ({ children }) => {
  return (
    <Box color="white" h="100%" w="100%">
      {children}
    </Box>
  );
};
