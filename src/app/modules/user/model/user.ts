export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public firstName: string,
    public lastName: string,
    public img: string,
    private readonly _token: string,
    public readonly tokenExpired: number
  ) {}

  get token() {
    if (this.tokenExpired > Date.now()) {
      return this._token;
    }
    return null;
  }
}
