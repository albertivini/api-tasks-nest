import { hash } from 'src/shared/utils/password';

export class User {
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
