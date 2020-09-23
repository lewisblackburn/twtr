import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  IconButton,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/core";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { BiSmile } from "react-icons/bi";
import { HiOutlinePhotograph, HiOutlineSparkles } from "react-icons/hi";
import { MdGif, MdGraphicEq } from "react-icons/md";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import { THeader } from "../components/THeader";
import { TIconButton } from "../components/TIconButton";
import {
  useCreatePostMutation,
  useMeQuery,
  usePostsLazyQuery,
  usePostsQuery,
} from "../generated/graphql";
import { useFetchMorePosts } from "../utils/useFetchMorePosts";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";
import Textarea from "react-expanding-textarea";

const Index = () => {
  useIsAuth();
  const router = useRouter();
  const { data: meData } = useMeQuery();
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  useFetchMorePosts(data, loading, fetchMore, variables);

  const [createPost] = useCreatePostMutation();

  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      <Box>
        <Formik
          initialValues={{ text: "" }}
          onSubmit={async (values) => {
            const { errors } = await createPost({
              variables: { input: values },
              update: (cache) => {
                cache.evict({ fieldName: `posts:{}` });
              },
            });
            if (!errors) {
              router.push("/");
            }
            values.text = "";
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <Box>
                <THeader>
                  <Text fontSize="20px" color="white" fontWeight="bold">
                    Home
                  </Text>
                  <IconButton
                    bg="transparent"
                    fontSize={24}
                    color="white"
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
                    icon={HiOutlineSparkles}
                    aria-label="options"
                  />
                </THeader>
                <Box p={8}>
                  <Flex>
                    <NextLink
                      href="/user/[username]"
                      as={`/user/${meData?.me?.username}`}
                    >
                      <Link>
                        <Avatar
                          cursor="pointer"
                          size="lg"
                          name={meData?.me?.username}
                          src={meData?.me?.avatar}
                        />
                      </Link>
                    </NextLink>
                    <Box w="100%">
                      <Textarea
                        id="text"
                        name="text"
                        className="my-textarea"
                        placeholder="what's happening"
                        onChange={handleChange}
                        value={values.text}
                      />

                      <Flex
                        mt={4}
                        ml={2}
                        justify="space-between"
                        align="center"
                      >
                        <Box>
                          <TIconButton
                            icon={HiOutlinePhotograph}
                            ariaLabel="gallery"
                          />
                          <TIconButton icon={MdGif} ariaLabel="gif" />
                          <TIconButton icon={MdGraphicEq} ariaLabel="graph" />
                          <TIconButton icon={BiSmile} ariaLabel="smile" />
                          <TIconButton
                            icon={AiOutlineCalendar}
                            ariaLabel="calendar"
                          />
                        </Box>

                        <Flex align="center">
                          {values.text.length < 280 ? (
                            <CircularProgress
                              value={values.text.length}
                              min={0}
                              max={280}
                              size="28px"
                              trackColor="black"
                              color={
                                values.text.length >= 200 ? "orange" : "blue"
                              }
                            />
                          ) : (
                            <Text color="red.500">{values.text.length}</Text>
                          )}

                          <Divider
                            height="30px"
                            borderColor="white"
                            orientation="vertical"
                          />
                          <Button
                            type="submit"
                            isDisabled={
                              isSubmitting || values.text.length > 280
                            }
                            bg="blue.500"
                            color="white"
                          >
                            Tweet
                          </Button>
                        </Flex>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
        <Box>
          {!data && loading ? (
            <Flex p={8} align="center" justify="center">
              <Spinner />
            </Flex>
          ) : (
            <>
              <Stack spacing={8}>
                {data?.posts.posts.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </Stack>
              <Flex p={8} align="center" justify="center">
                {data && data.posts.hasMore ? (
                  <Spinner />
                ) : (
                  <Text fontWeight="bold">You're all caught up</Text>
                )}
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
