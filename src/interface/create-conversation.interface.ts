import { User } from "src/entities/auth.entity";

export interface CreateConversation {
    user: User;
    message?: string;
    authUser: User;
    image?: string;
  }
  