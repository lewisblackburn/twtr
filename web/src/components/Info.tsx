import React, { useState } from "react";
import {
  Box,
  Text,
  Link,
  Input,
  FormControl,
  Button,
  Avatar,
  Grid,
  Flex,
} from "@chakra-ui/core";
import { FollowCard } from "./FollowCard";
import { useSearchQuery } from "../generated/graphql";
import { Field, Form, Formik } from "formik";
import { InputField } from "./InputField";
import NextLink from "next/link";

interface InfoProps {}

export const Info: React.FC<InfoProps> = ({}) => {
  const [value, setValue] = React.useState("");

  const { data } = useSearchQuery({
    variables: {
      username: value,
    },
  });

  return (
    <Box pos="fixed" width="330px">
      <Formik
        initialValues={{
          username: "",
        }}
        onSubmit={(values) => {
          setValue(values.username);
        }}
      >
        {(props) => (
          <Form autoComplete="off" onSubmit={props.handleSubmit}>
            <Field name="username">
              {({ field, form }: any) => (
                <FormControl
                  isInvalid={form.errors.username && form.touched.username}
                >
                  <InputField name="username" placeholder="username" />
                </FormControl>
              )}
            </Field>
          </Form>
        )}
      </Formik>
      <Box>
        {data?.search?.users.map((user) => (
          <Box key={user.id}>
            <Grid p={4} templateColumns="60px 1fr">
              <NextLink href="/user/[username]" as={`/user/${user.username}`}>
                <Link>
                  <Avatar
                    cursor="pointer"
                    name={user.username}
                    src={user.avatar}
                  />
                </Link>
              </NextLink>
              <Box cursor="pointer" ml={2}>
                <Flex align="center" justify="space-between">
                  <Text color="gray.500">@{user.username}</Text>
                </Flex>
                <Text>{user.bio}</Text>
              </Box>
            </Grid>
          </Box>
        ))}
      </Box>
      {/* <Box
        m={4}
        border="1px"
        borderColor="gray.800"
        borderRadius={10}
        bg="#14171A"
      >
        <Box p={4}>
          <Text fontWeight="bolder" borderBottom="1px" borderColor="gray.800">
            Who to follow
          </Text>
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <Box borderTop="1px" borderColor="gray.800">
            <Link color="blue.500">Show more</Link>
          </Box>
        </Box>
      </Box> */}
    </Box>
  );
};
