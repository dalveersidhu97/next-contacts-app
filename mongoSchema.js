db.createCollection('User', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ['name', 'email', 'password'],
            properties: {
                name: {
                    bsonType: "string",
                    description: "Name must be a string of minimum 8 characters and is required",
                    maxLength: 100,
                    minLength: 2
                  },
                email: {
                    bsonType: "string",
                    maxLength: 100,
                    minLength: 2,
                    pattern: "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,4}$",
                    description: "Email must be a valid email string"
                  },
                password: {
                    bsonType: "string",
                    maxLength: 100,
                    minLength: 8,
                    description: "Password must be a valid string of minimum 8 characters",
                  }
            }
        }
    }
})

db.User.createIndex({email: 1}, {unique: true});

db.createCollection('Contacts', {
    validator: {
        $jsonSchema: {
            bsonType: 'object', 
            required: ['name', 'phone', 'userId'],
            properties: {
                userId: {
                    bsonType: 'objectId'
                },
                name: {
                    bsonType: 'string',
                    maxLength: 100,
                    minLength: 1,
                    description: 'Name must be a string and is required'
                },
                phone: {
                    bsonType: 'string',
                    maxLength: 20,
                    minLength: 1
                },
                email: {
                    bsonType: 'string',
                    maxLength: 100,
                    pattern: "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,4}$",
                },
                image: {
                    bsonType: 'string'
                }
            }
        }
    }
})

db.Contacts.createIndex({phone: 1}, {unique: true});