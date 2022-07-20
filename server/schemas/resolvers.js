// File containing the resolvers for GraphQl routing
// Import required dependencies
const User = require('../models/User');
const { signToken } = require('../utils/auth');

// function to check if the user is logged in
function checkLoggedIn(context) {
  const user = context.user;
  
  if (!user) {
    throw new Error(`User has not logged in`);
  };
  return user;
};


// Define resolvers for GraphQl
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const user = checkLoggedIn(context);

      const foundUser = await User.findOne({ _id: user._id, });
      if (!foundUser) {
        throw new Error(`Cannot find User`);
      }
      return foundUser;
    },
  },

  Mutation: {
    // resolver for logging in a User
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

    // resolver for adding a new User profile
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      
      const token = signToken(user);
      
      return { token, user };
    },

    // resolver for saving a book to the saved books list
    saveBook: async (parent, { bookId, authors, title, description, image, link }, context) => {
      const user = checkLoggedIn(context);
    
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
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

    // resolver to remove a book from the saved books list
    removeBook: async (parent, { bookId }, context) => {
      const user = checkLoggedIn(context);

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
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
