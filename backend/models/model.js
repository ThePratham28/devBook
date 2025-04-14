import { Sequelize } from "sequelize";
import sequelize from "../db/connectDb.js";
import bookmarkModel from "./bookmark.model.js";
import bookmarkTagModel from "./bookmarkTag.model.js";
import categoryModel from "./category.model.js";
import noteModel from "./note.model.js";
import tagModel from "./tag.model.js";
import userModel from "./user.model.js";

const models = {
    User: userModel(sequelize),
    Bookmark: bookmarkModel(sequelize),
    Tag: tagModel(sequelize),
    BookmarkTag: bookmarkTagModel(sequelize),
    Category: categoryModel(sequelize),
    Note: noteModel(sequelize),
};

// Associations
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
