import { User } from "../entities/User";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Users {
  @Field(() => [User])
  users: User[];
  @Field(() => Int)
  amount: number;
}
