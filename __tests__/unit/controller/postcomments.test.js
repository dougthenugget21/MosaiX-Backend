const Postcomments = require("../../../api/model/Postcomments")
const postcommentsController = require("../../../api/controller/postcomments")
const { post } = require("../../../api/app")

jest.mock("../../../api/model/Postcomments")

describe("Post Comments Controller", () => {
    let req, res

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        }
    
        jest.clearAllMocks()
    })

    describe("getCommentsbyPostID", () => {
        beforeEach(() => {
            req = {
                params: {post_id:1}
            }
        })

        it("returns all posts of given Post ID successfully", async () => {
            const mockComments = [
                {id:1, comment: "this is a comment", post_id:1},
                {id:2, comment: "this is a comment", post_id:1}
            ]

            Postcomments.getCommentsbyPostID = jest.fn().mockResolvedValue(mockComments)

            await postcommentsController.getCommentsbyPostID(req, res)

            expect(Postcomments.getCommentsbyPostID).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockComments)
        })

        it("handles errors with a 500 response", async () => {
            Postcomments.getCommentsbyPostID = jest.fn().mockRejectedValue(new Error("DB Error"))

            await postcommentsController.getCommentsbyPostID(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error : "DB Error"})
        })
    })

    describe("getCommentbyID", () => {
        beforeEach(() => {
            req = {
                params: {id:1}
            }
        })

        it("returns all posts of a given ID successfully", async () => {
            const mockComment = {id:1, comment: "this is a comment", post_id:1}

            Postcomments.getCommentbyID = jest.fn().mockResolvedValue(mockComment)

            await postcommentsController.getCommentbyID(req, res)

            expect(Postcomments.getCommentbyID).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockComment)
        })

        it("handles errors with a 500 response", async () => {
            Postcomments.getCommentbyID = jest.fn().mockRejectedValue(new Error("DB Error"))
        
            await postcommentsController.getCommentbyID(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: "DB Error"})
        })
    })

    describe("createComment", () => {
        beforeEach(() => {
            req = {
                params:{id: 1},
                body:{
                    post_id: 1,
                    comment: "This is a new comment",
                    by_profile_id: 12
                }
            }
        })
        it("returns a new created post successfully", async () => {
            const mockComment = {id:1, comment: "This is a new comment", post_id:1}

            Postcomments.createComment = jest.fn().mockResolvedValue(mockComment)

            await postcommentsController.createComment(req, res)

            expect(Postcomments.createComment).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockComment)
        })

        it("handles errors correctly with a 404 error", async () => {
            Postcomments.createComment = jest.fn().mockRejectedValue(new Error("DB Error"))

            await postcommentsController.createComment(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({error: "DB Error"})
        })
    })

    describe("updateComment", () => {
        beforeEach(() => {
            req = {
                params:{id: 1},
                body:{
                    post_id: 1,
                    comment: "This is a new comment",
                    by_profile_id: 12
                }
            }
        })
        
        it("returns an updated comment successfully", async () => {
            const mockUpdatedComment = {id: 1}
            const mockCommentInstance = {
                updateComment: jest.fn().mockResolvedValue(mockUpdatedComment)
            }

            Postcomments.getCommentbyID.mockResolvedValue(mockCommentInstance)

            await postcommentsController.updateComment(req, res)

            expect(Postcomments.getCommentbyID).toHaveBeenCalledWith(1)
            expect(mockCommentInstance.updateComment).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockUpdatedComment)
        })

        it("handles errors with a 404 response", async () => {
            Postcomments.getCommentbyID.mockRejectedValue(new Error("DB Error"))

            await postcommentsController.updateComment(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({error: "DB Error"})
        })
    })

    describe("deleteComment", () => {
        beforeEach(() => {
            req = {
                params: {id: 1}
            }
        })

        it("deletes and returns a comment on successful query", async () => {
            const mockDeletedComment = {id: 1}
            const mockCommentInstance = {
                deleteComment: jest.fn().mockResolvedValue(mockDeletedComment)
            }

            Postcomments.getCommentbyID.mockResolvedValue(mockCommentInstance)

            await postcommentsController.deleteComment(req, res)

            expect(Postcomments.getCommentbyID).toHaveBeenCalledWith(1)
            expect(mockCommentInstance.deleteComment).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(204)
            expect(res.json).toHaveBeenCalledWith(mockDeletedComment)
        })

        it("handles errors with a 404 response", async () => {
            Postcomments.getCommentbyID.mockRejectedValue(new Error("DB Error"))

            await postcommentsController.deleteComment(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({error: "DB Error"})
        })
    })
})