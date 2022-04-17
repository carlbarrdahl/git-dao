import type { NextPage } from "next";

import { useRouter } from "next/router";
import Layout from "layouts/Layout";
import { useEffect } from "react";

const Landing: NextPage = ({}) => {
  const router = useRouter();
  useEffect(() => {
    router.push("/carlbarrdahl/git-dao");
  }, [router]);

  return <Layout>LandingPage</Layout>;
};

export default Landing;
