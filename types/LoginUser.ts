import { ObjectId } from "mongodb";

type LoginUser = false | {name: string, _id: ObjectId, email: string, image: string | null}

export default LoginUser;