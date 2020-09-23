import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  hearts?: Maybe<Users>;
  retweets?: Maybe<Users>;
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  followers?: Maybe<Users>;
  following?: Maybe<Users>;
  search?: Maybe<Users>;
  user?: Maybe<User>;
  me?: Maybe<User>;
};


export type QueryHeartsArgs = {
  postId: Scalars['Int'];
};


export type QueryRetweetsArgs = {
  postId: Scalars['Int'];
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  postId: Scalars['Int'];
};


export type QueryFollowersArgs = {
  theirId: Scalars['Int'];
};


export type QueryFollowingArgs = {
  userId: Scalars['Int'];
};


export type QuerySearchArgs = {
  username: Scalars['String'];
};


export type QueryUserArgs = {
  username: Scalars['String'];
};

export type Users = {
  __typename?: 'Users';
  users: Array<User>;
  amount: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  username: Scalars['String'];
  email: Scalars['String'];
  avatar: Scalars['String'];
  banner: Scalars['String'];
  displayname: Scalars['String'];
  bio: Scalars['String'];
  website: Scalars['String'];
  birthday: Scalars['String'];
  followStatus?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  text: Scalars['String'];
  heartCount: Scalars['Float'];
  heartStatus?: Maybe<Scalars['Boolean']>;
  retweetId: Scalars['Float'];
  retweet: Scalars['Boolean'];
  retweetCount: Scalars['Float'];
  retweetStatus?: Maybe<Scalars['Boolean']>;
  retweeterId: Scalars['Float'];
  creatorId: Scalars['Float'];
  creator: User;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  retweeter?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  heart: Scalars['Boolean'];
  retweet: Scalars['Boolean'];
  createPost: Post;
  deletePost: Scalars['Boolean'];
  follow: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationHeartArgs = {
  postId: Scalars['Int'];
};


export type MutationRetweetArgs = {
  postId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationFollowArgs = {
  theirId: Scalars['Int'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type PostInput = {
  text: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  displayname: Scalars['String'];
  avatar: Scalars['String'];
  banner: Scalars['String'];
  bio: Scalars['String'];
  website: Scalars['String'];
  birthday: Scalars['String'];
};

export type PostSnippetFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'text' | 'heartCount' | 'heartStatus' | 'retweetCount' | 'retweetStatus' | 'retweetId' | 'retweet' | 'retweeterId' | 'creatorId'>
  & { retweeter?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )>, creator: (
    { __typename?: 'User' }
    & RegularUserFragment
  ) }
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email' | 'avatar' | 'banner' | 'displayname' | 'followStatus' | 'bio' | 'website' | 'birthday' | 'createdAt' | 'updatedAt'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & PostSnippetFragment
  ) }
);

export type FollowMutationVariables = Exact<{
  theirId: Scalars['Int'];
}>;


export type FollowMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'follow'>
);

export type HeartMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type HeartMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'heart'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type RetweetMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type RetweetMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'retweet'>
);

export type FollowersQueryVariables = Exact<{
  theirId: Scalars['Int'];
}>;


export type FollowersQuery = (
  { __typename?: 'Query' }
  & { followers?: Maybe<(
    { __typename?: 'Users' }
    & Pick<Users, 'amount'>
    & { users: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'avatar' | 'displayname' | 'bio'>
    )> }
  )> }
);

export type FollowingQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type FollowingQuery = (
  { __typename?: 'Query' }
  & { following?: Maybe<(
    { __typename?: 'Users' }
    & Pick<Users, 'amount'>
    & { users: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'avatar' | 'displayname' | 'bio'>
    )> }
  )> }
);

export type HeartsQueryVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type HeartsQuery = (
  { __typename?: 'Query' }
  & { hearts?: Maybe<(
    { __typename?: 'Users' }
    & { users: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'avatar' | 'displayname' | 'bio'>
    )> }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type PostQueryVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & PostSnippetFragment
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )> }
  ) }
);

export type RetweetsQueryVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type RetweetsQuery = (
  { __typename?: 'Query' }
  & { retweets?: Maybe<(
    { __typename?: 'Users' }
    & { users: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'avatar' | 'displayname' | 'bio'>
    )> }
  )> }
);

export type SearchQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type SearchQuery = (
  { __typename?: 'Query' }
  & { search?: Maybe<(
    { __typename?: 'Users' }
    & { users: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'avatar' | 'displayname' | 'bio'>
    )> }
  )> }
);

export type UserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
  avatar
  banner
  displayname
  followStatus
  bio
  website
  birthday
  createdAt
  updatedAt
}
    `;
export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  id
  createdAt
  updatedAt
  text
  heartCount
  heartStatus
  retweetCount
  retweetStatus
  retweetId
  retweet
  retweeterId
  retweeter {
    ...RegularUser
  }
  creatorId
  creator {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    ...PostSnippet
  }
}
    ${PostSnippetFragmentDoc}`;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, baseOptions);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const FollowDocument = gql`
    mutation Follow($theirId: Int!) {
  follow(theirId: $theirId)
}
    `;
export type FollowMutationFn = Apollo.MutationFunction<FollowMutation, FollowMutationVariables>;

/**
 * __useFollowMutation__
 *
 * To run a mutation, you first call `useFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followMutation, { data, loading, error }] = useFollowMutation({
 *   variables: {
 *      theirId: // value for 'theirId'
 *   },
 * });
 */
export function useFollowMutation(baseOptions?: Apollo.MutationHookOptions<FollowMutation, FollowMutationVariables>) {
        return Apollo.useMutation<FollowMutation, FollowMutationVariables>(FollowDocument, baseOptions);
      }
export type FollowMutationHookResult = ReturnType<typeof useFollowMutation>;
export type FollowMutationResult = Apollo.MutationResult<FollowMutation>;
export type FollowMutationOptions = Apollo.BaseMutationOptions<FollowMutation, FollowMutationVariables>;
export const HeartDocument = gql`
    mutation Heart($postId: Int!) {
  heart(postId: $postId)
}
    `;
export type HeartMutationFn = Apollo.MutationFunction<HeartMutation, HeartMutationVariables>;

/**
 * __useHeartMutation__
 *
 * To run a mutation, you first call `useHeartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHeartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [heartMutation, { data, loading, error }] = useHeartMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useHeartMutation(baseOptions?: Apollo.MutationHookOptions<HeartMutation, HeartMutationVariables>) {
        return Apollo.useMutation<HeartMutation, HeartMutationVariables>(HeartDocument, baseOptions);
      }
export type HeartMutationHookResult = ReturnType<typeof useHeartMutation>;
export type HeartMutationResult = Apollo.MutationResult<HeartMutation>;
export type HeartMutationOptions = Apollo.BaseMutationOptions<HeartMutation, HeartMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RetweetDocument = gql`
    mutation Retweet($postId: Int!) {
  retweet(postId: $postId)
}
    `;
export type RetweetMutationFn = Apollo.MutationFunction<RetweetMutation, RetweetMutationVariables>;

/**
 * __useRetweetMutation__
 *
 * To run a mutation, you first call `useRetweetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRetweetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [retweetMutation, { data, loading, error }] = useRetweetMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useRetweetMutation(baseOptions?: Apollo.MutationHookOptions<RetweetMutation, RetweetMutationVariables>) {
        return Apollo.useMutation<RetweetMutation, RetweetMutationVariables>(RetweetDocument, baseOptions);
      }
export type RetweetMutationHookResult = ReturnType<typeof useRetweetMutation>;
export type RetweetMutationResult = Apollo.MutationResult<RetweetMutation>;
export type RetweetMutationOptions = Apollo.BaseMutationOptions<RetweetMutation, RetweetMutationVariables>;
export const FollowersDocument = gql`
    query Followers($theirId: Int!) {
  followers(theirId: $theirId) {
    users {
      id
      username
      avatar
      displayname
      bio
    }
    amount
  }
}
    `;

/**
 * __useFollowersQuery__
 *
 * To run a query within a React component, call `useFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFollowersQuery({
 *   variables: {
 *      theirId: // value for 'theirId'
 *   },
 * });
 */
export function useFollowersQuery(baseOptions?: Apollo.QueryHookOptions<FollowersQuery, FollowersQueryVariables>) {
        return Apollo.useQuery<FollowersQuery, FollowersQueryVariables>(FollowersDocument, baseOptions);
      }
export function useFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FollowersQuery, FollowersQueryVariables>) {
          return Apollo.useLazyQuery<FollowersQuery, FollowersQueryVariables>(FollowersDocument, baseOptions);
        }
export type FollowersQueryHookResult = ReturnType<typeof useFollowersQuery>;
export type FollowersLazyQueryHookResult = ReturnType<typeof useFollowersLazyQuery>;
export type FollowersQueryResult = Apollo.QueryResult<FollowersQuery, FollowersQueryVariables>;
export const FollowingDocument = gql`
    query Following($userId: Int!) {
  following(userId: $userId) {
    users {
      id
      username
      avatar
      displayname
      bio
    }
    amount
  }
}
    `;

/**
 * __useFollowingQuery__
 *
 * To run a query within a React component, call `useFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFollowingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useFollowingQuery(baseOptions?: Apollo.QueryHookOptions<FollowingQuery, FollowingQueryVariables>) {
        return Apollo.useQuery<FollowingQuery, FollowingQueryVariables>(FollowingDocument, baseOptions);
      }
export function useFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FollowingQuery, FollowingQueryVariables>) {
          return Apollo.useLazyQuery<FollowingQuery, FollowingQueryVariables>(FollowingDocument, baseOptions);
        }
export type FollowingQueryHookResult = ReturnType<typeof useFollowingQuery>;
export type FollowingLazyQueryHookResult = ReturnType<typeof useFollowingLazyQuery>;
export type FollowingQueryResult = Apollo.QueryResult<FollowingQuery, FollowingQueryVariables>;
export const HeartsDocument = gql`
    query Hearts($postId: Int!) {
  hearts(postId: $postId) {
    users {
      id
      username
      avatar
      displayname
      bio
    }
  }
}
    `;

/**
 * __useHeartsQuery__
 *
 * To run a query within a React component, call `useHeartsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHeartsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHeartsQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useHeartsQuery(baseOptions?: Apollo.QueryHookOptions<HeartsQuery, HeartsQueryVariables>) {
        return Apollo.useQuery<HeartsQuery, HeartsQueryVariables>(HeartsDocument, baseOptions);
      }
export function useHeartsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HeartsQuery, HeartsQueryVariables>) {
          return Apollo.useLazyQuery<HeartsQuery, HeartsQueryVariables>(HeartsDocument, baseOptions);
        }
export type HeartsQueryHookResult = ReturnType<typeof useHeartsQuery>;
export type HeartsLazyQueryHookResult = ReturnType<typeof useHeartsLazyQuery>;
export type HeartsQueryResult = Apollo.QueryResult<HeartsQuery, HeartsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PostDocument = gql`
    query Post($postId: Int!) {
  post(postId: $postId) {
    ...PostSnippet
  }
}
    ${PostSnippetFragmentDoc}`;

/**
 * __usePostQuery__
 *
 * To run a query within a React component, call `usePostQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function usePostQuery(baseOptions?: Apollo.QueryHookOptions<PostQuery, PostQueryVariables>) {
        return Apollo.useQuery<PostQuery, PostQueryVariables>(PostDocument, baseOptions);
      }
export function usePostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostQuery, PostQueryVariables>) {
          return Apollo.useLazyQuery<PostQuery, PostQueryVariables>(PostDocument, baseOptions);
        }
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostQueryResult = Apollo.QueryResult<PostQuery, PostQueryVariables>;
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(cursor: $cursor, limit: $limit) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function usePostsQuery(baseOptions?: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>) {
        return Apollo.useQuery<PostsQuery, PostsQueryVariables>(PostsDocument, baseOptions);
      }
export function usePostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>) {
          return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(PostsDocument, baseOptions);
        }
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<PostsQuery, PostsQueryVariables>;
export const RetweetsDocument = gql`
    query Retweets($postId: Int!) {
  retweets(postId: $postId) {
    users {
      id
      username
      avatar
      displayname
      bio
    }
  }
}
    `;

/**
 * __useRetweetsQuery__
 *
 * To run a query within a React component, call `useRetweetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRetweetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRetweetsQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useRetweetsQuery(baseOptions?: Apollo.QueryHookOptions<RetweetsQuery, RetweetsQueryVariables>) {
        return Apollo.useQuery<RetweetsQuery, RetweetsQueryVariables>(RetweetsDocument, baseOptions);
      }
export function useRetweetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RetweetsQuery, RetweetsQueryVariables>) {
          return Apollo.useLazyQuery<RetweetsQuery, RetweetsQueryVariables>(RetweetsDocument, baseOptions);
        }
export type RetweetsQueryHookResult = ReturnType<typeof useRetweetsQuery>;
export type RetweetsLazyQueryHookResult = ReturnType<typeof useRetweetsLazyQuery>;
export type RetweetsQueryResult = Apollo.QueryResult<RetweetsQuery, RetweetsQueryVariables>;
export const SearchDocument = gql`
    query Search($username: String!) {
  search(username: $username) {
    users {
      id
      username
      avatar
      displayname
      bio
    }
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useSearchQuery(baseOptions?: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const UserDocument = gql`
    query User($username: String!) {
  user(username: $username) {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;