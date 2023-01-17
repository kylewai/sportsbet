import * as accountData from "../db/accountData";

export const addBalance = (userId: number, balance: number) => {
    if (balance < 0) {
        throw new Error("cannot add negative balances");
    }
    console.log(balance);
    return accountData.addBalance(userId, balance);
}

export const getBalance = async (userId: number) => {
    const betAccount = await accountData.getAccount(userId);
    return +betAccount[0].balance;
}