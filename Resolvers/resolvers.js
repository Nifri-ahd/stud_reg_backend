const bcrypt = require('bcryptjs');
const { UserInputError, ApolloError } = require('apollo-server');
const prismaClient = require('@prisma/client').PrismaClient;
const { createWriteStream, existsSync, mkdirSync } = require("fs");
const path = require("path");

const prisma = new prismaClient();
const files  = [];
module.exports = {
  Query: {
        async files(){
            return files
        },
        async getUser(_,{username}) {
          try {
            const user = await prisma.users.findFirst({
                where:{
                    username:username},
            });
            return user;
          } catch (err) {
            new ApolloError("Failed to fetch the User",{err});
          }
        },
        async getAllUsers(){
            try{
                const users = await prisma.users.findMany();
                return users;
            }catch(err){
                new ApolloError("Failed to fetch all the Users",{err});
            }
        }
    },
  Mutation: {
    async login(_, { username, password }) {
    let valid = true;
   
    if (!valid) {
    throw new UserInputError('Errors', { errors });
    }

    const user = await prisma.users.findFirst({
        where:{
            username:username},
    });
    if (!user) {
        throw new UserInputError('User not found', { errors });
    }


    const password_match = await bcrypt.compare(password, user.password)
    if(!password_match){
        throw new UserInputError('Incorrect Password', { errors });
    }
    return user;
    },
    async register(
      _,{userData: 
        { name,username,age,country, email, password, profile_picture }
    }) {
        let user;
        let valid = true;
        // fetch if the user already exist
        try {
            user = await prisma.users.findFirst({
                where:{
                    username:username},
            });
        }
        catch(err){
            throw new ApolloError("failed while fetching if existant user")
        }
        if(user){
            //if user is found with the same username already
            valid=false;
        }
        if(valid){
            password = await bcrypt.hash(password, 10);
        }else{
            throw new UserInputError('Username is not available', { errors })
        }
        try{
            const user = await prisma.users.create({
                data: {
                    name: name,
                    username: username,
                    email: email,
                    age: age,
                    country: country,
                    password: password,
                    profile_picture: email
                }
            });
            return user;
        }catch(err){
            new ApolloError("Failed to Register the User",{err});
        }
    },
    // async uploadFile (_, { file }){
    //     const { createReadStream, filename, mimetype } = await file;
    //     await new Promise(res =>
    //         createReadStream()
    //         .pipe(createWriteStream(path.join(__dirname, "../images", filename)))
    //         .on("end", res)
    //     )
    //         files.push(filename);
    //         return true;
    //   }
  }
}