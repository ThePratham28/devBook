import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class Note extends Model {
        static associate(models) {
            Note.belongsTo(models.Bookmark, {
                foreignKey: "bookmarkId",
                onDelete: "CASCADE",
            });
        }
    }

    Note.init(
        {
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Note",
        }
    );

    return Note;
};
