export class FetchUserQuery {
    constructor(public email: string) {
        if (!email) {
            throw new Error("No credentials provided")
        }
    }
}
