import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { BiArrowBack, BiCake, BiCalendar, BiLink } from "react-icons/bi";
import { Layout } from "../../components/Layout";
import { Post } from "../../components/Post";
import { THeader } from "../../components/THeader";
import { TIconButton } from "../../components/TIconButton";
import {
  useFollowMutation,
  useMeQuery,
  usePostsQuery,
  useUserQuery,
} from "../../generated/graphql";
import { useConvertUnixTimestamp } from "../../utils/useConvertUnixTimestamp";
import { useFetchMorePosts } from "../../utils/useFetchMorePosts";
import { withApollo } from "../../utils/withApollo";

const Profile: React.FC<{}> = ({}) => {
  const router = useRouter();
  const username = router.query.username?.toString() || "";
  const { data: meData } = useMeQuery();
  const { data: userData } = useUserQuery({
    variables: { username: username },
  });
  const [follow] = useFollowMutation();
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  useFetchMorePosts(data, loading, fetchMore, variables);
  const { date } = useConvertUnixTimestamp(userData?.user?.createdAt);

  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  if (userData?.user === null) {
    return <div>user does not exist</div>;
  }

  return (
    <Layout>
      <Box>
        <THeader>
          <Flex align="center">
            <TIconButton
              onClick={() => router.push("/")}
              icon={BiArrowBack}
              ariaLabel="back"
            />
            {!userData && !loading ? (
              <div>loading....</div>
            ) : (
              <Flex ml={4} flexDirection="column">
                <Text fontWeight="bold">{userData?.user?.displayname}</Text>
                <Text color="gray.500">84 Tweets</Text>
              </Flex>
            )}
          </Flex>
        </THeader>
        <Box>
          <Image rounded="md" w="100%" h={300} src={userData?.user?.banner} />
          <Flex
            transform="translateY(-20%)"
            mx={4}
            align="center"
            justify="space-between"
          >
            <Avatar
              name="Christian Nwamba"
              src={userData?.user?.avatar}
              size="2xl"
              transform="translateY(-40%)"
            />

            {meData?.me?.username === username ? (
              <Button backgroundColor="gray.600">Edit Profile</Button>
            ) : (
              <Button
                backgroundColor="gray.600"
                onClick={async () => {
                  await follow({
                    variables: { theirId: userData?.user?.id || -1 },
                    // update: (cache) => updateAfterRetweet(post.id, cache),
                    update: (cache) => cache.evict({ fieldName: `users:{}` }),
                  });
                }}
              >
                {userData?.user?.followStatus ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Flex>
        </Box>
        <Box px={10} transform="translateY(-20%)">
          <Box>
            <Text fontWeight="bolder">{userData?.user?.displayname}</Text>
            <Text color="gray.600">@{userData?.user?.username}</Text>
            <Text color="gray.500">{userData?.user?.bio}</Text>
          </Box>
          <Flex
            flexDirection="column"
            color="gray.500"
            align="start"
            justify="center"
            my={4}
          >
            {userData?.user?.website && (
              <Flex align="center" justify="left">
                <Icon as={BiLink} mr={2} />
                <Link
                  title={userData.user.website}
                  href={userData.user.website}
                  target="_blank"
                >
                  {new URL(userData.user.website).hostname +
                    new URL(userData.user.website).pathname}
                </Link>
              </Flex>
            )}

            <Flex align="center" justify="center">
              <Icon as={BiCake} mr={2} />
              <Text>{userData?.user?.birthday}</Text>
            </Flex>

            <Flex align="center" justify="center">
              <Icon as={BiCalendar} mr={2} />
              <Text>{date}</Text>
            </Flex>
          </Flex>
          <Flex
            color="gray.500"
            align="center"
            justify="space-between"
            w="220px"
          >
            <Flex align="center" justify="space-between">
              <Text fontWeight="bold" mr={2}>
                432
              </Text>
              <Text>Following</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Text fontWeight="bold" mr={2}>
                123
              </Text>
              <Text>Followers</Text>
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Stack spacing={8}>
            {data?.posts.posts.map(
              (post) =>
                post.creator.username === username && (
                  <Post key={post.id} post={post} />
                )
            )}
          </Stack>
          <Flex p={8} align="center" justify="center">
            {data && data.posts.hasMore ? (
              <TIconButton
                icon="spinner"
                ariaLabel="spinner"
                fontSize={24}
                isLoading={data.posts.hasMore}
              />
            ) : (
              <Text fontWeight="bold">You're all caught up</Text>
            )}
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Profile);
