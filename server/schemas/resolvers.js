const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const signToken = require('../utils/auth');

const resolvers = {
    Query: {

    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: book } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You must log in');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                  );
                return updatedUser;
            }
            throw new AuthenticationError('You must log in');
        },
        login: async (parent, { email, passsword }) => {
            const user = await User.findOne( { email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

        const token = signToken(user);
        return { token, user };
        }
    }
};

module.exports = resolvers;