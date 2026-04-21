const Posts = require('../../../api/model/userPosts');
const userPostsController = require('../../../api/controller/userPosts');

jest.mock('../../../api/model/userPosts');

describe("User Posts Controller", () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 1 },
            query: {
                long: "-74.0060",
                lat: "40.7128",
                dist: "10",
                profileId: "2",
                postId: "5"
            },
            body: {
                profile_id: 2,
                photo_url: "https://picsum.photos/seed/post1/600/400",
                longitude: -74.006,
                latitude: 40.7128,
                post_title: "Test Post",
                post_desc: "Test Description",
                tags: "food,nature",
                postId: 5,
                profileId: 2,
                report_desc: "Spam"
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        jest.clearAllMocks();
    });

    describe("allPosts", () => {
        it("should return all posts successfully", async () => {
            const mockPosts = [
                { id: 1, post_title: "Post 1" },
                { id: 2, post_title: "Post 2" }
            ];

            Posts.getAllPosts = jest.fn().mockResolvedValue(mockPosts);

            await userPostsController.allPosts(req, res);

            expect(Posts.getAllPosts).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPosts);
        });

        it("should handle errors", async () => {
            Posts.getAllPosts = jest.fn().mockRejectedValue(new Error("DB error"));

            await userPostsController.allPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
        });
    });

    describe("getNearbyPosts", () => {
        it("should return nearby posts successfully", async () => {
            const mockPosts = [{ id: 1, post_title: "Nearby post" }];

            Posts.getNearbyPosts.mockResolvedValue(mockPosts);

            await userPostsController.getNearbyPosts(req, res);

            expect(Posts.getNearbyPosts).toHaveBeenCalledWith(40.7128, -74.006, 10, 2);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPosts);
        });

        it("should handle errors", async () => {
            Posts.getNearbyPosts.mockRejectedValue(new Error("DB error"));

            await userPostsController.getNearbyPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
        });
    });

    describe("increaseLikes", () => {
        it("should increase likes successfully", async () => {
            const mockUpdatedPost = { id: 5, like_count: 10 };
            const mockPostInstance = {
                increaseLikeCount: jest.fn().mockResolvedValue(mockUpdatedPost)
            };

            Posts.getByPostId.mockResolvedValue(mockPostInstance);

            await userPostsController.increaseLikes(req, res);

            expect(Posts.getByPostId).toHaveBeenCalledWith("5");
            expect(mockPostInstance.increaseLikeCount).toHaveBeenCalledWith("2");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedPost);
        });

        it("should handle errors", async () => {
            Posts.getByPostId.mockRejectedValue(new Error("DB error"));

            await userPostsController.increaseLikes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
        });
    });

    describe("decreaseLikes", () => {
        it("should decrease likes successfully", async () => {
            const mockUpdatedPost = { id: 5, like_count: 3 };
            const mockPostInstance = {
                decreaseLikeCount: jest.fn().mockResolvedValue(mockUpdatedPost)
            };

            Posts.getByPostId.mockResolvedValue(mockPostInstance);

            await userPostsController.decreaseLikes(req, res);

            expect(Posts.getByPostId).toHaveBeenCalledWith("5");
            expect(mockPostInstance.decreaseLikeCount).toHaveBeenCalledWith("2");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedPost);
        });

        it("should handle errors", async () => {
            Posts.getByPostId.mockRejectedValue(new Error("DB error"));

            await userPostsController.decreaseLikes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
        });
    });

    describe("getByPostId", () => {
        it("should return post by id successfully", async () => {
            const mockPost = { id: 1, post_title: "Test Post" };

            Posts.getByPostId.mockResolvedValue(mockPost);

            await userPostsController.getByPostId(req, res);

            expect(Posts.getByPostId).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPost);
        });

        it("should handle errors", async () => {
            Posts.getByPostId.mockRejectedValue(new Error("Not found"));

            await userPostsController.getByPostId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
        });
    });

    describe("getByProfileId", () => {
        it("should return posts by profile id successfully", async () => {
            const mockPosts = [{ id: 1 }, { id: 2 }];

            Posts.getAllByProfileId.mockResolvedValue(mockPosts);

            await userPostsController.getByProfileId(req, res);

            expect(Posts.getAllByProfileId).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPosts);
        });

        it("should handle errors", async () => {
            Posts.getAllByProfileId.mockRejectedValue(new Error("Not found"));

            await userPostsController.getByProfileId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
        });
    });

    describe("createPost", () => {
        it("should create a post successfully", async () => {
            const mockPost = { id: 10, post_title: "Test Post" };

            Posts.createPost.mockResolvedValue(mockPost);

            await userPostsController.createPost(req, res);

            expect(Posts.createPost).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ data: mockPost });
        });

        it("should handle errors", async () => {
            Posts.createPost.mockRejectedValue(new Error("Invalid data"));

            await userPostsController.createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: "Invalid data" });
        });
    });

    describe("deletePost", () => {
        it("should delete a post successfully", async () => {
            const mockDeletedPost = { id: 1 };
            const mockPostInstance = {
                deletePost: jest.fn().mockResolvedValue(mockDeletedPost)
            };

            Posts.getByPostId.mockResolvedValue(mockPostInstance);

            await userPostsController.deletePost(req, res);

            expect(Posts.getByPostId).toHaveBeenCalledWith(1);
            expect(mockPostInstance.deletePost).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ data: mockDeletedPost });
        });

        it("should handle errors", async () => {
            Posts.getByPostId.mockRejectedValue(new Error("Delete failed"));

            await userPostsController.deletePost(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith("Delete failed");
        });
    });

    describe("reportPost", () => {
        it("should report a post successfully", async () => {
            const mockReportedPost = {
                id: 1,
                post_id: 5,
                profile_id: 2,
                report_desc: "Spam"
            };

            const mockPostInstance = {
                reportPost: jest.fn().mockResolvedValue(mockReportedPost)
            };

            Posts.getByPostId.mockResolvedValue(mockPostInstance);

            await userPostsController.reportPost(req, res);

            expect(Posts.getByPostId).toHaveBeenCalledWith(5);
            expect(mockPostInstance.reportPost).toHaveBeenCalledWith(2, "Spam");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ data: mockReportedPost });
        });
    });
});