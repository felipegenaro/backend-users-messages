import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';
import RepoService from './repo.service';

@Controller()
export class AppController {
  constructor(private readonly repoService: RepoService) {}

  @Get()
  async getHello(): Promise<string> {
    // return (await this.repoService.messageRepo.count()).toString();
    return `We have a total of ${await this.repoService.messageRepo.count()} messages.`;
    // return this.appService.getHello();
  }
}
