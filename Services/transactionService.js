const TransactionType = require("../models/transactionType");
const Transaction = require("../models/transaction");
const User = require("../models/user");

const getTransactionTypeId = async (name) => {
    try {
        transactionType = await TransactionType.findOne({
            name: name,
        });
        return transactionType._id;
    } catch (err) {
        throw err;
    }
};

const getAllTransactions = async (user) => {
    try {
        console.log("current user", user.userName);
        if (user.userRole.priority == 4) return await getTransaction(user);
        else if (user.userRole.priority < 4) {
            let transactions = await getTransaction(user);
            let users = await User.find({ parent: user._id }).populate(
                "userRole"
            );
            for (let idx = 0; idx < users.length; idx++) {
                // console.log("finding children", users[idx].userName);
                transactions = transactions.concat(
                    await getAllTransactions(users[idx])
                );
            }
            return transactions;
        }
    } catch (err) {
        throw err;
    }
};

const getTransaction = async (user) => {
    try {
        let transactions;
        if (user.userRole.priority == 1)
            transactions = await Transaction.find({ admin: user._id, type: 12 })
                .populate("admin")
                .populate("agent")
                .populate("distributor")
                .populate("cashier")
                .populate("customer")
                .populate("shop");
        else if (user.userRole.priority == 2)
            transactions = await Transaction.find({ agent: user._id, type: 23 })
                .populate("admin")
                .populate("agent")
                .populate("distributor")
                .populate("cashier")
                .populate("customer")
                .populate("shop");
        else if (user.userRole.priority == 3)
            transactions = await Transaction.find({
                distributor: user._id,
                type: 34,
            })
                .populate("admin")
                .populate("agent")
                .populate("distributor")
                .populate("cashier")
                .populate("customer")
                .populate("shop");
        else if (user.userRole.priority == 4)
            transactions = await Transaction.find({
                cashier: user._id,
                type: 45,
            })
                .populate("admin")
                .populate("agent")
                .populate("distributor")
                .populate("cashier")
                .populate("customer")
                .populate("shop");
        return transactions;
    } catch (err) {
        throw err;
    }
};

const TransactionService = {
    getAllTransactions,
};

module.exports = TransactionService;
