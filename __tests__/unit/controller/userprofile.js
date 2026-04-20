const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Userprofile = require('../../../api/model/Userprofile');
const userprofileController = require('../../../api/controller/userprofile');

// Mock dependencies
jest.mock('../../../api/model/Userprofile');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe("Userprofile Controller", () => {

    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 1 },
            body: {
                email: "abc@gmail.com",
                password: "supersecretpassword"
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    // Get user by ID
    describe("getUserDetailsbyID", () => {

        it("should return user profile successfully", async () => {
            const mockUser = { user_id: 1, email: "abc@gmail.com" };

            Userprofile.getUserDetailsbyID.mockResolvedValue(mockUser);

            await userprofileController.getUserDetailsbyID(req, res);

            expect(Userprofile.getUserDetailsbyID).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it("should handle errors", async () => {
            Userprofile.getUserDetailsbyID.mockRejectedValue(new Error("DB error"));

            await userprofileController.getUserDetailsbyID(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
        });
    });

    // Get user by profile ID
    describe("getUserDetailsbyProfileID", () => {

        it("should return user profile by profile id", async () => {
            const mockUser = { profile_id: 10 };

            Userprofile.getUserDetailsbyProfileID.mockResolvedValue(mockUser);

            await userprofileController.getUserDetailsbyProfileID(req, res);

            expect(Userprofile.getUserDetailsbyProfileID).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it("should handle errors", async () => {
            Userprofile.getUserDetailsbyProfileID.mockRejectedValue(new Error("Error"));

            await userprofileController.getUserDetailsbyProfileID(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // Login
    describe("getUserDetailsbyEmail", () => {

        it("should return token if login successful", async () => {

            const mockUser = {
                email: "abc@gmail.com",
                password: "hashedpassword",
                user_id: 1
            };

            Userprofile.getUserDetailsbyEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(null, "mockToken");
            });

            await userprofileController.getUserDetailsbyEmail(req, res);
            
            expect(Userprofile.getUserDetailsbyEmail).toHaveBeenCalledWith("abc@gmail.com");
            expect(bcrypt.compare).toHaveBeenCalledWith("supersecretpassword", "hashedpassword");

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                token: "mockToken",
                email: "abc@gmail.com",
                user_id: 1
            });
        });

        it("should return error if user not found", async () => {
            Userprofile.getUserDetailsbyEmail.mockResolvedValue(null);

            await userprofileController.getUserDetailsbyEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "No user with that email available"
            });
        });

        it("should return error if password mismatch", async () => {
            const mockUser = {
                email: "abc@gmail.com",
                password: "hashedpassword"
            };

            Userprofile.getUserDetailsbyEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await userprofileController.getUserDetailsbyEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "User could not be authenticated"
            });
        });

        it("should return error if token generation fails", async () => {
            const mockUser = {
                email: "abc@gmail.com",
                password: "hashedpassword"
            };

            Userprofile.getUserDetailsbyEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(new Error("Token error"), null);
            });

            await userprofileController.getUserDetailsbyEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
        });
    });

    // SignUp
    describe("createUserProfile", () => {

        it("should create profile and return token", async () => {

            const mockResult = {
                email: "abc@gmail.com",
                user_id: 1,
                profile_id: 10,
                user_name: "Rumana",
                bio:"Hi, my name is Rumana and I am a trainee at LA Fosse!"
            };

            bcrypt.genSalt.mockResolvedValue("salt");
            bcrypt.hash.mockResolvedValue("hashedpassword");

            Userprofile.createUserProfile.mockResolvedValue(mockResult);

            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(null, "mockToken");
            });

            await userprofileController.createUserProfile(req, res);

            expect(bcrypt.genSalt).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith("supersecretpassword", "salt");

            expect(Userprofile.createUserProfile).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                token: "mockToken",
                user: {
                    user_id: 1,
                    email: "abc@gmail.com",
                    user_name: "Rumana"
                }
            });
        });

        it("should handle error in token generation", async () => {

            const mockResult = {
                email: "abc@gmail.com",
                user_id: 1,
                profile_id: 10,
                user_name: "Rumana"
            };

            bcrypt.genSalt.mockResolvedValue("salt");
            bcrypt.hash.mockResolvedValue("hashedpassword");

            Userprofile.createUserProfile.mockResolvedValue(mockResult);

            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(new Error("Token error"), null);
            });

            await userprofileController.createUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    // update profile
    describe("updateUserProfile", () => {

        it("should update profile successfully", async () => {

            const mockUserInstance = {
                updateUserProfile: jest.fn().mockResolvedValue({ user_name: "rumana_kadri" })
            };

            Userprofile.getUserDetailsbyID.mockResolvedValue(mockUserInstance);

            await userprofileController.updateUserProfile(req, res);

            expect(Userprofile.getUserDetailsbyID).toHaveBeenCalledWith(1);
            expect(mockUserInstance.updateUserProfile).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ user_name: "rumana_kadri" });
        });

        it("should hash password if provided", async () => {

            req.body.password = "newpass";

            const mockUserInstance = {
                updateUserProfile: jest.fn().mockResolvedValue({})
            };

            bcrypt.genSalt.mockResolvedValue("salt");
            bcrypt.hash.mockResolvedValue("hashed");

            Userprofile.getUserDetailsbyID.mockResolvedValue(mockUserInstance);

            await userprofileController.updateUserProfile(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith("newpass", "salt");
        });

        it("should handle errors", async () => {

            Userprofile.getUserDetailsbyID.mockRejectedValue(new Error("Not found"));

            await userprofileController.updateUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // Delete user
    describe("deleteUser", () => {

        it("should delete user successfully", async () => {

            const mockUserInstance = {
                deleteUser: jest.fn().mockResolvedValue({ message: "User deleted successfully" })
            };

            Userprofile.getUserDetailsbyID.mockResolvedValue(mockUserInstance);

            await userprofileController.deleteUser(req, res);

            expect(mockUserInstance.deleteUser).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
        });

        it("should handle errors", async () => {

            Userprofile.getUserDetailsbyID.mockRejectedValue(new Error("Not found"));

            await userprofileController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

});