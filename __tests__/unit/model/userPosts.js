const userPosts = require('../../../api/model/userPosts')
const db = require('../../../db/connect')

describe("User Posts", () => {
    beforeEach(()=> {jest.resetAllMocks()})
    afterAll(()=> {jest.resetAllMocks()})
    describe('getByPostId', () => {
        it('returns post by id on a successful query', async () =>{
            const mockUserPost = {
                rows:
                [{
                "id": 2,
                "profile_id": 2,
                "photo_url": "https://picsum.photos/seed/post2/600/400",
                "longitude": -74.006,
                "latitude": 40.7128,
                "post_desc": "Best pizza ever",
                "like_count": 2,
                "created_date": "2026-04-16T07:59:16.997Z",
                "tags": "food,nature",
                "profilephoto_url": "https://picsum.photos/seed/bob/200/200",
                "reputation_badge": "Beginner",
                "user_name": "bob_the_builder"
                }]}
            const mockUserProfile = {
                rows: [{
                profilephoto_url: "https://picsum.photos/seed/bob/200/200",
                reputation_badge: "Beginner",
                user_name: "bob_the_builder"
                }]
            }
            jest.spyOn(db, "query")
                .mockResolvedValueOnce(mockUserPost)
                .mockResolvedValueOnce(mockUserProfile)

            const result = await userPosts.getByPostId(2)

            expect(result).toBeInstanceOf(userPosts)
            expect(result.id).toBe(2)
            expect(result.tags).toEqual(["food", "nature"])
            expect(result.user_name).toBe("bob_the_builder")
            expect(result.reputation_badge).toBe("Beginner")
        })       
        it('throws an error if the post cannot be found', async() => {
            const mockUserPost = {
                rows:
                []}
            const mockUserProfile = {
                rows: []
            }
            jest.spyOn(db, "query")
                .mockResolvedValueOnce(mockUserPost)
                .mockResolvedValueOnce(mockUserProfile)

            await expect(userPosts.getByPostId(1)).rejects.toThrow('This post cannot be found')
        })   
        
    })
    describe('getAllByProfileId', () => {
        it('returns all posts for a profile on a successful query', async () => {
            const mockUserPosts = {
                rows: [
                    {
                        id: 1,
                        profile_id: 2,
                        photo_url: "https://picsum.photos/seed/post1/600/400",
                        longitude: -74.006,
                        latitude: 40.7128,
                        post_desc: "First post",
                        like_count: 5,
                        created_date: "2026-04-16T07:59:16.997Z",
                        tags: "food,nature"
                    },
                    {
                        id: 2,
                        profile_id: 2,
                        photo_url: "https://picsum.photos/seed/post2/600/400",
                        longitude: -74.005,
                        latitude: 40.7127,
                        post_desc: "Second post",
                        like_count: 3,
                        created_date: "2026-04-16T08:00:00.000Z",
                        tags: "travel,city"
                    }
                ]
            }

            const mockUserProfile = {
                rows: [{
                    profilephoto_url: "https://picsum.photos/seed/bob/200/200",
                    reputation_badge: "Beginner",
                    user_name: "bob_the_builder"
                }]
            }

            jest.spyOn(db, "query")
                .mockResolvedValueOnce(mockUserPosts)
                .mockResolvedValueOnce(mockUserProfile)

            const result = await userPosts.getAllByProfileId(2)
            expect(result).toHaveLength(2)
            expect(result[0]).toBeInstanceOf(userPosts)
            expect(result[1]).toBeInstanceOf(userPosts)

            expect(result[0].id).toBe(1)
            expect(result[0].tags).toEqual(["food", "nature"])
            expect(result[0].user_name).toBe("bob_the_builder")
            expect(result[0].profilephoto_url).toBe("https://picsum.photos/seed/bob/200/200")
            expect(result[0].reputation_badge).toBe("Beginner")

            expect(result[1].id).toBe(2)
            expect(result[1].tags).toEqual(["travel", "city"])
            expect(result[1].user_name).toBe("bob_the_builder")
        })

        it('throws an error if no posts can be found for that profile', async () => {
            const mockUserPosts = {
                rows: []
            }
            const mockUserProfile = {
                rows: []
            }

            jest.spyOn(db, "query")
                .mockResolvedValueOnce(mockUserPosts)
                .mockResolvedValueOnce(mockUserProfile)

            await expect(userPosts.getAllByProfileId(2)).rejects.toThrow('This post cannot be found')
        })
    })
    describe('getNearbyPosts', () => {
        it('returns nearby posts on a successful ', async () => {
            const mockNearbyPosts = {
                rows: [
                    {
                        id: 1,
                        profile_id: 2,
                        photo_url: "https://picsum.photos/seed/post1/600/400",
                        longitude: -74.006,
                        latitude: 40.7128,
                        post_desc: "Nice place nearby",
                        like_count: 5,
                        created_date: "2026-04-16T07:59:16.997Z",
                        tags: "food,nature",
                        profilephoto_url: "https://picsum.photos/seed/bob/200/200",
                        reputation_badge: "Beginner",
                        user_name: "bob_the_builder"
                    }
                ]
            }

            jest.spyOn(db, "query").mockResolvedValueOnce(mockNearbyPosts)

            const result = await userPosts.getNearbyPosts(40.7128, -74.0060, 10)

            expect(result).toHaveLength(1)
            expect(result[0]).toBeInstanceOf(userPosts)
            expect(result[0].id).toBe(1)
            expect(result[0].tags).toEqual(["food", "nature"])
            expect(result[0].user_name).toBe("bob_the_builder")
        })

        it('returns an empty array if no nearby posts are found', async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

            const result = await userPosts.getNearbyPosts(40.7128, -74.0060, 10)

            expect(result).toEqual([])
        })
    })
    describe('deletePost', () => {
        it('deletes a post successfully', async () => {
            const post = new userPosts({ id: 2 })

            const mockDeletedPost = {
                rows: [
                    {
                        id: 2,
                        profile_id: 2,
                        photo_url: "https://picsum.photos/seed/post2/600/400"
                    }
                ]
            }

            jest.spyOn(db, "query").mockResolvedValueOnce(mockDeletedPost)

            const result = await post.deletePost()

            expect(result.id).toBe(2)
            expect(db.query).toHaveBeenCalledWith(
                "DELETE FROM user_posts where id = $1 RETURNING *",
                [2]
            )
        })
    })
    describe('createPost', () => {
        it('creates a new post successfully exists', async () => {
            const mockClient = {
                query: jest.fn()
            }
            jest.spyOn(db, "connect").mockResolvedValue(mockClient)

            mockClient.query
                .mockResolvedValueOnce({}) // BEGIN
                .mockResolvedValueOnce({
                    rows: [{
                        id: 10,
                        profile_id: 2,
                        photo_url: "https://picsum.photos/seed/post10/600/400",
                        longitude: -74.006,
                        latitude: 40.7128,
                        post_title: "New Post",
                        post_desc: "New description"
                    }]
                }) // insert post
                .mockResolvedValueOnce({
                    rows: [{ id: 5, tag_name: "food" }]
                }) // select tag
                .mockResolvedValueOnce({
                    rows: [{ post_id: 10, hash_tags: 5 }]
                }) // insert into post_tags
                .mockResolvedValueOnce({}) // COMMIT

            const postData = {
                profile_id: 2,
                photo_url: "https://picsum.photos/seed/post10/600/400",
                longitude: -74.006,
                latitude: 40.7128,
                post_title: "New Post",
                post_desc: "New description",
                tags: "food"
            }

            const result = await userPosts.createPost(postData)

            expect(result.id).toBe(10)
            expect(result.profile_id).toBe(2)
        })

        it('throws an error if profile_id is missing', async () => {
            const postData = {
                photo_url: "https://picsum.photos/seed/post10/600/400",
                longitude: -74.006,
                latitude: 40.7128,
                post_title: "New Post",
                post_desc: "New description",
                tags: "food"
            }

            await expect(userPosts.createPost(postData))
                .rejects.toThrow('profile id is missing')
        })

        it('throws an error if photo_url is missing', async () => {
            const postData = {
                profile_id: 2,
                longitude: -74.006,
                latitude: 40.7128,
                post_title: "New Post",
                post_desc: "New description",
                tags: "food"
            }

            await expect(userPosts.createPost(postData))
                .rejects.toThrow('photo url is is missing')
        })

        it('throws an error if location is missing', async () => {
            const postData = {
                profile_id: 2,
                photo_url: "https://picsum.photos/seed/post10/600/400",
                post_title: "New Post",
                post_desc: "New description",
                tags: "food"
            }

            await expect(userPosts.createPost(postData))
                .rejects.toThrow('location fields are missing')
        })

        it('throws an error if title is missing', async () => {
            const postData = {
                profile_id: 2,
                photo_url: "https://picsum.photos/seed/post10/600/400",
                longitude: -74.006,
                latitude: 40.7128,
                post_desc: "New description",
                tags: "food"
            }

            await expect(userPosts.createPost(postData))
                .rejects.toThrow('title is missing')
        })

        it('throws an error if post_desc is missing', async () => {
            const postData = {
                profile_id: 2,
                photo_url: "https://picsum.photos/seed/post10/600/400",
                longitude: -74.006,
                latitude: 40.7128,
                post_title: "New Post",
                tags: "food"
            }

            await expect(userPosts.createPost(postData))
                .rejects.toThrow('description of post is missing')
        })
        it('throws an error when tags are missing', async() =>{
            const postData = {
                profile_id: 2,
                photo_url: "https://picsum.photos/seed/post10/600/400",
                longitude: -74.006,
                latitude: 40.7128,
                post_title: "New Post",
                post_desc: "New description",
            } 
            await expect(userPosts.createPost(postData)).rejects.toThrow('there needs to be at least one tag')
        })

            
    })
})






