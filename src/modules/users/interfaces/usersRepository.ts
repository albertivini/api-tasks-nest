import { User } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract create(payload: User): Promise<void>;
}
