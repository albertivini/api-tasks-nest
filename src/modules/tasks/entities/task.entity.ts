export class Task {
  id: string;
  userId: string;
  constructor(
    readonly title: string,
    readonly description: string,
    readonly endDate: string,
    readonly status: string,
  ) {}
}
