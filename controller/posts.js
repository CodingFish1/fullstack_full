const successHandler = require('../service/successHandler')
const errorHandler =require('../service/errorHandler')
const Post = require('../model/post')

const posts = {
    async getPosts(req, res) {
        console.log('Calling');
        const allPosts = await Post.find()
        successHandler(res, allPosts);
    },
    async createdPosts(req, res) {
        try {
            const { body } = req
            if(body.content) {
                const newPost = await Post.create({
                    name: body.name,
                    tags: body.tags,
                    type: body.type,
                    image: body.image,
                    content: body.content,
                    likes: body.likes,
                    comments: body.comments
                })
                successHandler(res, newPost);
                res.end()
            } else {
                errorHandler(res)
            }
        } catch (error) {
            errorHandler(res,error);
                res.end()
            }
    }
}

module.exports = posts