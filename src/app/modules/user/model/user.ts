export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public firstName: string,
    public lastName: string,
    public img: string,
    private readonly _token: string,
    private readonly _tokenExpired: number
  ) {}

  get token() {
    if (this._tokenExpired > Date.now() / 1000) {
      return this._token;
    }
    return null;
  }
}
