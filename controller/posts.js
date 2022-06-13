const successHandler = require('../service/successHandler')
const errorHandler =require('../service/errorHandler')
const Post = require('../model/postModel')
const Comment = require('../model/commentsModel');
const User = require("../model/userModel")
const appError = require("../service/appError");

const opts = { runValidators: true, new: true }
const posts = {
    async getPosts(req, res) {
        const timeSort = req.query.timeSort == "asc" ? "-createdAt":"createdAt"
        const q = req.query.keyword !== undefined ? {content: new RegExp(req.query.keyword)} : {};
        console.log(q)
        const allPosts = await Post.find(q).populate({
            path: 'user', // refer to Schema item
            select: 'name avatar'
        }).populate({
            path: 'comments',
            select: 'comment user'
        })
        .sort(timeSort)
        successHandler(res, allPosts);
    },
    async createdPosts(req, res, next) {
        // try {
            const { body } = req
            if(body.content) {
                const newPost = await Post.create({
                    user: body.user,
                    tags: body.tags,
                    type: body.type,
                    image: body.image,
                    content: body.content,
                    likes: body.likes,
                    comments: body.comments
                })
                successHandler(res, newPost);
            } else {
                return next(appError(400,"You can't leave the 'content' field empty",next))
            }
        // } catch (error) {
        //     errorHandler(res,error);
        //     }
    },
    async delAllPost(req, res) {
        console.log(req.originalUrl)
        const delPosts = await Post.deleteMany({})
        successHandler(res);
    },
    async delSiglePost(req, res) {
        const id = req.params.id;
        console.log(id)
        // try {
            const deleteResult = await Post.findByIdAndDelete(id);
                if(deleteResult) {
                    successHandler(res, deleteResult)
                } else {
                    errorHandler(res, deleteResult)
                }
            // } catch(error){
            //     errorHandler(res, error)
            // }
    },
    async editPost(req, res, next) {
        const data = req.body;
        const id = req.params.id;
        // try {
            if (
                Object.keys(data).length === 0 ||
                (data.hasOwnProperty('content') && data.content === '') ||
                data.tags.length === 0) 
            {
                return next(appError(400,"Fail to update, please check the patch data(missing/JSON,etc)",next))
            } else {
                const updateResult = await Post.findByIdAndUpdate(id,
                    {...data},
                    opts
                    )
                if (updateResult === null) {
                    // errorHandler(res, { message:"No such ID, please check again"})
                    return next(appError(400,"No such ID, please check again",next))
                    // return
                }
            successHandler(res, updateResult)        
            }
        // }catch(error){
        //     errorHandler(res, error)
        // }
    },
    async addLike(req,res,next) {
        const id = req.params.id
        if(!id) {
            return next(appError(400,"Add Like: ID empty",next))
        }

        const result = await Post.findOneAndUpdate(
            { id },
            { $addToSet: { likes: req.user.id } },
            { new: true }
          )
        
          if (!result) {
            return next(appError(400,"Add Like: No Such Post",next))
        }
        successHandler(res,{
            likesCounter: result.likes.length,
            user_id: req.user.id,
            post_id: id});
        
    },
    async removeLike(req, res, next) {
        const id = req.params.id
        if(!id) {
            return next(appError(400,"Remove Like: ID empty",next))
        }

        const result = await Post.findOneAndUpdate(
            { id },
            { $pull: { likes: req.user.id } },
            { new: true } // Transfer back the modified data
          )

        if (!result) {
            return next(appError(400,"Remove Like: No Such ID",next))
        }
        successHandler(res,{
            likesCounter: result.likes.length,
            user_id: req.user.id,
            post_id: id});
    },
    async addComment (req, res, next) {
        const userID = req.user.id
        const postID = req.params.id
        const {comment} = req.body

        if(!postID){
            return next(appError(400,"Add Comment: Please add post ID",next))
        }

        if(!comment){
            return next(appError(400, `Add Comment: Please add post commit`, next));
        }

        const result = await Comment.create({
            post: postID,
            user: userID,
            comment
        });
        successHandler(res,result);
    }
}

module.exports = posts