import {
  Icon,
  Link,
  Box,
  Flex,
  Divider,
  Button,
  PseudoBox,
} from "@chakra-ui/core";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { IconType } from "react-icons/lib";

interface TLinkProps {
  name: string;
  icon: IconType;
  href: string;
  as?: string;
}

export const TLink: React.FC<TLinkProps> = ({ name, icon, href, as }) => {
  const router = useRouter();
  let active = false;

  if (router.pathname === href) {
    active = true;
  }

  let color = active ? "blue.500" : "white";

  return (
    <Flex>
      <NextLink as={as} href={href}>
        <PseudoBox
          transform="translateX(-15px)"
          as="button"
          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
          px={8}
          rounded={100}
          fontSize={22}
          fontWeight="bold"
          color={color}
          border={0}
          outline={0}
          _hover={{
            bg: "rgba(66, 153, 225, 0.2)",
            color: "rgba(66, 153, 225, 1)",
            opacity: 10,
          }}
          my={2}
          p={4}
        >
          <Flex align="center">
            <Box as={icon} mr={4} />
            <Box transform="translateY(-1px)">{name}</Box>
          </Flex>
        </PseudoBox>
      </NextLink>
    </Flex>
  );
};
