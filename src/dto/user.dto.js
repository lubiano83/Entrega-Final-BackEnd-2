class UserDTO {
    constructor(user) {
        this.email = user.email;
        this.fullName = `${user.firstName} ${user.lastName}`;
    }
}

export default UserDTO;