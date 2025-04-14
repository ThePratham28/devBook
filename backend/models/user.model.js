import { hash, verify } from "argon2";
import { DataTypes, Model } from "sequelize";

// User model definition
export default (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Bookmark, {
                foreignKey: "userID",
                onDelete: "CASCADE",
            });
            User.hasMany(models.Category, {
                foreignKey: "userID",
                onDelete: "CASCADE",
            });
        }

        async isValidPassword(password) {
            return await verify(this.password, password);
        }
    }

    User.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastLogin: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verificationTokenExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "User",
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await hash(user.password);
                }
            },
        }
    });

    return User;
};


