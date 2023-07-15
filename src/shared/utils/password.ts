import bcrypt from 'bcrypt';

export const hash = (password: string) => bcrypt.hashSync(password, 10);

export const compareHash = (password: string, hashedPassword: string) =>
  bcrypt.compareSync(password, hashedPassword);
