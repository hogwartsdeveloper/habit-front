export class User {
  constructor(
    public readonly email: string,
    public firstName: string,
    public lastName: string,
    public isEmailConfirmed: boolean,
    private readonly _token: string,
    public readonly tokenExpired: number,
    public birthDay?: string,
    public imageUrl?: string,
  ) {}

  get token() {
    if (this.tokenExpired > Date.now()) {
      return this._token;
    }
    return null;
  }
}
