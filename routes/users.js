const express = require("express");
const router = express.Router();
const { db } = require("../firebase.js");
const verifyToken = require("../middleware/auth");

// 1. Create user document after Firebase signup

router.post("/signup", verifyToken, async (req, res) => {
  const { uid, name, email, tokens , swaps} = req.body;

  try {
    await db.collection("users").doc(uid).set({
      name,
      email,
      swaps,
      tokens,
      wallet: [],
      coupons: [],
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// 2. Get user by UID
router.get("/:uid", verifyToken, async (req, res) => {
  const uid = req.params.uid;

  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userDoc.data());
  } catch (err) {
    res.status(500).json({ error: "Failed to get user" });
  }
});

// 3. Update user wallet or coupons
router.put("/wallet", verifyToken, async (req, res) => {
  const { uid, wallet } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "UID is required" });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      ...(wallet && { wallet }),
    });

    res.json({ message: "Wallet updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;
