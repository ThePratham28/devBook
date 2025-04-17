import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class Category extends Model {
        static associate(models) {
            Category.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            Category.hasMany(models.Bookmark, {
                foreignKey: "categoryId",
                onDelete:"CASCADE",
            })
        }
    }

Category.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Category",
        indexes: [
            { fields: ["userId"] }, // Index for filtering by user
            { fields: ["name", "userId"], unique: true }, // Unique index for category names per user
        ],
    }
);
    return Category;
};
