const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ==========================
// ROUTES
// ==========================

// Health Check
app.get('/health', (req, res) => {
    res.json("This is the health check");
});

// --------------------------
// Transaction Routes
// --------------------------

// ADD TRANSACTION
function addTransactionHandler(req, res) {
    try {
        console.log(req.body);
        console.log(req.body.amount);
        console.log(req.body.desc);
        var success = transactionService.addTransaction(req.body.amount, req.body.desc);
        if (success === 200) {
            res.json({ message: 'added transaction successfully' });
        } else {
            res.status(500).json({ message: 'transaction may not have been added' });
        }
    } catch (err) {
        res.status(500).json({ message: 'something went wrong', error: err.message });
    }
}

// GET ALL TRANSACTIONS
function getAllTransactionsHandler(req, res) {
    try {
        var transactionList = [];
        transactionService.getAllTransactions(function (results) {
            console.log("we are in the call back:");
            for (const row of results) {
                transactionList.push({ "id": row.id, "amount": row.amount, "description": row.description });
            }
            console.log(transactionList);
            res.status(200).json({ "result": transactionList });
        });
    } catch (err) {
        res.status(500).json({ message: "could not get all transactions", error: err.message });
    }
}

// DELETE ALL TRANSACTIONS
function deleteAllTransactionsHandler(req, res) {
    try {
        transactionService.deleteAllTransactions(function (result) {
            res.status(200).json({ message: "delete function execution finished." });
        });
    } catch (err) {
        res.status(500).json({ message: "Deleting all transactions may have failed.", error: err.message });
    }
}

// DELETE ONE TRANSACTION
function deleteTransactionByIdHandler(req, res) {
    try {
        transactionService.deleteTransactionById(req.body.id, function (result) {
            res.status(200).json({ message: `transaction with id ${req.body.id} seemingly deleted` });
        });
    } catch (err) {
        res.status(500).json({ message: "error deleting transaction", error: err.message });
    }
}

// GET SINGLE TRANSACTION
function getTransactionByIdHandler(req, res) {
    try {
        transactionService.findTransactionById(req.body.id, function (result) {
            if (result.length > 0) {
                var id = result[0].id;
                var amt = result[0].amount;
                var desc = result[0].desc;
                res.status(200).json({ "id": id, "amount": amt, "desc": desc });
            } else {
                res.status(404).json({ message: "transaction not found" });
            }
        });
    } catch (err) {
        res.status(500).json({ message: "error retrieving transaction", error: err.message });
    }
}

// --------------------------
// Register Routes for /transaction
// --------------------------
app.post('/transaction', addTransactionHandler);
app.get('/transaction', getAllTransactionsHandler);
app.delete('/transaction', deleteAllTransactionsHandler);
app.delete('/transaction/id', deleteTransactionByIdHandler);
app.get('/transaction/id', getTransactionByIdHandler);

// --------------------------
// Register Routes for /api/transaction
// --------------------------
app.post('/api/transaction', addTransactionHandler);
app.get('/api/transaction', getAllTransactionsHandler);
app.delete('/api/transaction', deleteAllTransactionsHandler);
app.delete('/api/transaction/id', deleteTransactionByIdHandler);
app.get('/api/transaction/id', getTransactionByIdHandler);

// --------------------------
// Start server
// --------------------------
app.listen(port, () => {
    console.log(`AB3 backend app listening at http://localhost:${port}`);
});