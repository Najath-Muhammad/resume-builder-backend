/**
 * @file src/user/user.repository.ts
 * @description Concrete implementation of IUserRepository.
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import type { IUserRepository } from './interfaces/user-repository.interface';
import type { IUser, SafeUser } from './interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .lean<UserDocument>();

    if (!user) return null;

    return {
      _id: (user._id as { toString(): string }).toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.userModel.findById(id).lean<UserDocument>();

    if (!user) return null;

    return {
      _id: (user._id as { toString(): string }).toString(),
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({
      email: email.toLowerCase(),
    });
    return count > 0;
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<SafeUser> {
    const user = await this.userModel.create(data);

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: (user as unknown as UserDocument).createdAt,
      updatedAt: (user as unknown as UserDocument).updatedAt,
    };
  }
}
