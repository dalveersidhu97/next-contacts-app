import { ObjectId } from "mongodb";

type LoginUser = undefined | {name: string, _id: ObjectId, email: string, phone: string, image: string | null}

export default LoginUser;