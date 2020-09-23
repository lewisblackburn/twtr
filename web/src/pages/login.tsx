import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import {
  FaFacebookMessenger,
  FaPersonBooth,
  FaSearch,
  FaTwitter,
} from "react-icons/fa";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useNotAuth } from "../utils/useNotAuth";
import { withApollo } from "../utils/withApollo";

const Login: React.FC<{}> = ({}) => {
  useNotAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Wrapper>
      <Grid templateColumns="1fr 1fr" h="100vh">
        <Flex
          bg="blue.400"
          flexDirection="column"
          align="center"
          justify="center"
          fontSize={22}
          fontWeight="bold"
        >
          <Box>
            <Flex align="center" my={8}>
              <Box as={FaSearch} mr={2} />
              <Text>Follow your interests.</Text>
            </Flex>
            <Flex align="center" my={8}>
              <Box as={FaPersonBooth} mr={2} />
              <Text>Hear what people are talking about.</Text>
            </Flex>
            <Flex align="center" my={8}>
              <Box as={FaFacebookMessenger} mr={2} />
              <Text>Join the conversation.</Text>
            </Flex>
          </Box>
        </Flex>
        <Flex maxW="70%" mx="auto" flexDirection="column" h="100vh">
          <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await login({
                variables: values,
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.login.user,
                    },
                  });
                  cache.evict({ fieldName: "posts:{}" });
                },
              });
              if (response.data?.login.errors) {
                setErrors(toErrorMap(response.data.login.errors));
              } else if (response.data?.login.user) {
                // worked
                if (typeof router.query.next === "string") {
                  router.push(router.query.next);
                } else {
                  router.push("/");
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Flex mt={10} align="center" justify="center">
                  <Box mr={4}>
                    <InputField
                      name="usernameOrEmail"
                      placeholder="username, or email"
                      label="username, or email"
                    />
                  </Box>
                  <Box mr={4}>
                    <InputField
                      type="password"
                      name="password"
                      placeholder="password"
                      label="Password"
                    />
                  </Box>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    variantColor="blue"
                    w={200}
                  >
                    Login
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
          <Flex
            flexDirection="column"
            align="center"
            justify="center"
            h="86vh"
            fontSize={28}
            fontWeight="bold"
          >
            <Box w="50%">
              <Box>
                <Box fontSize={44} my={4} as={FaTwitter} />
                <Text>See what's happening in the world right now</Text>
              </Box>
              <Box mt="40px">
                <Text fontSize={20}>Join Twitter today.</Text>

                <Button
                  onClick={onOpen}
                  type="submit"
                  variantColor="blue"
                  w="100%"
                >
                  Sign up
                </Button>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#14171a" color="gray.500">
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                avatar: "",
                banner: "",
                displayname: "",
                bio: "",
                website: "",
                birthday: "",
              }}
              onSubmit={async (values, { setErrors }) => {
                const response = await register({
                  variables: {
                    options: {
                      username: values.username,
                      email: values.email,
                      password: values.password,
                      avatar: values.avatar,
                      banner: values.banner,
                      displayname: values.displayname,
                      bio: values.bio,
                      website: values.website,
                      birthday: values.birthday,
                    },
                  },
                  update: (cache, { data }) => {
                    cache.writeQuery<MeQuery>({
                      query: MeDocument,
                      data: {
                        __typename: "Query",
                        me: data?.register.user,
                      },
                    });
                    cache.evict({ fieldName: "posts:{}" });
                  },
                });
                console.log(response);
                if (response.data?.register.errors) {
                  setErrors(toErrorMap(response.data.register.errors));
                } else if (response.data?.register.user) {
                  // worked
                  if (typeof router.query.next === "string") {
                    router.push(router.query.next);
                  } else {
                    router.push("/");
                  }
                }
              }}
            >
              {(props) => (
                <Form autoComplete="off" onSubmit={props.handleSubmit}>
                  <Field name="username">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={
                          form.errors.username && form.touched.username
                        }
                      >
                        {/* <FormLabel htmlFor="username">username</FormLabel> */}
                        <InputField name="username" placeholder="username" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                      >
                        <InputField mt={4} name="email" placeholder="email" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <InputGroup mt={4} size="md">
                          <InputField
                            pr="8rem"
                            name="password"
                            placeholder="password"
                            type={show ? "text" : "password"}
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              bg="gray.900"
                              h="1.75rem"
                              size="sm"
                              onClick={handleClick}
                            >
                              {show ? "Hide" : "Show"}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="avatar">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.avatar && form.touched.avatar}
                      >
                        <InputField mt={4} name="avatar" placeholder="avatar" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="banner">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.banner && form.touched.banner}
                      >
                        <InputField mt={4} name="banner" placeholder="banner" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="displayname">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={
                          form.errors.displayname && form.touched.displayname
                        }
                      >
                        <InputField
                          mt={4}
                          name="displayname"
                          placeholder="displayname"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="bio">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.bio && form.touched.bio}
                      >
                        <InputField mt={4} name="bio" placeholder="bio" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="website">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.website && form.touched.website}
                      >
                        <InputGroup mt={4} size="sm">
                          <InputLeftAddon
                            bg="gray.800"
                            border="none"
                            children="https://"
                          />
                          <Input
                            {...field}
                            name="website"
                            placeholder="website"
                            bg="gray.900"
                            width="100%"
                            border="none"
                            _focus={{
                              outline: 0,
                              border: 0,
                            }}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {form.errors.website}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="birthday">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={
                          form.errors.birthday && form.touched.birthday
                        }
                      >
                        <InputField
                          mt={4}
                          name="birthday"
                          placeholder="birthday"
                        />

                        <FormErrorMessage>
                          {form.errors.birthday}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Flex mt={4} justify="space-between">
                    <Button bg="gray.800" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      isLoading={props.isSubmitting}
                      type="submit"
                      bg="blue.400"
                      color="white"
                    >
                      Register
                    </Button>
                  </Flex>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
