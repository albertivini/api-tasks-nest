import { hash } from '../../../shared/utils/password';

export class User {
  id: string;
  password: string;

  constructor(
    readonly username: string,
    readonly email: string,
    password: string,
  ) {
    this.hashPassword(password);
  }

  private hashPassword(password: string) {
    this.password = hash(password);
  }
}
