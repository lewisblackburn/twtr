import { ApolloCache } from "@apollo/client";
import {
  Box,
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/core";
import gql from "graphql-tag";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import {
  HeartMutation,
  PostSnippetFragment,
  useHeartMutation,
  useHeartsLazyQuery,
  useHeartsQuery,
} from "../generated/graphql";
import { TIconButton } from "./TIconButton";

interface HeartProps {
  post: PostSnippetFragment;
}

const updateAfterHeart = (
  postId: number,
  cache: ApolloCache<HeartMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    heartCount: number;
    heartStatus: boolean;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        heartCount
        heartStatus
      }
    `,
  });
  if (data) {
    const newHeartCount =
      (data.heartCount as number) + (!data.heartStatus ? 1 : -1);
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          heartCount
          heartStatus
        }
      `,
      data: {
        id: postId,
        heartCount: newHeartCount,
        heartStatus: !data.heartStatus,
      },
    });
  }
};

export const Heart: React.FC<HeartProps> = ({ post }) => {
  const [heart] = useHeartMutation();
  const [runQuery, { data }] = useHeartsLazyQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = () => {
    runQuery({
      variables: { postId: post.id },
    });
    onOpen();
  };

  return (
    <>
      <TIconButton
        color={post.heartStatus ? "red.500" : ""}
        fontSize={18}
        icon={FaHeart}
        ariaLabel="likes"
        onClick={async () => {
          await heart({
            variables: { postId: post.id },
            update: (cache) => updateAfterHeart(post.id, cache),
          });
        }}
      />
      <Link ml={1} onClick={handleClick}>
        {post.heartCount}
      </Link>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>HeartedBy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data?.hearts?.users.map((user) => (
              <Box key={user.id}>{user.username}</Box>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
