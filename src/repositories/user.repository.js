import UserDao from "../dao/user.dao.js";

class UserRepository {
    async createUser(userData) {
        return await UserDao.save(userData);
    }

    async findUserByEmail(email) {
        return await UserDao.findOne({ email });
    }

    async updateUser(id, userData) {
        return await UserDao.update(id, userData);
    }

    async deleteUser(id) {
        return await UserDao.delete(id);
    }

    async getUserById(userId) {
        return await UserDao.findById(userId);
    }
}

export default UserRepository;