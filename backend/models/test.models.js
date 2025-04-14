import models from "./model.js";

(async () => {
    try {
        await models.sequelize.sync({ force: true });
        console.log("Database synchronized successfully");

        // Create a user
        const user = await models.User.create({
            email: "test@example.com",
            password: "password123",
            name: "Test User",
        });

        // Create a bookmark
        const bookmark = await models.Bookmark.create({
            userId: user.id,
            title: "Sequelize Docs",
            url: "https://sequelize.org",
            description: "Official Sequelize documentation",
        });

        console.log("User and Bookmark created successfully!");
    } catch (error) {
        console.error("Error during test:", error);
    } finally {
        await models.sequelize.close();
        console.log("Database connection closed");
    }
})();


