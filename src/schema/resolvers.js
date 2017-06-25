module.exports = {
    Query: {
        allLinks: async (root, data, { mongo: { Links } }) => { // 1
            return await Links.find({}).toArray(); // 2
        },
    },
    Mutation: {
        createLink: (_, data) => {
            const newLink = Object.assign({ id: links.length + 1 }, data);
            links.push(newLink);
            return newLink;
        }
    },
};