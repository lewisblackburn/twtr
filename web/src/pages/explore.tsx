import React from "react";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";

interface exploreProps {}

const Explore: React.FC<exploreProps> = ({}) => {
  return <Layout>explore</Layout>;
};

export default withApollo({ ssr: true })(Explore);
