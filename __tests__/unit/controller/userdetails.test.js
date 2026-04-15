const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Userdetails = require('../../../api/model/Userdetails');
const userdetailsController = require('../../../api/controller/userdetails');
userdetailsController
// Mock dependencies
jest.mock('../../../api/model/Userdetails');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe("User Controller", () => {
    let req, res;
    beforeEach(() => {
        req = {
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

    // Login
    describe("getUserDetailsbyEmail", () => {

        it("should return token if login successful", async () => {

            const mockUser = {
                email: "abc@gmail.com",
                password: "hashedpassword",
                user_id: 1
            };

            Userdetails.getUserDetailsbyEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(null, "mockToken");
            });

            await userdetailsController.getUserDetailsbyEmail(req, res);

            expect(Userdetails.getUserDetailsbyEmail).toHaveBeenCalledWith("abc@gmail.com");
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

            Userdetails.getUserDetailsbyEmail.mockResolvedValue(null);

            await userdetailsController.getUserDetailsbyEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "No user with that email available"
            });
        });

        it("should return error if password mismatch", async () => {

            const mockUser = {
                email: "abc@gmail.com",
                password: "hashedpassword",
                user_id: 1
            };

            Userdetails.getUserDetailsbyEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await userdetailsController.getUserDetailsbyEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "User could not be authenticated"
            });
        });
    });

    // Signup
    describe("createUser", () => {

        it("should create user and return token", async () => {

            const mockResult = {
                email: "abc@gmail.com",
                user_id: 1
            };

            bcrypt.genSalt.mockResolvedValue("salt");
            bcrypt.hash.mockResolvedValue("hashedpassword");

            Userdetails.createUser.mockResolvedValue(mockResult);

            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(null, "mockToken");
            });

            await userdetailsController.createUser(req, res);

            expect(bcrypt.genSalt).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith("supersecretpassword", "salt");

            expect(Userdetails.createUser).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                token: "mockToken",
                email: "abc@gmail.com",
                user_id: 1
            });
        });

        it("should return error if token generation fails", async () => {

            const mockResult = {
                email: "abc@gmail.com",
                user_id: 1
            };

            bcrypt.genSalt.mockResolvedValue("salt");
            bcrypt.hash.mockResolvedValue("hashedpassword");

            Userdetails.createUser.mockResolvedValue(mockResult);

            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(new Error("Token error"), null);
            });

            await userdetailsController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
        });
    });
});