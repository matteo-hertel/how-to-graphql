module.exports = {
    Query: {
        allLinks: async (root, data, { mongo: { Links } }) => { // 1
            return await Links.find({}).toArray(); // 2
        },
    },
    Mutation: {
        createLink: async (root, data, { mongo: { Links } }) => {
            const response = await Links.insert(data); // 3
            return Object.assign({ id: response.insertedIds[0] }, data); // 4
        },
        createUser: async (root, data, { mongo: { Users } }) => {
            // You need to convert the given arguments into the format for the
            // `User` type, grabbing email and password from the "authProvider".
            const newUser = {
                name: data.name,
                email: data.authProvider.email.email,
                password: data.authProvider.email.password,
            };
            const response = await Users.insert(newUser);
            return Object.assign({ id: response.insertedIds[0] }, newUser);
        },
        signinUser: async (root, data, { mongo: { Users } }) => {
            console.log(data.email.email);
            const user = await Users.findOne({ email: data.email.email });
            if (data.email.password === user.password) {
                return { token: `token-${user.email}`, user };
            }
        }

    },
    Link: {
        id: root => root._id || root.id,
    },
    User: {
        id: root => root._id || root.id,
    },
};