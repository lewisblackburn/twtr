import { ApolloCache, gql } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import NextLink from "next/link";
import React from "react";
import { FaComment, FaHeart, FaRetweet, FaShare } from "react-icons/fa";
import {
  HeartMutation,
  PostSnippetFragment,
  RetweetMutation,
  useHeartMutation,
  useHeartsQuery,
  useMeQuery,
  useRetweetMutation,
} from "../generated/graphql";
import { useConvertUnixTimestamp } from "../utils/useConvertUnixTimestamp";
import { Heart } from "./Heart";
import { Retweet } from "./Retweet";
import { TIconButton } from "./TIconButton";

interface PostProps {
  post: PostSnippetFragment;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const { minutes, hours, date } = useConvertUnixTimestamp(post.createdAt);

  return (
    <Box whiteSpace="pre-wrap" borderY="1px" borderColor="gray.800">
      {post.retweet && <Text>{post.retweeter?.displayname} Retweeted</Text>}
      <Grid p={4} width={650} templateColumns="60px 1fr">
        <NextLink href="/user/[username]" as={`/user/${post.creator.username}`}>
          <Link>
            <Avatar
              cursor="pointer"
              name={post.creator.username}
              src={post.creator.avatar}
            />
          </Link>
        </NextLink>
        <NextLink href="/tweet/[id]" as={`/tweet/${post.id}`}>
          <Box cursor="pointer">
            <Flex align="center" justify="space-between">
              <Flex color="white">
                <Text>{post.creator.displayname}</Text>
                <Text color="gray.500" mx={2}>
                  @{post.creator.username}
                </Text>
                <Text color="gray.500" fontWeight="bolder" mr={2}>
                  ·
                </Text>
                <Link title={date} color="gray.500">
                  {minutes > 60
                    ? `${hours} hour${hours !== 1 ? "s" : ""}`
                    : `${minutes} minute${minutes !== 1 ? "s" : ""}`}
                </Link>
              </Flex>
            </Flex>
            <Box>
              <Text>{post.text}</Text>
            </Box>
          </Box>
        </NextLink>
      </Grid>
      <Flex mt={2} mb={4} mx="70px" justify="space-between" color="gray.600">
        <Flex align="center" justify="space-between">
          <TIconButton fontSize={18} icon={FaComment} ariaLabel="comments" />
          <Text ml={1}>{0}</Text>
        </Flex>
        <Flex align="center" justify="space-between">
          <Retweet post={post} />
        </Flex>
        <Flex align="center" justify="space-between">
          <Heart post={post} />
        </Flex>
        <TIconButton fontSize={18} icon={FaShare} ariaLabel="share" />
      </Flex>
    </Box>
  );
};
