import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class BookmarkTag extends Model {
        static associate(models) {}
    }

    BookmarkTag.init(
        {
            bookmarkId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tagId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "BookmarkTag",
            indexes: [
                { fields: ["bookmarkId", "tagId"], unique: true }, // Composite index for many-to-many relationships
            ],
        }
    );
    return BookmarkTag;
};
