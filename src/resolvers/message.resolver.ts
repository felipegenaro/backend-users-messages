import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import Message from 'src/db/models/message.entity';
import User from 'src/db/models/user.entity';
import RepoService from '../repo.service'
import MessageInput, { DeleteMessageInput } from './input/message.input';

@Resolver(()=> Message)
export default class MessageResolver {
  constructor(private readonly repoService: RepoService) {}

  @Query(() => [Message])
  public async getMessages(): Promise<Message[]> {
    return this.repoService.messageRepo.find();
  }

  @Query(() => Message, {nullable: true})
  public async getMessage(@Args('messageId') messageId: number): Promise<Message> {
    return  this.repoService.messageRepo.findOne(messageId);
  }

  @Query(() => [Message])
  public async getMessagesFromUser(@Args('userId') userId: number): Promise<Message[]> {
    return  this.repoService.messageRepo.find( {where: { userId } });
  }

  // create update and delete are mutations

  @Mutation(() => Message)
  public async createMessage(
    @Args('data') input: MessageInput): Promise<Message> {
    const message = this.repoService.messageRepo.create({ userId: input.userId, content: input.content,
    });

    const response = await this.repoService.messageRepo.save(message);

    return response;
  }

  @Mutation(() => Message)
  public async deleteMessage(
    @Args('data') input: DeleteMessageInput): Promise<Message> {
    const message = await this.repoService.messageRepo.findOne(input.id);

    if (!message || message.userId !== input.userId)
      throw new Error(
        'Message does not exists or you are not the message author',
      );

    const copy = { ...message };

    await this.repoService.messageRepo.remove(message);

    return copy;
  }

  @ResolveField(() => User, { name: 'user' })
  public async getUser(@Parent() parent: Message): Promise<User> {
    return this.repoService.userRepo.findOne(parent.userId);
  }
}