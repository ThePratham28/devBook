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
        }
    );
    return Category;
};
