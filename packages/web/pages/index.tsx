import type { NextPage } from "next";

import { useRouter } from "next/router";
import Layout from "components/Layout";
import { useEffect } from "react";

const Landing: NextPage = ({}) => {
  const router = useRouter();
  useEffect(() => {
    router.push("/onboard");
  }, [router]);

  return <Layout>LandingPage</Layout>;
};

export default Landing;
