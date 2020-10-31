
interface UserInfoType {
    userId: string,
    gender: number,
    username: string,
}

interface SingleType {
    userInfo: UserInfoType | object;

    setUserInfo (info?: UserInfoType): void;
}

const single: SingleType = {
    userInfo: {},


    setUserInfo (userInfo) {
        this.userInfo = userInfo || {};
    }
};

export default single;
