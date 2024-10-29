const prisma=require('../config/dataBase')


const userController={
    async checkApi(req, res) {
        
        const { firstName, lastName, email, phoneNumber, password } = req.body;
    
        try {
            // Create the new user in the database without hashing the password
            await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    password, // Storing the password as is
                },
            });
    
            // Respond with a success message
            res.status(201).json({ message: "Account created" });
        } catch (error) {
            console.error(error); // Log the error for debugging
    
            // Handle specific error cases
            if (error.code === 'P2002') { // Unique constraint violation
                return res.status(400).json({ error: "Email already in use." });
            }
    
            // General error response
            res.status(500).json({ error: "Internal Server Error" });
        }
    }    
}

module.exports=userController;