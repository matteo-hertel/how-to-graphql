module.exports = {
    Query: {
        allLinks: async (root, data, { mongo: { Links } }) => { // 1
            return await Links.find({}).toArray(); // 2
        },
    },
    Mutation: {
        createLink: async (root, data, { mongo: { Links }, user }) => {
            const newLink = Object.assign({ postedById: user && user._id }, data)
            const response = await Links.insert(newLink);
            return Object.assign({ id: response.insertedIds[0] }, newLink);
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
        },
        createVote: async (root, data, { mongo: { Votes }, user }) => {
            const newVote = {
                userId: user && user._id,
                linkId: new ObjectID(data.linkId),
            };
            const response = await Votes.insert(newVote);
            return Object.assign({ id: response.insertedIds[0] }, newVote);
        },
    },
    Link: {
        id: root => root._id || root.id,
        postedBy: async ({ postedById }, data, { mongo: { Users } }) => {
            return await Users.findOne({ _id: postedById });
        }
    },
    User: {
        id: root => root._id || root.id,
    },
    Vote: {
        id: root => root._id || root.id,

        user: async ({ userId }, data, { mongo: { Users } }) => {
            return await Users.findOne({ _id: userId });
        },

        link: async ({ linkId }, data, { mongo: { Links } }) => {
            return await Links.findOne({ _id: linkId });
        },
    },
};