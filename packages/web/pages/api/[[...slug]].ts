import axios from "lib/axios";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import nc from "next-connect";

const WALLET_MNEMONIC = process.env.WALLET_MNEMONIC || "";

const wallet = ethers.Wallet.fromMnemonic(WALLET_MNEMONIC);

export default nc<NextApiRequest, NextApiResponse>({ attachParams: true }).post(
  "/api/signature",
  async (req, res) => {
    const session = await getSession({ req });
    console.log("session", session);
    const { repo, address } = req.body;

    const { owner } = await axios.get(`https://api.github.com/repos/${repo}`);

    if (owner.id !== session?.githubId) {
      throw new Error("User not authorized to create project with this repo");
    }
    const hash = ethers.utils.solidityKeccak256(
      ["bytes"],
      [ethers.utils.solidityPack(["string", "address"], [repo, address])]
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

    res.status(200).json({ hash, signature });
  }
);
