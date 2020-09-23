import { Flex, Text, Box } from "@chakra-ui/core";
import { Layout } from "../../components/Layout";
import { THeader } from "../../components/THeader";
import { TIconButton } from "../../components/TIconButton";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import { Post } from "../../components/Post";
import { withApollo } from "../../utils/withApollo";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Tweet: React.FC<{}> = ({}) => {
  const router = useRouter();
  const { data, error, loading } = useGetPostFromUrl();

  return (
    <Layout>
      <Box>
        <THeader>
          <Flex align="center">
            <TIconButton
              onClick={() => router.back()}
              icon={BiArrowBack}
              ariaLabel="back"
            />
            <Text ml={4} fontWeight="bold">
              Tweet
            </Text>
          </Flex>
        </THeader>
        {data && <Post post={data && data.post} />}
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Tweet);
