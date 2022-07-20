// const { AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');
// const { signToken } = require('../utils/auth');
const { signToken } = require('../utils/auth');

// function to check if the user is logged in
function checkLoggedIn(context) {
  // console.log('context  ', context);
  // console.log('context.user', context.user);
  const user = context.user;
  
  if (!user) {
    // console.log('context  ', context);
    // console.log('context.user', context.user);
    throw new Error(`CK1:  User has not logged in`);
  };
  return user;
};


// Define resolvers for GraphQl
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const user = checkLoggedIn(context);

      // const foundUser = await User.findOne({_id: context.user._id,});
      const foundUser = await User.findOne({ _id: user._id, });
      if (!foundUser) {
        throw new Error(`Cannot find User`);
      }
      return foundUser;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error(`Login failure`);
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error(`Login failure`);
      }
      // Use same failure message to reduce chances for bad player
      const token = signToken(user);

      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      
      const token = signToken(user);
      
      return { token, user };
    },

    saveBook: async (parent, { bookId, authors, title, description, image, link }, context) => {
      const user = checkLoggedIn(context);
      // {_id: user._id},
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { bookId, authors, title, description, image, link } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error(`Could not find user with this id`);
        }
        return updatedUser;
      } catch { error } {
        console.log(error);
        throw error;
      };
    },

    removeBook: async (parent, { bookId }, context) => {
      const user = checkLoggedIn(context);
      // const user = context.user;
// {_id: user._id},      
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error(`Could not find user with this id`);
      };
      return updatedUser;
    },
  },
};

module.exports = resolvers;
