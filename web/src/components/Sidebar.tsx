import { Box, Button, Flex } from "@chakra-ui/core";
import React from "react";
import { BsPersonFill } from "react-icons/bs";
import {
  FaBell,
  FaBookmark,
  FaEllipsisH,
  FaHashtag,
  FaList,
  FaMailBulk,
  FaTwitter,
} from "react-icons/fa";
import { RiHome7Fill } from "react-icons/ri";
import { TLink } from "./TLink";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export const Sidebar: React.FC<{}> = () => {
  const router = useRouter();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({ skip: isServer() });

  if (loading && !data) {
    return <div>loading</div>;
  } else {
    return (
      <Box pos="fixed" width="330px">
        <Box as={FaTwitter} size="32px" color="white" />
        <Flex align="flex-start" flexDirection="column" my={8}>
          <TLink name="Home" icon={RiHome7Fill} href="/" />
          <TLink name="Explore" icon={FaHashtag} href="/explore" />
          <TLink name="Notifications" icon={FaBell} href="/notifications" />
          <TLink name="Messages" icon={FaMailBulk} href="/messages" />
          <TLink name="Bookmarks" icon={FaBookmark} href="/bookmarks" />
          <TLink name="Lists" icon={FaList} href="/lists" />
          <TLink
            name="Profile"
            icon={BsPersonFill}
            as={`/user/${data?.me?.username}`}
            href={"/user/[username]"}
          />
          <TLink name="More" icon={FaEllipsisH} href="/more" />
          {data?.me ? (
            <Button
              w="100%"
              bg="blue.500"
              color="white"
              mt={8}
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
                router.reload();
              }}
              isLoading={logoutFetching}
            >
              Logout
            </Button>
          ) : (
            <Button
              w="100%"
              bg="blue.500"
              color="white"
              mt={8}
              onClick={async () => {
                router.replace("login?next=" + router.asPath);
              }}
              isLoading={logoutFetching}
            >
              Login
            </Button>
          )}
        </Flex>
      </Box>
    );
  }
};
