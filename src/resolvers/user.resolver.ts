import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import User from 'src/db/models/user.entity';
import RepoService from '../repo.service'
import UserInput from './input/user.input';

@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly repoService: RepoService) {}

  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    return await this.repoService.userRepo.find();
  }
  @Query(() => User, { nullable: true })
  public async getUser(@Args('id') id: number): Promise<User> {
    return await this.repoService.userRepo.findOne(id);
  }

  // create update and delete are mutations

  // if user does not exist -> createUser
  // if user already exists just return user
  @Mutation(() => User)
  public async createOrLoginUser(@Args('data') input: UserInput): Promise<User> {
    let user = await this.repoService.userRepo.findOne({
      where: { email: input.email.toLowerCase().trim() }
    });

    if (!user) {
      user = this.repoService.userRepo.create({
        email: input.email.toLowerCase().trim(),
      });

      await this.repoService.userRepo.save(user);
    }

    return user;
  }
}