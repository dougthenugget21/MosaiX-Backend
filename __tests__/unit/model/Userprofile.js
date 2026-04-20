const Userprofile = require("../../../api/model/Userprofile");
const db = require("../../../db/connect");

describe("Userprofile", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe("getUserDetailsbyID", () => {

        it("returns user profile details when found", async () => {
            const mockData = [{
                user_id: 1,
                email: "abc@gmail.com",
            }];

            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockData });

            const result = await Userprofile.getUserDetailsbyID(1);

            expect(result).toBeInstanceOf(Userprofile);
            expect(result.user_id).toBe(1);
            expect(result.email).toBe("abc@gmail.com");
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining("WHERE u.user_id = $1"),
                [1]
            );
        });

        it("throws error if user not found", async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

            await expect(
                Userprofile.getUserDetailsbyID(999)
            ).rejects.toThrow("Cannot find user details with the id.");
        });
    });

    describe("getUserDetailsbyProfileID", () => {

        it("returns user profile when found", async () => {
            const mockData = [{
                user_id: 1,
                profile_id: 5,
                email: "abc@gmail.com"
            }];

            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockData });

            const result = await Userprofile.getUserDetailsbyProfileID(5);

            expect(result).toBeInstanceOf(Userprofile);
            expect(result.profile_id).toBe(5);
        });

        it("throws error if profile not found", async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

            await expect(
                Userprofile.getUserDetailsbyProfileID(999)
            ).rejects.toThrow("Cannot find user details with the profile id.");
        });
    });

    describe("getUserDetailsbyEmail", () => {

        it("returns user profile when found", async () => {
            const mockData = [{
                user_id: 1,
                email: "abc@gmail.com"
            }];

            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockData });

            const result = await Userprofile.getUserDetailsbyEmail("abc@gmail.com");

            expect(result).toBeInstanceOf(Userprofile);
            expect(result.email).toBe("abc@gmail.com");
        });

        it("throws error if email not found", async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

            await expect(
                Userprofile.getUserDetailsbyEmail("wrong@gmail.com")
            ).rejects.toThrow("Cannot find user details with email.");
        });
    });

    describe("createUserProfile", () => {

        it("creates user and profile successfully", async () => {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };

            jest.spyOn(db, "connect").mockResolvedValue(mockClient);

            const userData = {
                email: "abc@gmail.com",
                password: "secret",
                user_name: "Rumana"
            };

            mockClient.query
                .mockResolvedValueOnce()
                .mockResolvedValueOnce({ rows: [{ user_id: 1, email: userData.email }] })
                .mockResolvedValueOnce({ rows: [{ profile_id: 10, user_name: "Rumana" }] })
                .mockResolvedValueOnce();

            const result = await Userprofile.createUserProfile(userData);

            expect(result).toBeInstanceOf(Userprofile);
            expect(result.email).toBe(userData.email);
            expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
            expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
            expect(mockClient.release).toHaveBeenCalled();
        });

        it("rolls back transaction on error", async () => {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };

            jest.spyOn(db, "connect").mockResolvedValue(mockClient);

            mockClient.query
                .mockResolvedValueOnce()
                .mockRejectedValueOnce(new Error("DB error")); 

            await expect(
                Userprofile.createUserProfile({ email: "abc", password: "123" })
            ).rejects.toThrow("DB error");

            expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
            expect(mockClient.release).toHaveBeenCalled();
        });
    });

    describe("updateUserProfile", () => {

        it("updates user and profile successfully", async () => {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };

            jest.spyOn(db, "connect").mockResolvedValue(mockClient);

            const existingUser = new Userprofile({ user_id: 1 });

            mockClient.query
                .mockResolvedValueOnce() // BEGIN
                .mockResolvedValueOnce() // update user_details
                .mockResolvedValueOnce({ rows: [{ user_name: "rumana_kadri" }] }) // profile update
                .mockResolvedValueOnce(); // COMMIT

            const result = await existingUser.updateUserProfile({
                user_name: "rumana_kadri"
            });

            expect(result).toBeInstanceOf(Userprofile);
            expect(result.user_name).toBe("rumana_kadri");
            expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
        });

        it("rolls back if update fails", async () => {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };

            jest.spyOn(db, "connect").mockResolvedValue(mockClient);

            const existingUser = new Userprofile({ user_id: 1 });

            mockClient.query
                .mockResolvedValueOnce() // BEGIN
                .mockRejectedValueOnce(new Error("Update failed"));

            await expect(
                existingUser.updateUserProfile({ email: "fail@test.com" })
            ).rejects.toThrow("Update failed");

            expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
        });
    });

    describe("deleteUser", () => {

        it("deletes user and profile successfully", async () => {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };

            jest.spyOn(db, "connect").mockResolvedValue(mockClient);

            const user = new Userprofile({ user_id: 1 });

            mockClient.query
                .mockResolvedValueOnce()
                .mockResolvedValueOnce() 
                .mockResolvedValueOnce() 
                .mockResolvedValueOnce(); 

            const result = await user.deleteUser();

            expect(result).toEqual({ message: "User deleted successfully" });
            expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
        });

        it("rolls back if delete fails", async () => {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };

            jest.spyOn(db, "connect").mockResolvedValue(mockClient);

            const user = new Userprofile({ user_id: 1 });

            mockClient.query
                .mockResolvedValueOnce()
                .mockRejectedValueOnce(new Error("Delete failed"));

            await expect(user.deleteUser()).rejects.toThrow("Delete failed");

            expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
        });
    });

});