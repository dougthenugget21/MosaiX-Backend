const Postcomments = require("../../../api/model/Postcomments")
const db = require("../../../db/connect")

describe("Post comments", () => {
    beforeEach(() => {jest.resetAllMocks()})
    afterAll(() => {jest.resetAllMocks()})

    describe("getCommentsbyPostID", () => {
        it("returns comments on a successful query", async () => {
            const mockPostComments = {rows:[{
                "id":1,
                "post_id":1,
                "comment":"This is a comment on a great post",
                "by_profile_id":1,
                "user_name":"Tom&Jerry",
                "created_date":"2026-04-16T07:59:16.997Z",
                "profilephoto_url": "url",
                "reputation_badge": "Beginner"
            }]}

            jest.spyOn(db, "query").mockResolvedValueOnce(mockPostComments)

            const result = await Postcomments.getCommentsbyPostID(1)

            expect(result[0]).toBeInstanceOf(Postcomments)
            expect(result[0].id).toBe(1)
            expect(result[0].user_name).toBe("Tom&Jerry")
        })

        it("throws and error if no comments can be found", async () => {
            const mockPostComments = {rows:[]}

            jest.spyOn(db, "query").mockResolvedValueOnce(mockPostComments)

            await expect(Postcomments.getCommentsbyPostID(1)).rejects.toThrow("No comments for this post")
        })
    })

    describe("getCommentbyID", () => {
        it("returns comment by ID on successful querry", async () => {
            const mockPostComment = {rows:[{
                "id":1,
                "post_id":1,
                "comment":"This is a comment on a great post",
                "by_profile_id":1,
                "user_name":"Tom&Jerry",
                "created_date":"2026-04-16T07:59:16.997Z",
                "profilephoto_url": "url",
                "reputation_badge": "Beginner"
            }]}

            jest.spyOn(db, "query").mockResolvedValueOnce(mockPostComment)

            const result = await Postcomments.getCommentbyID(1)

            expect(result).toBeInstanceOf(Postcomments)
            expect(result.id).toBe(1)
            expect(result.user_name).toBe("Tom&Jerry")
        })

        it("throws an error if no comment can be found with this ID", async () => {
            const mockPostComment = {rows:[]}

            jest.spyOn(db, "query").mockResolvedValueOnce(mockPostComment)

            await expect(Postcomments.getCommentbyID(1)).rejects.toThrow("No comments for this commentID")
        })
    })

    describe("createComment", () => {
        it("creates and returns a new comment on successful query", async () => {
            const mockCreateData = {post_id: 1, comment: "This is a new comment", by_profile_id:1}
            const mockCreateComment = {rows:[{
                "id":1,
                "post_id":1,
                "comment":"This is a new comment",
                "by_profile_id":1,
                "user_name":"Tom&Jerry",
                "created_date":"2026-04-16T07:59:16.997Z",
                "profilephoto_url": "url",
                "reputation_badge": "Beginner"
            }]}
            jest.spyOn(db, "query").mockResolvedValueOnce(mockCreateComment)
            
            const result = await Postcomments.createComment(mockCreateData)

            expect(result).toHaveProperty("user_name", "Tom&Jerry")
        })

        it("throws an error if comment is missing", async () => {
            const mockCreateData = {post_id: 1, by_profile_id:1}
            
            await expect(Postcomments.createComment(mockCreateData)).rejects.toThrow("Comment details are missing")
        })

        it("throws an error if by_profile_id is missing", async () => {
            const mockCreateData = {post_id: 1, comment:"This is a new comment"}
            
            await expect(Postcomments.createComment(mockCreateData)).rejects.toThrow("Comment details are missing")
        })

    })

    describe("updateComment", () => {
        it("Updates and returns a comment on successful db query", async () => {
            const comment = new Postcomments({
                "id":1,
                "post_id":1,
                "comment":"This is a comment on a great post",
                "by_profile_id":1,
                "user_name":"Tom&Jerry",
                "created_date":"2026-04-16T07:59:16.997Z",
                "profilephoto_url": "url",
                "reputation_badge": "Beginner"
            })
            const newComment = {comment:"This is a new comment"}
            
            const mockComment = {rows:[{
                "id":1,
                "post_id":1,
                "comment":"This is a new comment",
                "by_profile_id":1,
                "user_name":"Tom&Jerry",
                "created_date":"2026-04-16T07:59:16.997Z",
                "profilephoto_url": "url",
                "reputation_badge": "Beginner"
            }]}

            jest.spyOn(db, "query").mockResolvedValueOnce(mockComment)

            const result = await comment.updateComment(newComment)

            expect(result).toBeInstanceOf(Postcomments)
            expect(result).toHaveProperty("comment", "This is a new comment")
        })

        it("throws an error when nothing is returned from the database", async () => {
            const comment = new Postcomments({
                "id":1,
                "post_id":1,
                "comment":"This is a comment on a great post",
                "by_profile_id":1,
                "user_name":"Tom&Jerry",
                "created_date":"2026-04-16T07:59:16.997Z",
                "profilephoto_url": "url",
                "reputation_badge": "Beginner"
            })
            const newComment = {comment:"This is a new comment"}
            const mockComment = {rows: []}
            jest.spyOn(db, "query").mockResolvedValueOnce(mockComment)
            
            await expect(comment.updateComment(newComment)).rejects.toThrow("Unable to update comment.")
        })
    })

    describe("deleteComment", () => {
        it("Deletes and returns a post on successful db query", async () => {
            const comment = new Postcomments({
                "id":1,
                "post_id":1,
                "comment":"This is a comment on a great post",
                "by_profile_id":1,
                "user_name":"Tom&Jerry",
                "created_date":"2026-04-16T07:59:16.997Z",
                "profilephoto_url": "url",
                "reputation_badge": "Beginner"
            })

            const mockComment = {rows:[{
                "id":1,
                "post_id":1,
                "comment":"This is a new comment",
                "by_profile_id":1,
                "user_name":"Tom&Jerry",
                "created_date":"2026-04-16T07:59:16.997Z",
                "profilephoto_url": "url",
                "reputation_badge": "Beginner"
            }]} 

            jest.spyOn(db, "query").mockResolvedValueOnce(mockComment)

            const result = await comment.deleteComment()

            expect(result).toBeInstanceOf(Postcomments)
            expect(result.id).toBe(1)
        })
    })
})