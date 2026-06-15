/**
 * @file src/user/schemas/user.schema.ts
 * @description Mongoose User schema definition.
 * Password is hashed via pre-save hook — never store plain text.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, CallbackWithoutResultAndOptionalError } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  /**
   * select: false — password is NEVER returned in queries by default.
   * Must be explicitly selected with .select('+password') when needed.
   */
  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Pre-save hook — hash password before saving to DB.
 * Uses CallbackWithoutResultAndOptionalError for correct Mongoose 7+ typing.
 */
UserSchema.pre<UserDocument>(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) {
      return next();
    }
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  },
);
