/**
 * @file src/user/user.module.ts
 * @description User module — registers the Mongoose model and exports the
 * USER_REPOSITORY token so AuthModule can inject it.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY } from './user.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  // Export the token so AuthModule can inject it
  exports: [USER_REPOSITORY],
})
export class UserModule {}
