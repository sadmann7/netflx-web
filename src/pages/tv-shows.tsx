import Head from "next/head";
import { NextPageWithLayout } from "./_app";

// external imports
import DefaultLayout from "@/layouts/DefaultLayout";

const TVShows: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>TV Shows | Netflx</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center space-y-2">
        <h1 className="text-white text-2xl md:text-3xl font-semibold">
          TV Shows Page
        </h1>
        <p className="text-gray-300/60 text-sm md:text-base">
          under construction, please visit later
        </p>
      </div>
    </>
  );
};

export default TVShows;

TVShows.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
