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
import React from "react";
import { FaRetweet } from "react-icons/fa";
import {
  PostSnippetFragment,
  RetweetMutation,
  useMeQuery,
  useRetweetMutation,
  useRetweetsLazyQuery,
  useRetweetsQuery,
} from "../generated/graphql";
import { TIconButton } from "./TIconButton";

interface RetweetProps {
  post: PostSnippetFragment;
}

const updateAfterRetweet = (
  postId: number,
  cache: ApolloCache<RetweetMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    retweetCount: number;
    retweetStatus: boolean;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        retweetCount
        retweetStatus
      }
    `,
  });
  if (data) {
    const newRetweetCount =
      (data.retweetCount as number) + (!data.retweetStatus ? 1 : -1);
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          retweetCount
          retweetStatus
        }
      `,
      data: {
        id: postId,
        retweetCount: newRetweetCount,
        retweetStatus: !data.retweetStatus,
      },
    });
  }
};

export const Retweet: React.FC<RetweetProps> = ({ post }) => {
  const [retweet] = useRetweetMutation();
  const [runQuery, { data }] = useRetweetsLazyQuery({
    variables: { postId: post.id },
  });
  const { data: meData } = useMeQuery();
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
        color={(post.retweetStatus && "green.300") || ""}
        isDisabled={post.retweeterId === meData?.me?.id}
        fontSize={18}
        icon={FaRetweet}
        ariaLabel="retweets"
        onClick={async () => {
          await retweet({
            variables: { postId: post.id },
            update: (cache) => updateAfterRetweet(post.id, cache),
          });
        }}
      />

      <Link ml={1} onClick={handleClick}>
        {post.retweetCount}
      </Link>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>RetweetedBy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data?.retweets?.users.map((user) => (
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
