import { Grid, Box, Flex } from "@chakra-ui/core";
import React from "react";
import { Info } from "./Info";
import { Sidebar } from "./Sidebar";
import { Wrapper } from "./Wrapper";

export type WrapperVariant = "small" | "regular";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Wrapper>
      <Grid
        mx="auto"
        width={variant === "regular" ? "1600px" : "800px"}
        templateColumns="1fr 2fr 1fr"
      >
        <Box p={8} borderRight="1px" borderColor="gray.800">
          <Sidebar />
        </Box>
        <Box pos="relative">{children}</Box>
        <Box p={8} borderLeft="1px" borderColor="gray.800">
          <Info />
        </Box>
      </Grid>
    </Wrapper>
  );
};
