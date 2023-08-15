import express from "express";

const storageMock = {}

export const mock = function (app) {
    app.get(
        '/min-side-arbeidsgiver/api/storage/:key',
        (req, res) => {
            const storageItem = storageMock[req.params.key]
            console.log("get storage for key", req.params.key, "=>", storageItem ? "found" : "not found", storageItem)
            if (storageItem) {
                res.set({
                    'Content-Type': 'application/json',
                    'version': `${storageItem.version}`,
                }).send(storageItem.value)
            } else {
                res.status(204).send()
            }
        });
    app.put(
        '/min-side-arbeidsgiver/api/storage/:key',
        express.json(),
        (req, res) => {
            const storageItem = storageMock[req.params.key];
            if (req.query.version && storageItem && `${storageItem.version}` !== req.query.version) {
                console.log("put storage for key", req.params.key, "=>", req.body, "failed due to version mismatch")
                res.status(409).set({
                    'Content-Type': 'application/json',
                    'version': `${storageItem.version}`,
                }).send(storageItem.value)
            } else {
                console.log("put storage for key", req.params.key, "=>", req.body)

                storageMock[req.params.key] = {
                    value: req.body,
                    version: storageItem && storageItem.version ? storageItem.version + 1 : 1
                }
                res.set({
                    'Content-Type': 'application/json',
                    'version': storageMock[req.params.key].version,
                }).send(storageMock[req.params.key].value)
            }

        });
    app.delete(
        '/min-side-arbeidsgiver/api/storage/:key',
        (req, res) => {
            const storageItem = storageMock[req.params.key];
            if (req.query.version && storageItem && `${storageItem.version}` !== req.query.version) {
                console.log("delete storage for key", req.params.key, "=>", req.body, "failed due to version mismatch")

                res.status(409).set({
                    'Content-Type': 'application/json',
                    'version': `${storageItem.version}`,
                }).send(storageItem.value)
            } else {
                console.log("delete storage for key", req.params.key, "=>", req.body)

                delete storageMock[req.params.key]
                res.set({
                    'Content-Type': 'application/json',
                    'version': `${storageItem.version}`,
                }).send(storageItem.value)
            }
        });
}
