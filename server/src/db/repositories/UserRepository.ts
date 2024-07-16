import User, {IUser} from "../models/User";

export class UserRepository {
    public static async createUser(username: string, email: string, password: string): Promise<IUser> {
        try {
            const userInstance = new User({
                username, email, password
            });
            await userInstance.save();

            return userInstance;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public static async fetchUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({email});
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}
