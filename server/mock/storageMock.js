import express from "express";

const storageMock = {}

export const mock = function (app) {
    app.get(
        '/min-side-arbeidsgiver/api/storage/:key',
        (req, res) => {
            console.log("get storage for key", req.params.key, "=>", storageMock[req.params.key] ? "found" : "not found")
            const data = storageMock[req.params.key]
            if (data) {
                res.set({
                    'Content-Type': 'application/json',
                    'version': 1,
                }).send(data)
            } else {
                res.status(204).send()
            }
        });
    app.put(
        '/min-side-arbeidsgiver/api/storage/:key',
        express.json(),
        (req, res) => {
            // todo: simulate optimistic locking
            // const version = req.query.version
            console.log("put storage for key", req.params.key, "=>", req.body);
            storageMock[req.params.key] = req.body
            res.status(200).send()
        });
    app.delete(
        '/min-side-arbeidsgiver/api/storage/:key',
        (req, res) => {
            // todo: simulate optimistic locking
            // const version = req.query.version
            delete storageMock[req.params.key]
            res.status(200).send()
        });
}
