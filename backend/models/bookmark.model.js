import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class Bookmark extends Model {
        static associate(models) {
            Bookmark.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            Bookmark.belongsToMany(models.Tag, {
                through: models.BookmarkTag,
                foreignKey: "bookmarkId",
            });
            Bookmark.belongsTo(models.Category, {
                foreignKey: "categoryId",
                onDelete: "CASCADE",
            });
            Bookmark.hasMany(models.Note, {
                foreignKey: "bookmarkId",
                onDelete: "CASCADE",
            });
        }
    }

    Bookmark.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isUrl: true,
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            isPublic: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "Bookmark",
            indexes: [
                { fields: ["userId"] }, // Index for filtering by user
                { fields: ["categoryId"] }, // Index for filtering by category
                { fields: ["createdAt"] }, // Index for sorting
                {
                    fields: ["title", "description"],
                    using: "GIN",
                    operator: "gin_trgm_ops",
                }, // Full-text search index
            ],
        }
    );

    return Bookmark;
};
