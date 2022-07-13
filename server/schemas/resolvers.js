const User = require('../models/User');
const { signToken } = require('../utils/Auth');

const resolvers = {
  Query: {
    getUser: async (parent, args, context) => {
      if (!context.user) {
        throw new Error(`User has not logged in`);
      }
      const user = context.user;
      const foundUser = await User.findOne({
        _id: user._id,
      });
      if (!foundUser) {
        throw new Error(`Cannot find User`);
      }
      return foundUser;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email, });
      if (!user) {
        throw new Error(`Cannot find User`);
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error(`Incorrect Password!`);
      }
      const token = signToken(user);

      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new Error(`Cannot create user`);
      }
      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { bookId, authors, description, title, image, link }) => {
      return Book.create({
        bookId: bookId,
        authors: [authors],
        description: description,
        title: title,
        image: image,
        ling: link
      });
    },

    removeBook: async (parent, { bookId }) => {
      return Book.findOneAndDelete({ bookId: bookId }
      );
    },
  },
};

module.exports = resolvers;