import { InputType, Field } from "type-graphql";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  displayname: string;
  @Field()
  avatar: string;
  @Field()
  banner: string;
  @Field()
  bio: string;
  @Field()
  website: string;
  @Field()
  birthday: string;
}
