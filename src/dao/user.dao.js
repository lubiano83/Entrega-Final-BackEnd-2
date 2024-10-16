import UserModel from "../models/user.model.js";

class UserDao {
    async findById(id) {
        return await UserModel.findById(id);
    }

    async findOne(query) {
        return await UserModel.findOne(query);
    }

    async save(userData) {
        const user = new UserModel(userData);
        return await user.save();
    }

    async update(id, userData) {
        return await UserModel.findByIdAndUpdate(id, userData);
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}

export default new UserDao();