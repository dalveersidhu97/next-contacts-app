import { ObjectId } from "mongodb"

export type User = {
    name: string,
    email: string,
    phone: string,
    password: string,
    image?: string,
    _id: ObjectId
}

export type Contact = {
    name: string,
    phone: string, 
    email: string,
    image?: string,
    _id: ObjectId,
    userId: ObjectId
}

export type ContactSerializable = {
    name: string, 
    email: string,
    phone: string,
    image?: string,
    _id: string,
    registered?: boolean,
    userId: string
}