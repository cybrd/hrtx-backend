import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 } from "uuid";

import { db } from "../connections";

import { Member } from "../models/member";
import { authUser } from "../middlewares/auth";

import {
  createMember,
  deleteMember,
  deleteMemberActivityByMemberId,
  getMemberById,
  getMembers,
  updateMember,
} from "../services/member";

export const memberController = Router();

memberController.get("/", authUser(), (req, res) => {
  (async () => {
    const result = await getMembers(db);

    res.json(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

memberController.get("/:id", authUser(), (req, res) => {
  (async () => {
    const result = await getMemberById(db, req.params.id);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

memberController.put("/:id", authUser(), (req, res) => {
  (async () => {
    const body = req.body as Member;

    const result = await updateMember(db, req.params.id, body);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

memberController.post("/", authUser(), (req, res) => {
  (async () => {
    const body = req.body as Member;
    const id = v4();

    const result = await createMember(db, {
      ...body,
      id,
    });

    res.json(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

memberController.delete("/:id", authUser(), (req, res) => {
  (async () => {
    await deleteMemberActivityByMemberId(db, req.params.id);
    const result = await deleteMember(db, req.params.id);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});