import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class Tag extends Model {
        static associate(models) {
            Tag.belongsToMany(models.Bookmark, {
                through: models.BookmarkTag,
                foreignKey: "tagId",
            });
        }
    }

    Tag.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: "Tag",
        }
    );
    return Tag;
};
