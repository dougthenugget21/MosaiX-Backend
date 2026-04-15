const { describe } = require("node:test")
const Userdetails = require("../../../api/model/Userdetails")
const db = require("../../../db/connect")

describe("Userdetails", () => {
    beforeEach(() => {jest.clearAllMocks()})

    afterAll(() => {jest.resetAllMocks()})

    describe("getUserByID", () => {
        it("returns user details on successful db query", async () => {
            const mockUserDetails = [{user_id: 1, email:"abc@gmail.com",password:"supersecretandencrypted"}]
            jest.spyOn(db, "query").mockResolvedValueOnce({rows: mockUserDetails})

            const result = await Userdetails.getUserDetailsbyID(1)

            expect(result).toBeInstanceOf(Userdetails)
            expect(result.user_id).toBe(1)
            expect(result.email).toBe("abc@gmail.com")
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM user_details WHERE user_id = $1;", [1])
        })

        it("throws an error when no users are found with this ID", async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({rows: []})
            await expect(Userdetails.getUserDetailsbyID(999)).rejects.toThrow("Cannot find user details with the id.")
        })

    })

    describe("createUser", () => {
        it("returns the user details on successful creation", async () => {
            let userData = {email:"abc@gmail.com", password:"supersecretandencrypted"}
            jest.spyOn(db, "query").mockResolvedValueOnce({rows: [{...userData, user_id: 1}]})

            const result = await Userdetails.createUser(userData)

            //expect(result).toBeInstanceOf(Userdetails)
            expect(result).toHaveProperty("email", "abc@gmail.com")
            expect(result).toHaveProperty("user_id", 1)
            expect(db.query).toHaveBeenCalledWith("INSERT INTO user_details (email, password) VALUES ($1, $2) RETURNING *;", 
            [userData.email, userData.password])
        })

        it("should throw an error when email is missing", async () => {
            const incompleteUserDataE = {password:"supersecretandencrypted"}
        
            await expect(Userdetails.createUser(incompleteUserDataE)).rejects.toThrow("Email address is missing")
        })
    })
})