import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {CreateUserCommand} from "../../app/commands/User/createUserCommand/CreateUserCommand";
import {CreateUserCommandHandler} from "../../app/commands/User/createUserCommand/CreateUserCommandHandler";
import {FetchUserQuery} from "../../app/queries/User/fetchUserQuery/FetchUserQuery";
import {FetchUserQueryHandler} from "../../app/queries/User/fetchUserQuery/FetchUserQueryHandler";

const signupUser = async (req: Request, res: Response) => {
    try {
        let {username, email, password} = req.body;

        const command = new CreateUserCommand(username, email, password);
        const commandHandler = new CreateUserCommandHandler();
        const commandResult = await commandHandler.handle(command);

        const token = jwt.sign({id: (commandResult as any).user._id}, process.env.JWT_SECRET!,
            {expiresIn: '1d'});
        res.status(201).json({message: 'User created', token, user: commandResult.user});
    } catch (error) {
        res.status(500).json({message: (error as Error).message});
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const query = new FetchUserQuery(email);
        const queryHandler = new FetchUserQueryHandler();
        const queryResult = await queryHandler.handle(query);

        const user = queryResult.user;

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign({id: (user as any)._id}, process.env.JWT_SECRET!, {expiresIn: '1d'});
        res.status(200).json({message: 'Login successful', token, user});
    } catch (error) {
        res.status(500).json({message: (error as Error).message});
    }
};

export {signupUser, loginUser};
