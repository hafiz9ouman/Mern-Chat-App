export const getUsersForSidebar = async (req, res) => {
    try {
        res.send("ok");
    } catch (error) {
        console.log("Error in getUsersForSidebar", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}